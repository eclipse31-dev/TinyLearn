<?php

namespace App\Events;

use App\Models\Announcement;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AnnouncementCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $announcement;

    public function __construct(Announcement $announcement)
    {
        $this->announcement = $announcement;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('announcements'),
            new Channel('course.' . $this->announcement->course_ID),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'announcement' => [
                'id' => $this->announcement->announcement_ID,
                'title' => $this->announcement->title,
                'content' => $this->announcement->content,
                'course_id' => $this->announcement->course_ID,
                'created_at' => $this->announcement->created_at,
            ]
        ];
    }
}
