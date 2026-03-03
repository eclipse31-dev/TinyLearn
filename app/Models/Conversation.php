<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $primaryKey = 'conversation_ID';

    protected $fillable = [
        'user1_id',
        'user2_id',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    /**
     * Get the first user
     */
    public function user1()
    {
        return $this->belongsTo(User::class, 'user1_id', 'user_ID');
    }

    /**
     * Get the second user
     */
    public function user2()
    {
        return $this->belongsTo(User::class, 'user2_id', 'user_ID');
    }

    /**
     * Get all messages in this conversation
     */
    public function messages()
    {
        return $this->hasMany(Message::class, 'conversation_ID', 'conversation_ID');
    }

    /**
     * Get the latest message
     */
    public function latestMessage()
    {
        return $this->hasOne(Message::class, 'conversation_ID', 'conversation_ID')->latest();
    }

    /**
     * Find or create a conversation between two users
     */
    public static function findOrCreateBetween($user1Id, $user2Id)
    {
        $conversation = self::where(function ($query) use ($user1Id, $user2Id) {
            $query->where('user1_id', $user1Id)->where('user2_id', $user2Id);
        })->orWhere(function ($query) use ($user1Id, $user2Id) {
            $query->where('user1_id', $user2Id)->where('user2_id', $user1Id);
        })->first();

        if (!$conversation) {
            $conversation = self::create([
                'user1_id' => $user1Id,
                'user2_id' => $user2Id,
            ]);
        }

        return $conversation;
    }

    /**
     * Get the other participant in the conversation
     */
    public function getOtherUser($userId)
    {
        return $this->user1_id == $userId ? $this->user2 : $this->user1;
    }
}
