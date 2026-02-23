<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignment_id',
        'user_id',
        'notes',
        'status',
        'grade',
        'feedback',
        'submitted_at',
        'attachment_id',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function files()
    {
        return $this->hasMany(SubmissionFile::class);
    }

    /**
     * Get the grades for this submission.
     */
    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    /**
     * Get the latest grade for this submission.
     */
    public function latestGrade()
    {
        return $this->hasOne(Grade::class)->latest();
    }

    /**
     * Get the attachment for this submission.
     */
    public function attachment()
    {
        return $this->belongsTo(Attachment::class);
    }
}
