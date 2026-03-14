<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class AdminCourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::with('instructor');

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('course_name', 'like', "%$search%")
                  ->orWhere('course_code', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by instructor
        if ($request->has('instructor_id')) {
            $query->where('instructor_ID', $request->instructor_id);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        return $query->withCount('enrollments')->paginate($perPage);
    }

    public function show($id)
    {
        $course = Course::with(['instructor', 'enrollments', 'modules', 'assignments'])
            ->withCount('enrollments')
            ->findOrFail($id);
        
        return response()->json($course);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_code' => 'required|string|unique:courses,course_code',
            'course_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'instructor_ID' => 'required|exists:users,user_ID',
            'max_students' => 'nullable|integer|min:1',
            'credits' => 'nullable|integer|min:1',
            'semester' => 'nullable|string',
            'status' => 'nullable|in:active,inactive,archived,draft',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        $course = Course::create($validated);
        return response()->json(['message' => 'Course created successfully', 'course' => $course], 201);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $validated = $request->validate([
            'course_code' => 'string|unique:courses,course_code,' . $id . ',course_ID',
            'course_name' => 'string|max:255',
            'description' => 'nullable|string',
            'instructor_ID' => 'exists:users,user_ID',
            'max_students' => 'nullable|integer|min:1',
            'credits' => 'nullable|integer|min:1',
            'semester' => 'nullable|string',
            'status' => 'in:active,inactive,archived,draft',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        $course->update($validated);
        return response()->json(['message' => 'Course updated successfully', 'course' => $course]);
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        
        // Check if course has enrollments
        if ($course->enrollments()->count() > 0) {
            return response()->json(['error' => 'Cannot delete course with active enrollments'], 403);
        }

        $course->delete();
        return response()->json(['message' => 'Course deleted successfully']);
    }

    public function enrollments($id)
    {
        $course = Course::findOrFail($id);
        
        $enrollments = Enrollment::where('course_ID', $id)
            ->with('user')
            ->paginate(20);
        
        return response()->json($enrollments);
    }

    public function removeEnrollment(Request $request, $id)
    {
        $enrollment = Enrollment::findOrFail($id);
        $enrollment->delete();
        
        return response()->json(['message' => 'Enrollment removed successfully']);
    }

    public function bulkStatusUpdate(Request $request)
    {
        $validated = $request->validate([
            'course_ids' => 'required|array',
            'status' => 'required|in:active,inactive,archived,draft',
        ]);

        Course::whereIn('course_ID', $validated['course_ids'])
            ->update(['status' => $validated['status']]);

        return response()->json(['message' => 'Courses updated successfully']);
    }
}
