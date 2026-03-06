<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Schedule;
use App\Models\Assessment;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    public function index()
    {
        return response()->json(
            Course::with('creator')
                ->withCount('enrollments')
                ->orderBy('title')
                ->get()
                ->map(function ($course) {
                    return [
                        ...$course->toArray(),
                        'students_enrolled' => $course->enrollments_count
                    ];
                })
        );
    }

    public function show($id)
    {
        $course = Course::with([
            'creator',
            'schedules',
            'enrollments'
        ])->withCount('enrollments')
          ->findOrFail($id);

        return response()->json([
            ...$course->toArray(),
            'students_enrolled' => $course->enrollments_count
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:courses,title,NULL,course_ID',
            'description' => 'nullable|string',
            'status' => 'nullable|in:draft,active,archived',
            'header_image_url' => 'nullable|string',
            'has_schedule' => 'nullable|boolean',
            'days_of_week' => 'nullable|array',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'recurrence_pattern' => 'nullable|in:daily,weekly,monthly',
            'recurrence_end_date' => 'nullable|date',
        ]);

        // Extract schedule-related fields
        $scheduleData = [
            'has_schedule' => $validated['has_schedule'] ?? false,
            'days_of_week' => $validated['days_of_week'] ?? [],
            'start_time' => $validated['start_time'] ?? null,
            'end_time' => $validated['end_time'] ?? null,
            'recurrence_pattern' => $validated['recurrence_pattern'] ?? 'weekly',
            'recurrence_end_date' => $validated['recurrence_end_date'] ?? null,
        ];

        // Remove schedule fields from validated data before creating course
        $courseData = $validated;
        unset($courseData['has_schedule'], $courseData['days_of_week'], $courseData['start_time'], $courseData['end_time'], $courseData['recurrence_pattern'], $courseData['recurrence_end_date']);

        $courseData['slug'] = Str::slug($courseData['title']);
        $courseData['course_code'] = 'C' . strtoupper(Str::random(6));
        $courseData['status'] = $courseData['status'] ?? 'draft';
        $courseData['created_by'] = Auth::id();

        $course = Course::create($courseData);

        // Create schedules if enabled
        if ($scheduleData['has_schedule'] && !empty($scheduleData['days_of_week'])) {
            foreach ($scheduleData['days_of_week'] as $day) {
                if (!empty($scheduleData['start_time']) && !empty($scheduleData['end_time'])) {
                    Schedule::create([
                        'course_ID' => $course->course_ID,
                        'day_in_week' => $day,
                        'start_time' => $scheduleData['start_time'],
                        'end_time' => $scheduleData['end_time'],
                        'is_recurring' => 'yes',
                        'recurrence_pattern' => $scheduleData['recurrence_pattern'],
                        'recurrence_end_date' => $scheduleData['recurrence_end_date'],
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 'Course created successfully',
            'course' => $course->load('creator', 'schedules')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255|unique:courses,title,' . $id . ',course_ID',
            'description' => 'nullable|string',
            'status' => 'nullable|in:draft,active,archived',
            'header_image_url' => 'nullable|string',
            'has_schedule' => 'nullable|boolean',
            'days_of_week' => 'nullable|array',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'recurrence_pattern' => 'nullable|in:daily,weekly,monthly',
            'recurrence_end_date' => 'nullable|date',
        ]);

        // Extract schedule-related fields
        $scheduleData = [
            'has_schedule' => $validated['has_schedule'] ?? false,
            'days_of_week' => $validated['days_of_week'] ?? [],
            'start_time' => $validated['start_time'] ?? null,
            'end_time' => $validated['end_time'] ?? null,
            'recurrence_pattern' => $validated['recurrence_pattern'] ?? 'weekly',
            'recurrence_end_date' => $validated['recurrence_end_date'] ?? null,
        ];

        // Remove schedule fields from validated data before updating course
        $courseData = $validated;
        unset($courseData['has_schedule'], $courseData['days_of_week'], $courseData['start_time'], $courseData['end_time'], $courseData['recurrence_pattern'], $courseData['recurrence_end_date']);

        if (isset($courseData['title'])) {
            $courseData['slug'] = Str::slug($courseData['title']);
        }

        $course->update($courseData);

        // Handle schedules
        Schedule::where('course_ID', $course->course_ID)->delete();

        if ($scheduleData['has_schedule'] && !empty($scheduleData['days_of_week'])) {
            foreach ($scheduleData['days_of_week'] as $day) {
                if (!empty($scheduleData['start_time']) && !empty($scheduleData['end_time'])) {
                    Schedule::create([
                        'course_ID' => $course->course_ID,
                        'day_in_week' => $day,
                        'start_time' => $scheduleData['start_time'],
                        'end_time' => $scheduleData['end_time'],
                        'is_recurring' => 'yes',
                        'recurrence_pattern' => $scheduleData['recurrence_pattern'],
                        'recurrence_end_date' => $scheduleData['recurrence_end_date'],
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 'Course updated successfully',
            'course' => $course->load('creator', 'schedules')
        ]);
    }
    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return response()->json([
            'message' => 'Course deleted successfully'
        ]);
    }

    public function getAnnouncements($id)
    {
        try {
            $course = Course::findOrFail($id);
            $announcements = $course->announcements()
                ->orderByDesc('created_at')
                ->get();
            return response()->json($announcements);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Course not found',
            ], 404);
        }
    }

    public function getAssessments($id)
    {
        try {
            $course = Course::findOrFail($id);
            // Get all assessments for all modules in this course
            $assessments = Assessment::whereHas('module', function ($query) use ($id) {
                $query->where('course_ID', $id);
            })
            ->orderBy('due_date')
            ->get();
            return response()->json($assessments);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Course not found',
            ], 404);
        }
    }

    public function getMaterials($id)
    {
        try {
            $course = Course::findOrFail($id);
            // Get all materials for all modules in this course
            $materials = Material::whereHas('module', function ($query) use ($id) {
                $query->where('course_ID', $id);
            })
            ->orderByDesc('created_at')
            ->get();
            return response()->json($materials);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Course not found',
            ], 404);
        }
    }

    public function getAssignments($id)
    {
        try {
            $course = Course::findOrFail($id);
            // Get all assessments for all modules in this course (backwards compatibility)
            $assessments = Assessment::whereHas('module', function ($query) use ($id) {
                $query->where('course_ID', $id);
            })
            ->orderBy('due_date')
            ->get();
            return response()->json($assessments);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Course not found',
            ], 404);
        }
    }

    public function getResources($id)
    {
        try {
            $course = Course::findOrFail($id);
            // Get all materials for all modules in this course (backwards compatibility)
            $materials = Material::whereHas('module', function ($query) use ($id) {
                $query->where('course_ID', $id);
            })
            ->orderByDesc('created_at')
            ->get();
            return response()->json($materials);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Course not found',
            ], 404);
        }
    }
}