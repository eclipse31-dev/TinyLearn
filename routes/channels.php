<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The required callback is used to determine if an
| authenticated user can listen to the channel.
|
*/

// Public channels
Broadcast::channel('course.{courseId}', function ($user, $courseId) {
    // Check if user is enrolled in the course
    return $user->enrollments()->where('course_id', $courseId)->exists() ||
           $user->courses()->where('course_id', $courseId)->exists();
});

// Private channels
Broadcast::private('user.{userId}', function ($user, $userId) {
    return (int) $user->user_ID === (int) $userId;
});

Broadcast::private('submission.{submissionId}', function ($user, $submissionId) {
    $submission = \App\Models\Submission::find($submissionId);
    if (!$submission) return false;
    
    return (int) $user->user_ID === (int) $submission->user_id ||
           (int) $user->user_ID === (int) $submission->assessment->course->created_by;
});

Broadcast::private('conversation.{conversationId}', function ($user, $conversationId) {
    $conversation = \App\Models\Conversation::find($conversationId);
    if (!$conversation) return false;
    
    return $conversation->participants()->where('user_id', $user->user_ID)->exists();
});

Broadcast::channel('online-users', function ($user) {
    return true;
});

Broadcast::channel('user-sessions', function ($user) {
    return true;
});
