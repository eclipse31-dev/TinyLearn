<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscussionReply extends Model
{
    use HasFactory;

    protected $primaryKey = 'reply_ID';
    protected $table = 'discussion_replies';

    protected $fillable = [
        'discussion_ID',
        'user_ID',
        'content',
        'parent_reply_ID',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who created this reply
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_ID', 'user_ID');
    }

    /**
     * Get the discussion this reply belongs to
     */
    public function discussion()
    {
        return $this->belongsTo(Discussion::class, 'discussion_ID', 'discussion_ID');
    }

    /**
     * Get the parent reply (for nested replies)
     */
    public function parentReply()
    {
        return $this->belongsTo(DiscussionReply::class, 'parent_reply_ID', 'reply_ID');
    }

    /**
     * Get child replies (nested replies)
     */
    public function childReplies()
    {
        return $this->hasMany(DiscussionReply::class, 'parent_reply_ID', 'reply_ID')
            ->orderBy('created_at', 'asc');
    }
}
