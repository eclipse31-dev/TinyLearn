<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Progress extends Model
{
    use HasFactory;

    protected $table = 'progress';
    protected $primaryKey = 'progress_ID';

    protected $fillable = [
        'student_ID',
        'course_ID',
        'completion_percentage',
        'completed_assessments',
        'total_assessments',
        'average_grade',
        'last_activity_at',
    ];

    protected $casts = [
        'completion_percentage' => 'decimal:2',
        'average_grade' => 'decimal:2',
        'last_activity_at' => 'datetime',
    ];

    /**
     * Get the student
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'student_ID', 'user_ID');
    }

    /**
     * Get the course
     */
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_ID', 'course_ID');
    }

    /**
     * Calculate and update progress
     */
    public function calculateProgress()
    {
        $course = $this->course;
        $studentId = $this->student_ID;

        // Get total assessments in course
        $totalAssessments = Assessment::whereHas('module', function ($query) use ($course) {
            $query->where('course_ID', $course->course_ID);
        })->count();

        // Get completed submissions
        $completedSubmissions = Submission::where('user_id', $studentId)
            ->where('status', 'graded')
            ->whereHas('assessment.module', function ($query) use ($course) {
                $query->where('course_ID', $course->course_ID);
            })->count();

        // Calculate average grade
        $averageGrade = Grade::whereHas('submission', function ($query) use ($studentId, $course) {
            $query->where('user_id', $studentId)
                ->whereHas('assessment.module', function ($q) use ($course) {
                    $q->where('course_ID', $course->course_ID);
                });
        })->avg('score');

        // Calculate completion percentage
        $completionPercentage = $totalAssessments > 0 
            ? ($completedSubmissions / $totalAssessments) * 100 
            : 0;

        $this->update([
            'total_assessments' => $totalAssessments,
            'completed_assessments' => $completedSubmissions,
            'completion_percentage' => round($completionPercentage, 2),
            'average_grade' => $averageGrade ? round($averageGrade, 2) : null,
            'last_activity_at' => now(),
        ]);

        return $this;
    }

    /**
     * Get or create progress for a student in a course
     */
    public static function getOrCreate($studentId, $courseId)
    {
        return self::firstOrCreate(
            ['student_ID' => $studentId, 'course_ID' => $courseId],
            ['completion_percentage' => 0]
        );
    }
}
