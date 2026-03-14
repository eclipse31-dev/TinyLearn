<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $primaryKey = 'course_ID';
    public $timestamps = true;

    protected $fillable = [
        'course_code',
        'course_name',
        'description',
        'instructor_ID',
        'header_image',
        'enrollment_code',
        'max_students',
        'credits',
        'semester',
        'status',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'course_ID', 'course_ID');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'enrollments', 'course_ID', 'user_ID')
            ->withPivot('status', 'enrollment_date')
            ->withTimestamps();
    }

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_ID', 'user_ID');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'instructor_ID', 'user_ID');
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'course_ID', 'course_ID');
    }

    public function modules()
    {
        return $this->hasMany(Module::class, 'course_ID', 'course_ID');
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class, 'course_ID', 'course_ID');
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'course_ID', 'course_ID');
    }

    public function resources()
    {
        return $this->hasMany(Resource::class, 'course_ID', 'course_ID');
    }
}