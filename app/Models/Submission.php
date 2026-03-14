<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $table = 'submissions';
    protected $primaryKey = 'submission_ID';

    protected $fillable = [
        'assignment_ID',
        'user_ID',
        'submission_text',
        'status',
        'is_late',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class, 'assignment_ID', 'assignment_ID');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_ID', 'user_ID');
    }

    public function files()
    {
        return $this->hasMany(SubmissionFile::class, 'submission_ID', 'submission_ID');
    }

    public function grades()
    {
        return $this->hasMany(Grade::class, 'submission_ID', 'submission_ID');
    }

    public function latestGrade()
    {
        return $this->hasOne(Grade::class, 'submission_ID', 'submission_ID')->latest();
    }
}
