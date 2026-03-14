<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function stats(Request $request)
    {
        $totalUsers = \App\Models\User::count();
        $totalCourses = \App\Models\Course::count();
        $totalAssignments = \App\Models\Assignment::count();
        $activeUsersOnline = \App\Models\UserSession::where('is_active', true)->count();

        // Get enrollment stats
        $totalEnrollments = \App\Models\Enrollment::count();
        $completedEnrollments = \App\Models\Enrollment::where('status', 'completed')->count();

        // Get grade stats
        $averageGrade = \App\Models\Grade::avg('score');

        // Get submission stats
        $totalSubmissions = \App\Models\Submission::count();
        $submittedAssignments = \App\Models\Submission::where('status', 'submitted')->count();

        return response()->json([
            'total_users' => $totalUsers,
            'total_courses' => $totalCourses,
            'total_assignments' => $totalAssignments,
            'active_users_online' => $activeUsersOnline,
            'total_enrollments' => $totalEnrollments,
            'completed_enrollments' => $completedEnrollments,
            'average_grade' => round($averageGrade, 2),
            'total_submissions' => $totalSubmissions,
            'submitted_assignments' => $submittedAssignments,
        ]);
    }

    public function userStats(Request $request)
    {
        $period = $request->get('period', 'week');
        $days = $period === 'month' ? 30 : ($period === 'week' ? 7 : 1);

        $startDate = now()->subDays($days);

        $newUsers = \App\Models\User::where('created_at', '>=', $startDate)->count();
        $activeUsers = \App\Models\UserSession::where('created_at', '>=', $startDate)
            ->where('is_active', true)
            ->distinct('user_ID')
            ->count();

        $usersByRole = \App\Models\User::with('roles')
            ->get()
            ->groupBy(function ($user) {
                return $user->roles->first()?->role ?? 'unassigned';
            })
            ->map(function ($group) {
                return count($group);
            });

        return response()->json([
            'new_users' => $newUsers,
            'active_users' => $activeUsers,
            'users_by_role' => $usersByRole,
        ]);
    }

    public function courseStats(Request $request)
    {
        $totalCourses = \App\Models\Course::count();
        $activeCourses = \App\Models\Course::where('status', 'active')->count();
        $archivedCourses = \App\Models\Course::where('status', 'archived')->count();

        $courseEnrollments = \App\Models\Course::withCount('enrollments')
            ->orderBy('enrollments_count', 'desc')
            ->limit(5)
            ->get(['course_ID', 'course_name', 'enrollments_count']);

        return response()->json([
            'total_courses' => $totalCourses,
            'active_courses' => $activeCourses,
            'archived_courses' => $archivedCourses,
            'top_courses' => $courseEnrollments,
        ]);
    }

    public function activityLog(Request $request)
    {
        $perPage = $request->get('per_page', 20);
        $filter = $request->get('filter', 'all');

        $query = \App\Models\ActivityLog::with('user');

        if ($filter !== 'all') {
            $query->where('action', $filter);
        }

        return $query->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }
}
