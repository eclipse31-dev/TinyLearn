<?php

namespace App\Services;

use Illuminate\Broadcasting\Channel;
use Illuminate\Support\Facades\Broadcast;

class RealtimeService
{
    /**
     * Broadcast course update
     */
    public static function broadcastCourseUpdate($courseId, $data)
    {
        Broadcast::channel("course.{$courseId}")
            ->dispatch('course.updated', $data);
    }

    /**
     * Broadcast announcement created
     */
    public static function broadcastAnnouncementCreated($courseId, $announcement)
    {
        Broadcast::channel("course.{$courseId}")
            ->dispatch('announcement.created', $announcement);
    }

    /**
     * Broadcast assignment created
     */
    public static function broadcastAssignmentCreated($courseId, $assignment)
    {
        Broadcast::channel("course.{$courseId}")
            ->dispatch('assignment.created', $assignment);
    }

    /**
     * Broadcast submission update
     */
    public static function broadcastSubmissionUpdate($submissionId, $data)
    {
        Broadcast::channel("submission.{$submissionId}")
            ->dispatch('submission.updated', $data);
    }

    /**
     * Broadcast user online status
     */
    public static function broadcastUserOnlineStatus($userId, $status)
    {
        Broadcast::channel("user.{$userId}")
            ->dispatch('user.online', ['user_id' => $userId, 'status' => $status]);
    }

    /**
     * Broadcast message
     */
    public static function broadcastMessage($conversationId, $message)
    {
        Broadcast::channel("conversation.{$conversationId}")
            ->dispatch('message.sent', $message);
    }

    /**
     * Broadcast grade update
     */
    public static function broadcastGradeUpdate($submissionId, $grade)
    {
        Broadcast::channel("submission.{$submissionId}")
            ->dispatch('grade.updated', $grade);
    }

    /**
     * Broadcast notification
     */
    public static function broadcastNotification($userId, $notification)
    {
        Broadcast::channel("user.{$userId}")
            ->dispatch('notification.created', $notification);
    }

    /**
     * Broadcast session update
     */
    public static function broadcastSessionUpdate($userId, $sessionData)
    {
        Broadcast::channel("user.{$userId}")
            ->dispatch('session.updated', $sessionData);
    }
}
