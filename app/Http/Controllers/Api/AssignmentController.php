<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AssignmentController extends Controller
{
    /**
     * Display all assignments for a course
     */
    public function index($courseId)
    {
        $course = Course::findOrFail($courseId);
        $assignments = $course->assignments()->orderBy('due_date')->get();
        return response()->json($assignments);
    }

    /**
     * Store a new assignment
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'course_id' => 'required|integer|exists:courses,course_ID',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'due_date' => 'required|date',
            ]);

            $assignment = Assignment::create($validated);

            return response()->json([
                'message' => 'Assignment created successfully',
                'assignment' => $assignment,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating assignment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display a specific assignment
     */
    public function show($id)
    {
        try {
            $assignment = Assignment::findOrFail($id);
            return response()->json($assignment);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Assignment not found',
            ], 404);
        }
    }

    /**
     * Update an assignment
     */
    public function update(Request $request, $id)
    {
        try {
            $assignment = Assignment::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'due_date' => 'sometimes|date',
            ]);

            $assignment->update($validated);

            return response()->json([
                'message' => 'Assignment updated successfully',
                'assignment' => $assignment,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating assignment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an assignment
     */
    public function destroy($id)
    {
        try {
            $assignment = Assignment::findOrFail($id);
            $assignment->delete();

            return response()->json([
                'message' => 'Assignment deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting assignment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
