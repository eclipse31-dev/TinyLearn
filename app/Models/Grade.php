<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    use HasFactory;

    protected $table = 'grade';
    protected $primaryKey = 'grade_ID';

    protected $fillable = [
        'submission_ID',
        'score',
        'feedback',
        'graded_by',
    ];

    protected $casts = [
        'graded_at' => 'datetime',
    ];

    /**
     * Get the submission for this grade.
     */
    public function submission()
    {
        return $this->belongsTo(Submission::class, 'submission_ID', 'submission_ID');
    }

    /**
     * Get the assignment through submission.
     */
    public function assignment()
    {
        return $this->hasOneThrough(
            Assignment::class,
            Submission::class,
            'submission_ID',
            'assignment_ID',
            'submission_ID',
            'assignment_ID'
        );
    }

    /**
     * Get the student through submission.
     */
    public function student()
    {
        return $this->hasOneThrough(
            User::class,
            Submission::class,
            'submission_ID',
            'user_ID',
            'submission_ID',
            'student_ID'
        );
    }
}
