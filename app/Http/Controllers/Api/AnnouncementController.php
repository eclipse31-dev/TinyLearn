<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AnnouncementController extends Controller
{
    /**
     * Display all announcements for a course
     */
    public function index($courseId)
    {
        $course = Course::findOrFail($courseId);
        $announcements = $course->announcements()
            ->orderByDesc('created_at')
            ->get();
        return response()->json($announcements);
    }

    /**
     * Store a new announcement
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'course_ID' => 'required|integer|exists:courses,course_ID',
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'attachment_ID' => 'nullable|integer|exists:attachments,attachment_ID',
            ]);

            // Set created_by to current user
            $validated['created_by'] = auth()->check() ? auth()->user()->user_ID : null;

            $announcement = Announcement::create($validated);

            // Broadcast the event
            event(new \App\Events\AnnouncementCreated($announcement));

            return response()->json([
                'message' => 'Announcement created successfully',
                'announcement' => $announcement,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating announcement',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display a specific announcement
     */
    public function show($id)
    {
        try {
            $announcement = Announcement::findOrFail($id);
            return response()->json($announcement);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Announcement not found',
            ], 404);
        }
    }

    /**
     * Update an announcement
     */
    public function update(Request $request, $id)
    {
        try {
            $announcement = Announcement::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'content' => 'sometimes|string',
                'posted_at' => 'nullable|datetime',
            ]);

            $announcement->update($validated);

            return response()->json([
                'message' => 'Announcement updated successfully',
                'announcement' => $announcement,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating announcement',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an announcement
     */
    public function destroy($id)
    {
        try {
            $announcement = Announcement::findOrFail($id);
            $announcement->delete();

            return response()->json([
                'message' => 'Announcement deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting announcement',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
