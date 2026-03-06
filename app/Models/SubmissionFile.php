<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubmissionFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'submission_ID',
        'type',
        'url',
        'file_path',
        'file_name',
        'file_size',
        'mime_type',
    ];

    public function submission()
    {
        return $this->belongsTo(Submission::class, 'submission_ID', 'submission_ID');
    }
}
