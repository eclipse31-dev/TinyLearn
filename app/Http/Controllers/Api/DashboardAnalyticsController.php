<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{User, Course, Assignment, Submission, Enrollment, Announcement};
use App\Services\{ActivityLogService, UserSessionService};
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class DashboardAnalyticsController extends Controller
{
    public function __construct(
        protected ActivityLogService $activityLogService,
        protected UserSessionService $sessionService
    ) {}

    public function getStats(): JsonResponse
    {
        $user = auth()->user();
        
        // Cache stats for 5 minutes
        $stats = Cache::remember("dashboard_stats_{$user->user_ID}", 300, function () use ($user) {
            if ($user->hasRole('admin')) {
                return $this->getAdminStats();
            } elseif ($user->hasRole('teacher')) {
                return $this->getTeacherStats($user->user_ID);
            } else {
                return $this->getStudentStats($user->user_ID);
            }
        });

        return response()->json($stats);
    }

    protected function getAdminStats(): array
    {
        return [
            'total_users' => User::count(),
            'total_courses' => Course::count(),
            'total_assignments' => Assignment::count(),
            'total_submissions' => Submission::count(),
            'active_enrollments' => Enrollment::count(),
            'total_announcements' => Announcement::count(),
            'active_users_online' => $this->sessionService->getActiveUsersCount(),
            
            'users_by_role' => User::select('roles.role', DB::raw('count(*) as count'))
                ->join('user_roles', 'users.user_ID', '=', 'user_roles.user_id')
                ->join('roles', 'user_roles.role_id', '=', 'roles.role_ID')
                ->groupBy('roles.role')
                ->pluck('count', 'role'),
            
            'courses_by_status' => Course::select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->pluck('count', 'status'),
            
            'recent_activity' => $this->activityLogService->getRecentActivity(10),
            
            'enrollment_trend' => $this->getEnrollmentTrend(),
            
            'online_hours_chart' => $this->sessionService->getDailyOnlineHoursChart(7),
        ];
    }

    protected function getTeacherStats(int $teacherId): array
    {
        $courses = Course::where('created_by', $teacherId)->pluck('course_ID');

        return [
            'my_courses' => $courses->count(),
            'total_students' => Enrollment::whereIn('course_ID', $courses)->distinct('user_id')->count(),
            'pending_submissions' => Submission::whereHas('assessment', function ($query) use ($courses) {
                $query->whereHas('module', function ($q) use ($courses) {
                    $q->whereIn('course_ID', $courses);
                });
            })->where('status', 'submitted')->count(),
            
            'total_assignments' => Assignment::whereHas('module', function ($query) use ($courses) {
                $query->whereIn('course_ID', $courses);
            })->count(),
            
            'recent_submissions' => Submission::whereHas('assessment', function ($query) use ($courses) {
                $query->whereHas('module', function ($q) use ($courses) {
                    $q->whereIn('course_ID', $courses);
                });
            })
            ->with(['user', 'assessment'])
            ->latest()
            ->limit(5)
            ->get(),
            
            'course_enrollments' => Course::where('created_by', $teacherId)
                ->withCount('enrollments')
                ->get()
                ->map(function ($course) {
                    return [
                        'course' => $course->title,
                        'enrollments' => $course->enrollments_count,
                    ];
                }),
        ];
    }

    protected function getStudentStats(int $studentId): array
    {
        $enrolledCourses = Enrollment::where('user_id', $studentId)->pluck('course_ID');

        return [
            'enrolled_courses' => $enrolledCourses->count(),
            
            'pending_assignments' => Assignment::whereHas('module', function ($query) use ($enrolledCourses) {
                $query->whereIn('course_ID', $enrolledCourses);
            })
            ->where('due_date', '>=', now())
            ->whereDoesntHave('submissions', function ($query) use ($studentId) {
                $query->where('user_id', $studentId);
            })
            ->count(),
            
            'submitted_assignments' => Submission::where('user_id', $studentId)->count(),
            
            'average_grade' => DB::table('grade')
                ->join('submissions', 'grade.submission_ID', '=', 'submissions.submission_ID')
                ->where('submissions.user_id', $studentId)
                ->avg('grade.score'),
            
            'upcoming_assignments' => Assignment::whereHas('module', function ($query) use ($enrolledCourses) {
                $query->whereIn('course_ID', $enrolledCourses);
            })
            ->where('due_date', '>=', now())
            ->where('due_date', '<=', now()->addDays(7))
            ->with('module.course')
            ->orderBy('due_date')
            ->limit(5)
            ->get(),
            
            'recent_grades' => DB::table('grade')
                ->join('submissions', 'grade.submission_ID', '=', 'submissions.submission_ID')
                ->join('assessments', 'submissions.assessment_id', '=', 'assessments.assessment_ID')
                ->where('submissions.user_id', $studentId)
                ->select('assessments.*', 'grade.score', 'grade.feedback', 'grade.created_at as graded_at')
                ->latest('grade.created_at')
                ->limit(5)
                ->get(),
            
            'course_progress' => $this->getCourseProgress($studentId, $enrolledCourses),
        ];
    }

    protected function getEnrollmentTrend(): array
    {
        return Enrollment::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('count(*) as count')
        )
        ->where('created_at', '>=', now()->subDays(30))
        ->groupBy('date')
        ->orderBy('date')
        ->get()
        ->toArray();
    }

    protected function getCourseProgress(int $studentId, $courseIds): array
    {
        $progress = [];

        foreach ($courseIds as $courseId) {
            $totalAssignments = Assignment::whereHas('module', function ($query) use ($courseId) {
                $query->where('course_ID', $courseId);
            })->count();

            $completedAssignments = Submission::where('user_id', $studentId)
                ->whereHas('assessment', function ($query) use ($courseId) {
                    $query->whereHas('module', function ($q) use ($courseId) {
                        $q->where('course_ID', $courseId);
                    });
                })
                ->count();

            $course = Course::find($courseId);

            $progress[] = [
                'course' => $course->title,
                'total' => $totalAssignments,
                'completed' => $completedAssignments,
                'percentage' => $totalAssignments > 0 ? round(($completedAssignments / $totalAssignments) * 100, 2) : 0,
            ];
        }

        return $progress;
    }

    public function getRecentActivity(): JsonResponse
    {
        $user = auth()->user();
        
        if ($user->hasRole('admin')) {
            $activity = $this->activityLogService->getRecentActivity(50);
        } else {
            $activity = $this->activityLogService->getUserActivity($user->user_ID, 50);
        }

        return response()->json($activity);
    }

    public function getOnlineHoursStats(): JsonResponse
    {
        $period = request('period', 'week'); // today, week, month
        $stats = $this->sessionService->getOnlineHoursStats($period);
        
        return response()->json([
            'period' => $period,
            'users' => $stats,
            'active_users' => $this->sessionService->getActiveUsersCount(),
        ]);
    }

    public function getOnlineHoursChart(): JsonResponse
    {
        $days = request('days', 7);
        $chartData = $this->sessionService->getDailyOnlineHoursChart($days);
        
        return response()->json($chartData);
    }
}
