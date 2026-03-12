<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $primaryKey = 'course_ID';

   protected $fillable = [
        'title',
        'slug',
        'course_code',
        'description',
        'status',
        'created_by',
        'header_image_url',
        'is_private',
    ];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'course_id', 'course_ID');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'enrollments', 'course_id', 'user_id')
            ->withPivot('status', 'enrolled_at')
            ->withTimestamps();
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

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}