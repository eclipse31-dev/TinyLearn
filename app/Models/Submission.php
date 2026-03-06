<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $primaryKey = 'submission_ID';

    protected $fillable = [
        'assessment_id',
        'user_id',
        'attachment_ID',
        'status',
        'notes',
        'submitted_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function assessment()
    {
        return $this->belongsTo(Assessment::class, 'assessment_id', 'assessment_ID');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_ID');
    }

    public function files()
    {
        return $this->hasMany(SubmissionFile::class, 'submission_ID', 'submission_ID');
    }

    /**
     * Get the grades for this submission.
     */
    public function grades()
    {
        return $this->hasMany(Grade::class, 'submission_ID', 'submission_ID');
    }

    /**
     * Get the latest grade for this submission.
     */
    public function latestGrade()
    {
        return $this->hasOne(Grade::class, 'submission_ID', 'submission_ID')->latest();
    }

    /**
     * Get the attachment for this submission.
     */
    public function attachment()
    {
        return $this->belongsTo(Attachment::class, 'attachment_ID', 'attachment_ID');
    }
}
