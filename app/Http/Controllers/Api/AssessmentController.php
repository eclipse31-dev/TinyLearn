<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AssessmentController extends Controller
{
    /**
     * Get all assessments for a course (through modules)
     */
    public function getByCourse($courseId)
    {
        try {
            // Get all modules for the course, then get their assessments
            $assessments = Assessment::whereHas('module', function ($query) use ($courseId) {
                $query->where('course_ID', $courseId);
            })
            ->orderBy('due_date')
            ->get();

            return response()->json($assessments);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching assessments',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all assessments for a specific module
     */
    public function index($moduleId)
    {
        try {
            $module = Module::findOrFail($moduleId);
            $assessments = $module->assessments()
                ->orderBy('due_date')
                ->get();

            return response()->json($assessments);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Module not found',
            ], 404);
        }
    }

    /**
     * Store a new assessment for a module
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'module_ID' => 'required|integer|exists:modules,module_ID',
                'due_date' => 'required|date',
                'status' => 'nullable|in:draft,published,closed',
                'attachment_ID' => 'nullable|integer|exists:attachments,attachment_ID',
            ]);

            // Set created_by to current user
            $validated['created_by'] = auth()->check() ? auth()->user()->user_ID : null;

            // Set default status if not provided
            if (!isset($validated['status'])) {
                $validated['status'] = 'draft';
            }

            $assessment = Assessment::create($validated);

            return response()->json([
                'message' => 'Assessment created successfully',
                'assessment' => $assessment,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating assessment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display a specific assessment
     */
    public function show($id)
    {
        try {
            $assessment = Assessment::findOrFail($id);
            return response()->json($assessment);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Assessment not found',
            ], 404);
        }
    }

    /**
     * Update an assessment
     */
    public function update(Request $request, $id)
    {
        try {
            $assessment = Assessment::findOrFail($id);

            $validated = $request->validate([
                'due_date' => 'sometimes|date',
                'status' => 'sometimes|in:draft,published,closed',
                'attachment_ID' => 'nullable|integer|exists:attachments,attachment_ID',
            ]);

            $assessment->update($validated);

            return response()->json([
                'message' => 'Assessment updated successfully',
                'assessment' => $assessment,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Assessment not found',
            ], 404);
        }
    }

    /**
     * Delete an assessment
     */
    public function destroy($id)
    {
        try {
            $assessment = Assessment::findOrFail($id);
            $assessment->delete();

            return response()->json([
                'message' => 'Assessment deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Assessment not found',
            ], 404);
        }
    }
}
