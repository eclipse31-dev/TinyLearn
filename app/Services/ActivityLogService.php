<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Request;

class ActivityLogService
{
    public function log(
        string $action,
        string $description,
        int $userId,
        ?string $subjectType = null,
        ?int $subjectId = null,
        ?array $properties = null
    ): ActivityLog {
        return ActivityLog::create([
            'user_id' => $userId,
            'action' => $action,
            'description' => $description,
            'subject_type' => $subjectType,
            'subject_id' => $subjectId,
            'properties' => $properties,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }

    public function getRecentActivity(int $limit = 50)
    {
        return ActivityLog::with('user')
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getUserActivity(int $userId, int $limit = 50)
    {
        return ActivityLog::where('user_id', $userId)
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getActivityBySubject(string $subjectType, int $subjectId)
    {
        return ActivityLog::where('subject_type', $subjectType)
            ->where('subject_id', $subjectId)
            ->with('user')
            ->latest()
            ->get();
    }
}
