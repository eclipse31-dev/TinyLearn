<?php

namespace App\Events;

use App\Models\Assignment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AssignmentCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $assignment;

    public function __construct(Assignment $assignment)
    {
        $this->assignment = $assignment->load('module.course');
    }

    public function broadcastOn(): array
    {
        $courseId = $this->assignment->module->course_ID ?? null;
        
        $channels = [new Channel('assignments')];
        
        if ($courseId) {
            $channels[] = new Channel('course.' . $courseId);
        }
        
        return $channels;
    }

    public function broadcastWith(): array
    {
        return [
            'assignment' => [
                'id' => $this->assignment->assessment_ID,
                'title' => $this->assignment->title ?? 'New Assessment',
                'description' => $this->assignment->description ?? '',
                'due_date' => $this->assignment->due_date,
                'course_id' => $this->assignment->module->course_ID ?? null,
                'module_id' => $this->assignment->module_ID,
            ]
        ];
    }
}
