<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $primaryKey = 'attendance_ID';

    protected $fillable = [
        'course_ID',
        'student_ID',
        'date',
        'status',
        'notes',
        'marked_by',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    /**
     * Get the course
     */
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_ID', 'course_ID');
    }

    /**
     * Get the student
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'student_ID', 'user_ID');
    }

    /**
     * Get the user who marked attendance
     */
    public function marker()
    {
        return $this->belongsTo(User::class, 'marked_by', 'user_ID');
    }

    /**
     * Scope for a specific course
     */
    public function scopeForCourse($query, $courseId)
    {
        return $query->where('course_ID', $courseId);
    }

    /**
     * Scope for a specific student
     */
    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_ID', $studentId);
    }

    /**
     * Scope for a date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }
}
