<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityLogController extends Controller
{
    protected $activityLogService;

    public function __construct(ActivityLogService $activityLogService)
    {
        $this->activityLogService = $activityLogService;
    }

    /**
     * Get recent activity logs
     */
    public function index(Request $request)
    {
        $limit = $request->query('limit', 50);
        $actionType = $request->query('action_type');
        $userId = $request->query('user_id');

        $query = ActivityLog::with('user');

        if ($actionType) {
            $query->where('action_type', $actionType);
        }

        if ($userId) {
            $query->where('user_ID', $userId);
        }

        $logs = $query->latest()
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $logs,
            'count' => count($logs),
        ]);
    }

    /**
     * Get user's activity logs
     */
    public function userActivity(Request $request)
    {
        $userId = $request->query('user_id', Auth::id());
        $limit = $request->query('limit', 50);

        $logs = $this->activityLogService->getUserActivity($userId, $limit);

        return response()->json([
            'success' => true,
            'data' => $logs,
            'count' => count($logs),
        ]);
    }

    /**
     * Get activity by model
     */
    public function modelActivity(Request $request)
    {
        $modelType = $request->query('model_type');
        $modelId = $request->query('model_id');

        if (!$modelType || !$modelId) {
            return response()->json([
                'success' => false,
                'message' => 'model_type and model_id are required',
            ], 400);
        }

        $logs = $this->activityLogService->getActivityByModel($modelType, $modelId);

        return response()->json([
            'success' => true,
            'data' => $logs,
            'count' => count($logs),
        ]);
    }

    /**
     * Get activity statistics
     */
    public function statistics(Request $request)
    {
        $type = $request->query('type', 'system'); // 'system' or 'user'
        $userId = $request->query('user_id');

        if ($type === 'user' && $userId) {
            $stats = $this->activityLogService->getUserActivityStats($userId);
        } else {
            $stats = $this->activityLogService->getSystemActivityStats();
        }

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Get activity by action type
     */
    public function byActionType(Request $request)
    {
        $actionType = $request->query('action_type');
        $limit = $request->query('limit', 50);

        if (!$actionType) {
            return response()->json([
                'success' => false,
                'message' => 'action_type is required',
            ], 400);
        }

        $logs = $this->activityLogService->getActivityByActionType($actionType, $limit);

        return response()->json([
            'success' => true,
            'data' => $logs,
            'count' => count($logs),
        ]);
    }

    /**
     * Get activity in date range
     */
    public function dateRange(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $limit = $request->query('limit', 100);

        if (!$startDate || !$endDate) {
            return response()->json([
                'success' => false,
                'message' => 'start_date and end_date are required',
            ], 400);
        }

        $logs = $this->activityLogService->getActivityInDateRange(
            \Carbon\Carbon::parse($startDate),
            \Carbon\Carbon::parse($endDate),
            $limit
        );

        return response()->json([
            'success' => true,
            'data' => $logs,
            'count' => count($logs),
        ]);
    }

    /**
     * Get single activity log
     */
    public function show($id)
    {
        $log = ActivityLog::with('user')->find($id);

        if (!$log) {
            return response()->json([
                'success' => false,
                'message' => 'Activity log not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $log,
        ]);
    }
}
