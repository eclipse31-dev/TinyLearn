<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $table = 'enrollments';
    protected $primaryKey = 'enrollment_ID';

    protected $fillable = [
        'user_ID',
        'course_ID',
        'status',
        'grade_letter',
        'final_score',
    ];

    protected $casts = [
        'enrollment_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_ID', 'user_ID');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_ID', 'course_ID');
    }
}
