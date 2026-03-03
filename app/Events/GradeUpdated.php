<?php

namespace App\Events;

use App\Models\Grade;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GradeUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $grade;

    public function __construct(Grade $grade)
    {
        $this->grade = $grade->load('submission.user', 'submission.assessment');
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->grade->submission->user_id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'grade' => [
                'id' => $this->grade->grade_ID,
                'score' => $this->grade->score,
                'feedback' => $this->grade->feedback,
                'assessment' => [
                    'title' => $this->grade->submission->assessment->title ?? 'Assessment',
                ],
            ]
        ];
    }
}
