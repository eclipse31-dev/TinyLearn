<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    /**
     * Get schedules for a specific week with proper recurring expansion
     */
    public function getWeekSchedules(Request $request)
    {
        $user = Auth::user();
        $date = $request->query('date', now()->toDateString());
        
        $startOfWeek = Carbon::createFromFormat('Y-m-d', $date)->startOfWeek();
        $endOfWeek = $startOfWeek->copy()->endOfWeek();

        // Use expanded method to include recurring schedules
        $schedules = Schedule::getExpandedByDateRange($user->user_ID, $startOfWeek, $endOfWeek);

        return response()->json([
            'message' => 'Week schedules retrieved successfully',
            'data' => [
                'week_start' => $startOfWeek->toDateString(),
                'week_end' => $endOfWeek->toDateString(),
                'schedules' => $schedules->map(function ($schedule) {
                    return $this->formatSchedule($schedule);
                }),
            ],
        ]);
    }

    /**
     * Get schedules for a specific month with proper recurring expansion
     */
    public function getMonthSchedules(Request $request)
    {
        $user = Auth::user();
        $date = $request->query('date', now()->toDateString());
        
        $startOfMonth = Carbon::createFromFormat('Y-m-d', $date)->startOfMonth();
        $endOfMonth = $startOfMonth->copy()->endOfMonth();

        // Use expanded method to include recurring schedules
        $schedules = Schedule::getExpandedByDateRange($user->user_ID, $startOfMonth, $endOfMonth);

        return response()->json([
            'message' => 'Month schedules retrieved successfully',
            'data' => [
                'month_start' => $startOfMonth->toDateString(),
                'month_end' => $endOfMonth->toDateString(),
                'schedules' => $schedules->map(function ($schedule) {
                    return $this->formatSchedule($schedule);
                }),
            ],
        ]);
    }

    /**
     * Get all upcoming schedules with proper recurring expansion
     */
    public function getUpcomingSchedules(Request $request)
    {
        $user = Auth::user();
        $days = $request->query('days', 30);

        // Use expanded method to include recurring schedules
        $schedules = Schedule::getUpcomingExpanded($user->user_ID, $days);

        return response()->json([
            'message' => 'Upcoming schedules retrieved successfully',
            'data' => [
                'schedules' => $schedules->map(function ($schedule) {
                    return $this->formatSchedule($schedule);
                }),
            ],
        ]);
    }

    /**
     * Get schedules for a specific date with proper recurring expansion
     */
    public function getDaySchedules(Request $request)
    {
        $request->validate([
            'date' => 'required|date_format:Y-m-d',
        ]);

        $user = Auth::user();
        $date = $request->input('date');
        
        $startOfDay = Carbon::createFromFormat('Y-m-d', $date)->startOfDay();
        $endOfDay = $startOfDay->copy()->endOfDay();

        // Use expanded method to include recurring schedules
        $schedules = Schedule::getExpandedByDateRange($user->user_ID, $startOfDay, $endOfDay);

        return response()->json([
            'message' => 'Day schedules retrieved successfully',
            'data' => [
                'date' => $date,
                'schedules' => $schedules->map(function ($schedule) {
                    return $this->formatSchedule($schedule);
                }),
            ],
        ]);
    }

    /**
     * Create a new schedule
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:class,activity,assignment,exam,event',
            'start_time' => 'required|date_format:Y-m-d H:i',
            'end_time' => 'required|date_format:Y-m-d H:i|after:start_time',
            'course_id' => 'nullable|exists:courses,id',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'color' => 'nullable|string|size:7',
            'is_recurring' => 'nullable|boolean',
            'recurrence_pattern' => 'nullable|in:daily,weekly,biweekly,monthly',
            'recurrence_end_date' => 'nullable|date_format:Y-m-d',
        ]);

        $user = Auth::user();

        $schedule = Schedule::create([
            'user_id' => $user->user_ID,
            'title' => $request->input('title'),
            'type' => $request->input('type'),
            'start_time' => $request->input('start_time'),
            'end_time' => $request->input('end_time'),
            'course_id' => $request->input('course_id'),
            'description' => $request->input('description'),
            'location' => $request->input('location'),
            'color' => $request->input('color', '#3B82F6'),
            'is_recurring' => $request->input('is_recurring', false),
            'recurrence_pattern' => $request->input('recurrence_pattern'),
            'recurrence_end_date' => $request->input('recurrence_end_date'),
        ]);

        return response()->json([
            'message' => 'Schedule created successfully',
            'data' => $this->formatSchedule($schedule->load('course')),
        ], 201);
    }

    /**
     * Get a specific schedule
     */
    public function show($id)
    {
        $schedule = Schedule::with('course')->findOrFail($id);
        
        $this->authorize('view', $schedule);

        return response()->json([
            'message' => 'Schedule retrieved successfully',
            'data' => $this->formatSchedule($schedule),
        ]);
    }

    /**
     * Update a schedule
     */
    public function update(Request $request, $id)
    {
        $schedule = Schedule::findOrFail($id);
        
        $this->authorize('update', $schedule);

        $request->validate([
            'title' => 'nullable|string|max:255',
            'type' => 'nullable|in:class,activity,assignment,exam,event',
            'start_time' => 'nullable|date_format:Y-m-d H:i',
            'end_time' => 'nullable|date_format:Y-m-d H:i',
            'course_id' => 'nullable|exists:courses,id',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'color' => 'nullable|string|size:7',
            'is_recurring' => 'nullable|boolean',
            'recurrence_pattern' => 'nullable|in:daily,weekly,biweekly,monthly',
            'recurrence_end_date' => 'nullable|date_format:Y-m-d',
        ]);

        $schedule->update($request->only([
            'title', 'type', 'start_time', 'end_time', 'course_id',
            'description', 'location', 'color', 'is_recurring',
            'recurrence_pattern', 'recurrence_end_date'
        ]));

        return response()->json([
            'message' => 'Schedule updated successfully',
            'data' => $this->formatSchedule($schedule->load('course')),
        ]);
    }

    /**
     * Delete a schedule
     */
    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        
        $this->authorize('delete', $schedule);

        $schedule->delete();

        return response()->json([
            'message' => 'Schedule deleted successfully',
        ]);
    }

    /**
     * Format schedule data for response
     */
    private function formatSchedule($schedule)
    {
        // Ensure all datetime fields are Carbon instances
        $startTime = $schedule->start_time instanceof Carbon 
            ? $schedule->start_time 
            : Carbon::parse($schedule->start_time);
        $endTime = $schedule->end_time instanceof Carbon 
            ? $schedule->end_time 
            : Carbon::parse($schedule->end_time);
        $createdAt = $schedule->created_at instanceof Carbon 
            ? $schedule->created_at 
            : Carbon::parse($schedule->created_at);
        $updatedAt = $schedule->updated_at instanceof Carbon 
            ? $schedule->updated_at 
            : Carbon::parse($schedule->updated_at);
            
        return [
            'id' => $schedule->id,
            'title' => $schedule->title,
            'type' => $schedule->type,
            'description' => $schedule->description,
            'start_time' => $startTime->toIso8601String(),
            'end_time' => $endTime->toIso8601String(),
            'location' => $schedule->location,
            'color' => $schedule->color,
            'course_id' => $schedule->course_id,
            'course' => $schedule->course ? [
                'id' => $schedule->course->id,
                'title' => $schedule->course->title,
                'slug' => $schedule->course->slug,
            ] : null,
            'is_recurring' => $schedule->is_recurring,
            'recurrence_pattern' => $schedule->recurrence_pattern,
            'recurrence_end_date' => $schedule->recurrence_end_date,
            'created_at' => $createdAt->toIso8601String(),
            'updated_at' => $updatedAt->toIso8601String(),
        ];
    }
}