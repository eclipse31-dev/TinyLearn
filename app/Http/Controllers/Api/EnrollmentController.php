<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EnrollmentController extends Controller
{
    /**
     * Get all enrollments
     */
    public function index()
    {
        $enrollments = Enrollment::with(['user', 'course'])->get();
        return response()->json($enrollments);
    }

    /**
     * Get enrollments for a course
     */
    public function byCourse($courseId)
    {
        $course = Course::findOrFail($courseId);
        $enrollments = $course->enrollments()->with('user')->get();
        return response()->json($enrollments);
    }

    /**
     * Get a specific enrollment
     */
    public function show($id)
    {
        $enrollment = Enrollment::with(['user', 'course'])->findOrFail($id);
        return response()->json($enrollment);
    }

    /**
     * Create a new enrollment
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'course_id' => 'required|exists:courses,id',
                'status' => 'sometimes|in:active,dropped,completed',
            ]);

            // Check if enrollment already exists
            if (Enrollment::where('user_id', $validated['user_id'])
                ->where('course_id', $validated['course_id'])
                ->exists()) {
                return response()->json(['message' => 'Enrollment already exists'], 400);
            }

            $enrollment = Enrollment::create([
                'user_id' => $validated['user_id'],
                'course_id' => $validated['course_id'],
                'status' => $validated['status'] ?? 'active',
                'enrolled_at' => now(),
            ]);

            return response()->json([
                'message' => 'Enrollment created successfully',
                'enrollment' => $enrollment->load(['user', 'course']),
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Update an enrollment
     */
    public function update(Request $request, $id)
    {
        try {
            $enrollment = Enrollment::findOrFail($id);

            $validated = $request->validate([
                'status' => 'sometimes|in:active,dropped,completed',
            ]);

            $enrollment->update($validated);

            return response()->json([
                'message' => 'Enrollment updated successfully',
                'enrollment' => $enrollment->load(['user', 'course']),
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Delete an enrollment
     */
    public function destroy($id)
    {
        try {
            $enrollment = Enrollment::findOrFail($id);
            $enrollment->delete();

            return response()->json(['message' => 'Enrollment deleted successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete enrollment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
