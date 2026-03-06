<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discussion extends Model
{
    use HasFactory;

    protected $primaryKey = 'discussion_ID';
    protected $table = 'discussions';

    protected $fillable = [
        'course_ID',
        'user_ID',
        'title',
        'content',
        'category',
        'is_pinned',
        'is_locked',
        'views',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'is_locked' => 'boolean',
        'views' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who created this discussion
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_ID', 'user_ID');
    }

    /**
     * Get the course this discussion belongs to
     */
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_ID', 'course_ID');
    }

    /**
     * Get all replies for this discussion
     */
    public function replies()
    {
        return $this->hasMany(DiscussionReply::class, 'discussion_ID', 'discussion_ID')
            ->whereNull('parent_reply_ID')
            ->orderBy('created_at', 'asc');
    }

    /**
     * Get all replies count (including nested)
     */
    public function allReplies()
    {
        return $this->hasMany(DiscussionReply::class, 'discussion_ID', 'discussion_ID');
    }

    /**
     * Increment views count
     */
    public function incrementViews()
    {
        $this->increment('views');
    }
}
