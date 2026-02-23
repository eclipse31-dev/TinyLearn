<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $primaryKey = 'announcement_ID';
    protected $table = 'announcements';

    protected $fillable = [
        'course_ID',
        'title',
        'content',
        'attachment_ID',
        'created_by',
    ];

    protected $casts = [
        'posted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_ID', 'course_ID');
    }

    /**
     * Get the author of this announcement.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the attachment for this announcement.
     */
    public function attachment()
    {
        return $this->belongsTo(Attachment::class, 'attachment_ID', 'attachment_ID');
    }
}
