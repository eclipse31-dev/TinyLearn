<?php

namespace App\Services;

use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ScheduleService
{
    /**
     * Create course schedules based on the provided configuration.
     * Supports multiple days of week with proper recurring schedule generation.
     *
     * @param int $courseId
     * @param int $userId
     * @param array $scheduleData containing:
     *   - days_of_week: array of day names (e.g., ['Monday', 'Wednesday', 'Friday'])
     *   - start_time: string in 'H:i' format (e.g., '09:00')
     *   - end_time: string in 'H:i' format (e.g., '10:30')
     *   - location: string (optional)
     *   - recurrence_pattern: string ('weekly', 'biweekly', 'monthly') (default: 'weekly')
     *   - recurrence_end_date: string in 'Y-m-d' format (default: 6 months from now)
     *   - color: string (optional, default: '#3B82F6')
     * @return array Array of created Schedule models
     */
    public function createCourseSchedules($courseId, $userId, $scheduleData = []): array
    {
        $daysOfWeek = $scheduleData['days_of_week'] ?? [];
        if (empty($daysOfWeek)) {
            return [];
        }

        $startTime = $scheduleData['start_time'] ?? '09:00';
        $endTime = $scheduleData['end_time'] ?? '10:00';
        $location = $scheduleData['location'] ?? null;
        $recurrencePattern = $scheduleData['recurrence_pattern'] ?? 'weekly';
        $recurrenceEndDate = $scheduleData['recurrence_end_date'] ?? now()->addMonths(6)->toDateString();
        $color = $scheduleData['color'] ?? '#3B82F6';

        $createdSchedules = [];

        // Create a schedule for each day of the week
        foreach ($daysOfWeek as $dayName) {
            $dayOfWeekNumber = $this->getDayOfWeekNumber($dayName);

            // Find the next occurrence of this day
            $now = now();
            $daysUntilNextOccurrence = ($dayOfWeekNumber - $now->dayOfWeek) % 7;
            if ($daysUntilNextOccurrence === 0 && $now->format('H:i') >= $startTime) {
                // If today is the day and class time has passed, start from next week
                $daysUntilNextOccurrence = 7;
            } elseif ($daysUntilNextOccurrence === 0) {
                // If today is the day and class time hasn't happened, schedule for today
                $daysUntilNextOccurrence = 0;
            } elseif ($daysUntilNextOccurrence < 0) {
                $daysUntilNextOccurrence += 7;
            }

            $startDateTime = $now->copy()
                ->addDays($daysUntilNextOccurrence)
                ->setTimeFromTimeString($startTime)
                ->setSeconds(0);

            $endDateTime = $startDateTime->copy()
                ->setTimeFromTimeString($endTime)
                ->setSeconds(0);

            // Create the schedule entry
            $schedule = Schedule::create([
                'user_id' => $userId,
                'course_id' => $courseId,
                'title' => "Class Schedule - $dayName",
                'description' => "Regular class session for this course",
                'type' => 'class',
                'start_time' => $startDateTime,
                'end_time' => $endDateTime,
                'location' => $location,
                'color' => $color,
                'is_recurring' => true,
                'recurrence_pattern' => $recurrencePattern,
                'recurrence_end_date' => $recurrenceEndDate,
            ]);

            $createdSchedules[] = $schedule;
        }

        return $createdSchedules;
    }

    /**
     * Get expanded schedule instances for a date range, including recurring schedules.
     * This expands recurring schedules into individual instances.
     *
     * @param int $userId
     * @param Carbon $startDate
     * @param Carbon $endDate
     * @return array Array of expanded schedule instances
     */
    public function getExpandedSchedules($userId, Carbon $startDate, Carbon $endDate): array
    {
        $schedules = Schedule::where('user_id', $userId)
            ->where(function ($query) use ($startDate, $endDate) {
                // Get base non-recurring schedules in range
                $query->where('is_recurring', false)
                    ->where(function ($q) use ($startDate, $endDate) {
                        $q->whereBetween('start_time', [$startDate, $endDate])
                            ->orWhereBetween('end_time', [$startDate, $endDate])
                            ->orWhere(function ($sq) use ($startDate, $endDate) {
                                $sq->where('start_time', '<=', $startDate)
                                    ->where('end_time', '>=', $endDate);
                            });
                    });
                
                // Get recurring schedules that could overlap
                $query->orWhere('is_recurring', true)
                    ->where(function ($q) use ($startDate, $endDate) {
                        $q->where('start_time', '<=', $endDate)
                            ->where(function ($sq) use ($startDate) {
                                $sq->whereNull('recurrence_end_date')
                                    ->orWhere('recurrence_end_date', '>=', $startDate);
                            });
                    });
            })
            ->with('course')
            ->get();

        $expandedSchedules = [];

        foreach ($schedules as $schedule) {
            if (!$schedule->is_recurring) {
                // Non-recurring schedules are returned as-is
                $expandedSchedules[] = $schedule;
            } else {
                // Expand recurring schedules into individual instances
                $instances = $this->expandRecurringSchedule($schedule, $startDate, $endDate);
                $expandedSchedules = array_merge($expandedSchedules, $instances);
            }
        }

        // Sort by start_time
        usort($expandedSchedules, function ($a, $b) {
            $aTime = $a->start_time instanceof Carbon ? $a->start_time : Carbon::parse($a->start_time);
            $bTime = $b->start_time instanceof Carbon ? $b->start_time : Carbon::parse($b->start_time);
            return $aTime->getTimestamp() <=> $bTime->getTimestamp();
        });

        return $expandedSchedules;
    }

    /**
     * Expand a single recurring schedule into instances for a date range.
     *
     * @param Schedule $schedule
     * @param Carbon $startDate
     * @param Carbon $endDate
     * @return array Array of schedule instances (as arrays with all original data)
     */
    public function expandRecurringSchedule(Schedule $schedule, Carbon $startDate, Carbon $endDate): array
    {
        $instances = [];
        $startTime = Carbon::parse($schedule->start_time);
        $endTime = Carbon::parse($schedule->end_time);
        $recurrenceEnd = $schedule->recurrence_end_date 
            ? Carbon::parse($schedule->recurrence_end_date) 
            : $endDate->copy()->addYears(10);

        $current = $startTime->copy();
        $loopEnd = min($endDate, $recurrenceEnd);

        if ($current > $loopEnd) {
            return [];
        }

        // Move current to start of the date range if needed
        if ($current < $startDate) {
            $current = $this->getNextOccurrence($current, $startDate, $schedule->recurrence_pattern);
        }

        while ($current <= $loopEnd) {
            if ($current >= $startDate && $current <= $endDate) {
                // Create a pseudo-instance with the expanded schedule
                $instanceEnd = $current->copy()
                    ->setTimeFromTimeString($endTime->format('H:i'))
                    ->setSeconds(0);

                // Get the array representation and exclude relations first
                $scheduleArray = $schedule->toArray();
                unset($scheduleArray['course']); // Remove nested array to avoid conflicts

                $instance = (object) array_merge(
                    $scheduleArray,
                    [
                        'start_time' => $current->copy(),
                        'end_time' => $instanceEnd,
                        'is_instance' => true,
                    ]
                );
                
                // Preserve the course relationship as a properly converted object
                if ($schedule->course) {
                    $courseArray = $schedule->course->toArray();
                    $instance->course = (object) $courseArray;
                } else {
                    $instance->course = null;
                }
                
                $instances[] = $instance;
            }

            // Get next occurrence
            $current = $this->getNextOccurrence($current, null, $schedule->recurrence_pattern);
        }

        return $instances;
    }

    /**
     * Calculate the next occurrence of a recurring schedule.
     *
     * @param Carbon $current Current date
     * @param Carbon|null $minDate Minimum date constraint
     * @param string $recurrencePattern Pattern type (daily, weekly, biweekly, monthly)
     * @return Carbon Next occurrence
     */
    private function getNextOccurrence(Carbon $current, ?Carbon $minDate, string $recurrencePattern): Carbon
    {
        $next = $current->copy();

        switch ($recurrencePattern) {
            case 'daily':
                $next->addDays(1);
                break;
            case 'weekly':
                $next->addWeeks(1);
                break;
            case 'biweekly':
                $next->addWeeks(2);
                break;
            case 'monthly':
                $next->addMonths(1);
                break;
            default:
                $next->addWeeks(1); // Default to weekly
        }

        if ($minDate && $next < $minDate) {
            return $minDate->copy()
                ->setTimeFromTimeString($current->format('H:i'))
                ->setSeconds(0);
        }

        return $next;
    }

    /**
     * Convert day name to day of week number (0 = Sunday, 1 = Monday, etc.)
     *
     * @param string $dayName Day name (e.g., 'Monday')
     * @return int Day of week number
     */
    private function getDayOfWeekNumber(string $dayName): int
    {
        $days = [
            'Sunday' => 0,
            'Monday' => 1,
            'Tuesday' => 2,
            'Wednesday' => 3,
            'Thursday' => 4,
            'Friday' => 5,
            'Saturday' => 6,
        ];

        return $days[$dayName] ?? 0;
    }

    /**
     * Update course schedules.
     * Deletes old schedules and creates new ones.
     *
     * @param int $courseId
     * @param int $userId
     * @param array $scheduleData
     * @return array Array of created Schedule models
     */
    public function updateCourseSchedules($courseId, $userId, $scheduleData = []): array
    {
        // Delete old schedules for this course
        Schedule::where('course_id', $courseId)
            ->where('user_id', $userId)
            ->where('type', 'class')
            ->delete();

        // Create new schedules
        return $this->createCourseSchedules($courseId, $userId, $scheduleData);
    }

    /**
     * Delete all schedules for a course.
     *
     * @param int $courseId
     * @return int Number of deleted records
     */
    public function deleteCourseSchedules($courseId): int
    {
        return Schedule::where('course_id', $courseId)
            ->where('type', 'class')
            ->delete();
    }
}
