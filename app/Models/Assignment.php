<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;

    protected $table = 'assignments';
    protected $primaryKey = 'assignment_ID';

    protected $fillable = [
        'course_ID',
        'assignment_name',
        'description',
        'due_date',
        'total_points',
        'allow_late_submission',
        'late_penalty_percent',
        'allow_file_upload',
        'max_file_size_mb',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_ID', 'course_ID');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class, 'assignment_ID', 'assignment_ID');
    }
}
