<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'type',
        'url',
        'file_path',
        'file_name',
        'file_size',
        'mime_type',
        'attachment_id',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the attachment for this resource.
     */
    public function attachment()
    {
        return $this->belongsTo(Attachment::class);
    }
}
