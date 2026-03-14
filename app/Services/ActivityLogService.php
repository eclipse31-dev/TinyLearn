<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ActivityLogService
{
    /**
     * Log an activity with comprehensive tracking
     */
    public function log(
        string $action,
        string $actionType = 'create',
        string $description = '',
        int $userId = null,
        ?string $modelType = null,
        ?int $modelId = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        string $status = 'success',
        ?int $responseTimeMs = null
    ): ActivityLog {
        $userId = $userId ?? Auth::id();

        return ActivityLog::create([
            'user_ID' => $userId,
            'action' => $action,
            'action_type' => $actionType,
            'description' => $description,
            'model_type' => $modelType,
            'model_ID' => $modelId,
            'old_values' => $oldValues ? json_encode($oldValues) : null,
            'new_values' => $newValues ? json_encode($newValues) : null,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'status' => $status,
            'response_time_ms' => $responseTimeMs,
        ]);
    }

    /**
     * Log user login
     */
    public function logLogin(int $userId): ActivityLog
    {
        return $this->log(
            action: 'User Login',
            actionType: 'login',
            description: 'User logged in successfully',
            userId: $userId,
            modelType: 'User',
            modelId: $userId
        );
    }

    /**
     * Log user logout
     */
    public function logLogout(int $userId): ActivityLog
    {
        return $this->log(
            action: 'User Logout',
            actionType: 'logout',
            description: 'User logged out',
            userId: $userId,
            modelType: 'User',
            modelId: $userId
        );
    }

    /**
     * Log course creation
     */
    public function logCourseCreated(int $userId, int $courseId, array $courseData): ActivityLog
    {
        return $this->log(
            action: 'Course Created',
            actionType: 'create',
            description: "Course '{$courseData['course_name']}' created",
            userId: $userId,
            modelType: 'Course',
            modelId: $courseId,
            newValues: $courseData
        );
    }

    /**
     * Log course update
     */
    public function logCourseUpdated(int $userId, int $courseId, array $oldData, array $newData): ActivityLog
    {
        return $this->log(
            action: 'Course Updated',
            actionType: 'update',
            description: "Course '{$newData['course_name']}' updated",
            userId: $userId,
            modelType: 'Course',
            modelId: $courseId,
            oldValues: $oldData,
            newValues: $newData
        );
    }

    /**
     * Log course deletion
     */
    public function logCourseDeleted(int $userId, int $courseId, array $courseData): ActivityLog
    {
        return $this->log(
            action: 'Course Deleted',
            actionType: 'delete',
            description: "Course '{$courseData['course_name']}' deleted",
            userId: $userId,
            modelType: 'Course',
            modelId: $courseId,
            oldValues: $courseData
        );
    }

    /**
     * Log enrollment
     */
    public function logEnrollment(int $userId, int $courseId, string $courseName): ActivityLog
    {
        return $this->log(
            action: 'Course Enrollment',
            actionType: 'enroll',
            description: "User enrolled in course '{$courseName}'",
            userId: $userId,
            modelType: 'Enrollment',
            modelId: $courseId
        );
    }

    /**
     * Log unenrollment
     */
    public function logUnenrollment(int $userId, int $courseId, string $courseName): ActivityLog
    {
        return $this->log(
            action: 'Course Unenrollment',
            actionType: 'unenroll',
            description: "User unenrolled from course '{$courseName}'",
            userId: $userId,
            modelType: 'Enrollment',
            modelId: $courseId
        );
    }

    /**
     * Log assignment submission
     */
    public function logAssignmentSubmitted(int $userId, int $assignmentId, string $assignmentName): ActivityLog
    {
        return $this->log(
            action: 'Assignment Submitted',
            actionType: 'submit',
            description: "Assignment '{$assignmentName}' submitted",
            userId: $userId,
            modelType: 'Submission',
            modelId: $assignmentId
        );
    }

    /**
     * Log assignment grading
     */
    public function logAssignmentGraded(int $userId, int $submissionId, int $points, int $totalPoints): ActivityLog
    {
        return $this->log(
            action: 'Assignment Graded',
            actionType: 'grade',
            description: "Assignment graded: {$points}/{$totalPoints}",
            userId: $userId,
            modelType: 'Grade',
            modelId: $submissionId,
            newValues: ['points' => $points, 'total_points' => $totalPoints]
        );
    }

    /**
     * Log file upload
     */
    public function logFileUpload(int $userId, string $fileName, string $modelType, int $modelId): ActivityLog
    {
        return $this->log(
            action: 'File Uploaded',
            actionType: 'upload',
            description: "File '{$fileName}' uploaded",
            userId: $userId,
            modelType: $modelType,
            modelId: $modelId,
            newValues: ['file_name' => $fileName]
        );
    }

    /**
     * Log file download
     */
    public function logFileDownload(int $userId, string $fileName, string $modelType, int $modelId): ActivityLog
    {
        return $this->log(
            action: 'File Downloaded',
            actionType: 'download',
            description: "File '{$fileName}' downloaded",
            userId: $userId,
            modelType: $modelType,
            modelId: $modelId,
            newValues: ['file_name' => $fileName]
        );
    }

    /**
     * Get recent activity
     */
    public function getRecentActivity(int $limit = 50)
    {
        return ActivityLog::with('user')
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * Get user activity
     */
    public function getUserActivity(int $userId, int $limit = 50)
    {
        return ActivityLog::where('user_ID', $userId)
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * Get activity by model
     */
    public function getActivityByModel(string $modelType, int $modelId)
    {
        return ActivityLog::where('model_type', $modelType)
            ->where('model_ID', $modelId)
            ->with('user')
            ->latest()
            ->get();
    }

    /**
     * Get activity by action type
     */
    public function getActivityByActionType(string $actionType, int $limit = 50)
    {
        return ActivityLog::where('action_type', $actionType)
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * Get activity within date range
     */
    public function getActivityInDateRange(Carbon $startDate, Carbon $endDate, int $limit = 100)
    {
        return ActivityLog::whereBetween('created_at', [$startDate, $endDate])
            ->with('user')
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * Get user activity statistics
     */
    public function getUserActivityStats(int $userId)
    {
        return [
            'total_actions' => ActivityLog::where('user_ID', $userId)->count(),
            'logins' => ActivityLog::where('user_ID', $userId)->where('action_type', 'login')->count(),
            'submissions' => ActivityLog::where('user_ID', $userId)->where('action_type', 'submit')->count(),
            'uploads' => ActivityLog::where('user_ID', $userId)->where('action_type', 'upload')->count(),
            'last_activity' => ActivityLog::where('user_ID', $userId)->latest()->first(),
        ];
    }

    /**
     * Get system activity statistics
     */
    public function getSystemActivityStats()
    {
        return [
            'total_actions' => ActivityLog::count(),
            'actions_today' => ActivityLog::whereDate('created_at', today())->count(),
            'actions_this_week' => ActivityLog::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'actions_this_month' => ActivityLog::whereMonth('created_at', now()->month)->count(),
            'failed_actions' => ActivityLog::where('status', 'failed')->count(),
            'by_action_type' => ActivityLog::selectRaw('action_type, COUNT(*) as count')
                ->groupBy('action_type')
                ->get(),
        ];
    }
}
