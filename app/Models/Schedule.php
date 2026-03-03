<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Schedule extends Model
{
    use HasFactory;

    protected $primaryKey = 'schedule_ID';

    protected $fillable = [
        'user_id',
        'course_ID',
        'title',
        'type',
        'description',
        'location',
        'color',
        'day_in_week',
        'start_time',
        'end_time',
        'is_recurring',
        'recurrence_pattern',
        'recurrence_end_date',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'recurrence_end_date' => 'date',
        'is_recurring' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_ID', 'course_ID');
    }

    /**
     * Get expanded schedules by date range (includes recurring instances)
     */
    public static function getExpandedByDateRange($userId, $startDate, $endDate)
    {
        $schedules = self::where('user_id', $userId)
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_time', [$startDate, $endDate])
                    ->orWhere('is_recurring', true);
            })
            ->with('course')
            ->get();

        $expanded = collect();

        foreach ($schedules as $schedule) {
            if ($schedule->is_recurring) {
                $expanded = $expanded->merge(self::expandRecurring($schedule, $startDate, $endDate));
            } else {
                $expanded->push($schedule);
            }
        }

        return $expanded->sortBy('start_time');
    }

    /**
     * Get upcoming expanded schedules
     */
    public static function getUpcomingExpanded($userId, $days = 30)
    {
        $startDate = now();
        $endDate = now()->addDays($days);

        return self::getExpandedByDateRange($userId, $startDate, $endDate);
    }

    /**
     * Expand recurring schedule into individual instances
     */
    private static function expandRecurring($schedule, $startDate, $endDate)
    {
        $instances = collect();
        $current = Carbon::parse($schedule->start_time);
        $end = $schedule->recurrence_end_date 
            ? Carbon::parse($schedule->recurrence_end_date) 
            : Carbon::parse($endDate);

        while ($current->lte($end) && $current->lte($endDate)) {
            if ($current->gte($startDate)) {
                $instance = clone $schedule;
                $duration = Carbon::parse($schedule->start_time)->diffInMinutes(Carbon::parse($schedule->end_time));
                $instance->start_time = $current->copy();
                $instance->end_time = $current->copy()->addMinutes($duration);
                $instances->push($instance);
            }

            // Move to next occurrence based on pattern
            switch ($schedule->recurrence_pattern) {
                case 'daily':
                    $current->addDay();
                    break;
                case 'weekly':
                    $current->addWeek();
                    break;
                case 'biweekly':
                    $current->addWeeks(2);
                    break;
                case 'monthly':
                    $current->addMonth();
                    break;
                default:
                    break 2; // Exit loop if pattern is unknown
            }
        }

        return $instances;
    }
}