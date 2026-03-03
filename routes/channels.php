<?php

use Illuminate\Support\Facades\Broadcast;

// Private user channel for personal notifications
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->user_ID === (int) $userId;
});

// Presence channel for online users
Broadcast::channel('online', function ($user) {
    return [
        'id' => $user->user_ID,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->roles->first()->role_name ?? 'student',
    ];
});

// Course-specific channels
Broadcast::channel('course.{courseId}', function ($user, $courseId) {
    return $user->enrollments()->where('course_ID', $courseId)->exists();
});
