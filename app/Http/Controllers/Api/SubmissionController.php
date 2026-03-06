<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\SubmissionFile;
use App\Models\Assignment;
use App\Models\Grade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class SubmissionController extends Controller
{
    /**
     * Get all submissions for an assignment
     */
    public function index($assignmentId)
    {
        $assignment = Assignment::findOrFail($assignmentId);
        $submissions = $assignment->submissions()->with('user', 'files')->get();
        return response()->json($submissions);
    }

    /**
     * Get user's submission for an assignment
     */
    public function getUserSubmission($assignmentId)
    {
        $user = Auth::user();
        $submission = Submission::where('assessment_id', $assignmentId)
            ->where('user_id', $user->user_ID)
            ->with(['files', 'grades'])
            ->first();

        return response()->json($submission ?: ['message' => 'No submission found']);
    }

    /**
     * Create or update a submission
     */
    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            
            $validated = $request->validate([
                'assignment_id' => 'required|exists:assessments,assessment_ID',
                'notes' => 'nullable|string',
                'status' => 'nullable|in:draft,submitted,graded',
            ]);

            $validated['user_id'] = $user->user_ID;
            $validated['assessment_id'] = $validated['assignment_id'];
            unset($validated['assignment_id']);
            
            if (!isset($validated['status'])) {
                $validated['status'] = 'submitted';
            }
            
            if ($validated['status'] === 'submitted') {
                $validated['submitted_at'] = now();
            }

            // Check if submission already exists
            $submission = Submission::updateOrCreate(
                [
                    'assessment_id' => $validated['assessment_id'],
                    'user_id' => $validated['user_id'],
                ],
                $validated
            );

            return response()->json([
                'message' => 'Submission created successfully',
                'submission' => $submission->load('files'),
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Add a file to submission
     */
    public function addFile(Request $request, $submissionId)
    {
        try {
            $submission = Submission::findOrFail($submissionId);
            
            // Verify user owns this submission
            if ($submission->user_id !== Auth::user()->user_ID) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $validated = $request->validate([
                'type' => 'required|in:link,file,image,video',
                'url' => 'nullable|url|required_if:type,link,video',
                'file' => 'nullable|file|required_if:type,file,image|mimes:pdf,doc,docx,jpg,jpeg,png,mp4,webm',
            ]);

            $submissionFile = new SubmissionFile(['type' => $validated['type']]);

            if ($validated['type'] === 'link' || $validated['type'] === 'video') {
                $submissionFile->url = $validated['url'];
            }

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $path = $file->store('submissions/' . $submissionId, 'public');
                
                $submissionFile->file_path = $path;
                $submissionFile->file_name = $file->getClientOriginalName();
                $submissionFile->file_size = $file->getSize();
                $submissionFile->mime_type = $file->getMimeType();
            }

            $submission->files()->save($submissionFile);

            return response()->json([
                'message' => 'File added to submission',
                'file' => $submissionFile,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Remove a file from submission
     */
    public function removeFile($fileId)
    {
        try {
            $submissionFile = SubmissionFile::findOrFail($fileId);
            
            // Verify user owns this submission
            if ($submissionFile->submission->user_id !== Auth::user()->user_ID) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Delete file from storage
            if ($submissionFile->file_path && Storage::disk('public')->exists($submissionFile->file_path)) {
                Storage::disk('public')->delete($submissionFile->file_path);
            }

            $submissionFile->delete();

            return response()->json(['message' => 'File removed from submission']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to remove file',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get submission details
     */
    public function show($id)
    {
        $submission = Submission::with(['user', 'files', 'assignment', 'grades'])->findOrFail($id);
        return response()->json($submission);
    }

    /**
     * Grade a submission (instructor only)
     */
    public function grade(Request $request, $id)
    {
        try {
            $submission = Submission::findOrFail($id);

            $validated = $request->validate([
                'score' => 'required|numeric|min:0|max:100',
                'feedback' => 'nullable|string',
            ]);

            // Create or update grade record
            $grade = Grade::updateOrCreate(
                ['submission_ID' => $id],
                [
                    'score' => $validated['score'],
                    'feedback' => $validated['feedback'],
                    'graded_by' => auth()->user()->user_ID,
                ]
            );

            // Broadcast the grade update event
            event(new \App\Events\GradeUpdated($grade));

            // Update submission status
            $submission->update(['status' => 'graded']);

            return response()->json([
                'message' => 'Submission graded successfully',
                'submission' => $submission->load('grades'),
                'grade' => $grade,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Delete a submission
     */
    public function destroy($id)
    {
        try {
            $submission = Submission::findOrFail($id);

            // Verify user owns this submission
            if ($submission->user_id !== Auth::user()->user_ID) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Delete all submission files
            foreach ($submission->files as $file) {
                if ($file->file_path && Storage::disk('public')->exists($file->file_path)) {
                    Storage::disk('public')->delete($file->file_path);
                }
                $file->delete();
            }

            $submission->delete();

            return response()->json(['message' => 'Submission deleted successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete submission',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
