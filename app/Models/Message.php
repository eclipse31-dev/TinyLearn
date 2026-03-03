<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $primaryKey = 'message_ID';

    protected $fillable = [
        'conversation_ID',
        'sender_id',
        'receiver_id',
        'message',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    /**
     * Get the conversation
     */
    public function conversation()
    {
        return $this->belongsTo(Conversation::class, 'conversation_ID', 'conversation_ID');
    }

    /**
     * Get the sender
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id', 'user_ID');
    }

    /**
     * Get the receiver
     */
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id', 'user_ID');
    }

    /**
     * Mark message as read
     */
    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    /**
     * Scope for unread messages
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }
}
