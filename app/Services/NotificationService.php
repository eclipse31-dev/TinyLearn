<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    public function create(
        int $userId,
        string $type,
        string $title,
        string $message,
        ?string $actionUrl = null,
        ?array $data = null
    ): Notification {
        return Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'action_url' => $actionUrl,
            'data' => $data,
        ]);
    }

    public function notifyMultipleUsers(
        array $userIds,
        string $type,
        string $title,
        string $message,
        ?string $actionUrl = null,
        ?array $data = null
    ): void {
        foreach ($userIds as $userId) {
            $this->create($userId, $type, $title, $message, $actionUrl, $data);
        }
    }

    public function getUserNotifications(int $userId, int $limit = 50)
    {
        return Notification::where('user_id', $userId)
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getUnreadCount(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->unread()
            ->count();
    }

    public function markAsRead(int $notificationId): void
    {
        $notification = Notification::find($notificationId);
        $notification?->markAsRead();
    }

    public function markAllAsRead(int $userId): void
    {
        Notification::where('user_id', $userId)
            ->unread()
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    public function deleteOldNotifications(int $days = 30): int
    {
        return Notification::where('created_at', '<', now()->subDays($days))
            ->where('is_read', true)
            ->delete();
    }

    // Specific notification types
    public function notifyNewAnnouncement(int $courseId, string $title): void
    {
        // Get all enrolled students
        $enrolledUsers = User::whereHas('enrollments', function ($query) use ($courseId) {
            $query->where('course_ID', $courseId);
        })->pluck('user_ID')->toArray();

        $this->notifyMultipleUsers(
            $enrolledUsers,
            'announcement',
            'New Announcement',
            "New announcement posted: {$title}",
            "/courses/{$courseId}/announcements"
        );
    }

    public function notifyNewAssignment(int $courseId, string $title, string $dueDate): void
    {
        $enrolledUsers = User::whereHas('enrollments', function ($query) use ($courseId) {
            $query->where('course_ID', $courseId);
        })->pluck('user_ID')->toArray();

        $this->notifyMultipleUsers(
            $enrolledUsers,
            'assignment',
            'New Assignment',
            "New assignment: {$title} (Due: {$dueDate})",
            "/courses/{$courseId}/assignments"
        );
    }

    public function notifyGradePosted(int $userId, string $assignmentTitle, float $score): void
    {
        $this->create(
            $userId,
            'grade',
            'Grade Posted',
            "Your grade for '{$assignmentTitle}' has been posted: {$score}%",
            "/grades"
        );
    }

    public function notifyEnrollment(int $userId, string $courseTitle): void
    {
        $this->create(
            $userId,
            'enrollment',
            'Course Enrollment',
            "You have been enrolled in: {$courseTitle}",
            "/courses"
        );
    }
}
