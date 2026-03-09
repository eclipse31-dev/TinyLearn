<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DashboardAnalyticsController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\ResourceController;
use App\Http\Controllers\Api\SubmissionController;
use App\Http\Controllers\Api\DiscussionController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\AssessmentController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\AttachmentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check endpoint for Render
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()]);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Public course routes
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);
Route::get('/courses/{id}/announcements', [CourseController::class, 'getAnnouncements']);
Route::get('/courses/{id}/assignments', [CourseController::class, 'getAssignments']);

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/users', [UserController::class, 'index']);

    // Dashboard routes
    Route::get('/dashboard/overview', [DashboardController::class, 'overview']);
    Route::get('/dashboard/stats', [DashboardAnalyticsController::class, 'getStats']);
    Route::get('/dashboard/activity', [DashboardAnalyticsController::class, 'getRecentActivity']);
    Route::get('/dashboard/online-hours', [DashboardAnalyticsController::class, 'getOnlineHoursStats']);
    Route::get('/dashboard/online-hours-chart', [DashboardAnalyticsController::class, 'getOnlineHoursChart']);

    // Course routes - CRUD operations
    Route::post('/courses', [CourseController::class, 'store']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
    
    // Course enrollment routes
    Route::post('/courses/enroll-with-code', [CourseController::class, 'enrollWithCode']);
    Route::post('/courses/{id}/enroll', [CourseController::class, 'enroll']);
    Route::post('/courses/{id}/unenroll', [CourseController::class, 'unenroll']);
    Route::post('/courses/{id}/send-invitation', [CourseController::class, 'sendInvitation']);
    Route::get('/courses/{id}/class-list', [CourseController::class, 'getClassList']);

    // Announcement routes - CRUD operations
    Route::get('/courses/{courseId}/announcements', [AnnouncementController::class, 'index']);
    Route::post('/announcements', [AnnouncementController::class, 'store']);
    Route::get('/announcements/{id}', [AnnouncementController::class, 'show']);
    Route::put('/announcements/{id}', [AnnouncementController::class, 'update']);
    Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy']);

    // Assignment routes - CRUD operations
    Route::get('/courses/{courseId}/assignments', [AssignmentController::class, 'index']);
    Route::post('/assignments', [AssignmentController::class, 'store']);
    Route::get('/assignments/{id}', [AssignmentController::class, 'show']);
    Route::put('/assignments/{id}', [AssignmentController::class, 'update']);
    Route::delete('/assignments/{id}', [AssignmentController::class, 'destroy']);

    // Material routes - work with modules
    Route::get('/modules/{moduleId}/materials', [MaterialController::class, 'index']);
    Route::get('/courses/{courseId}/materials', [MaterialController::class, 'getByCourse']);
    Route::post('/materials', [MaterialController::class, 'store']);
    Route::get('/materials/{id}', [MaterialController::class, 'show']);
    Route::put('/materials/{id}', [MaterialController::class, 'update']);
    Route::delete('/materials/{id}', [MaterialController::class, 'destroy']);

    // Assessment routes - work with modules
    Route::get('/modules/{moduleId}/assessments', [AssessmentController::class, 'index']);
    Route::get('/courses/{courseId}/assessments', [AssessmentController::class, 'getByCourse']);
    Route::post('/assessments', [AssessmentController::class, 'store']);
    Route::get('/assessments/{id}', [AssessmentController::class, 'show']);
    Route::put('/assessments/{id}', [AssessmentController::class, 'update']);
    Route::delete('/assessments/{id}', [AssessmentController::class, 'destroy']);

    // Module routes - manage course modules
    Route::get('/courses/{courseId}/modules', [ModuleController::class, 'index']);
    Route::post('/modules', [ModuleController::class, 'store']);
    Route::get('/modules/{id}', [ModuleController::class, 'show']);
    Route::put('/modules/{id}', [ModuleController::class, 'update']);
    Route::delete('/modules/{id}', [ModuleController::class, 'destroy']);

    // Resource routes (backwards compatibility)
    Route::get('/resources', [ResourceController::class, 'allResources']);
    Route::get('/courses/{courseId}/resources', [ResourceController::class, 'index']);
    Route::post('/resources', [ResourceController::class, 'store']);
    Route::get('/resources/{id}', [ResourceController::class, 'show']);
    Route::put('/resources/{id}', [ResourceController::class, 'update']);
    Route::delete('/resources/{id}', [ResourceController::class, 'destroy']);

    // Submission routes
    Route::get('/assignments/{assignmentId}/submissions', [SubmissionController::class, 'index']);
    Route::get('/assignments/{assignmentId}/my-submission', [SubmissionController::class, 'getUserSubmission']);
    Route::post('/submissions', [SubmissionController::class, 'store']);
    Route::get('/submissions/{id}', [SubmissionController::class, 'show']);
    Route::post('/submissions/{id}/grade', [SubmissionController::class, 'grade']);
    Route::post('/submissions/{submissionId}/files', [SubmissionController::class, 'addFile']);
    Route::delete('/submissions/{id}', [SubmissionController::class, 'destroy']);
    Route::delete('/submission-files/{fileId}', [SubmissionController::class, 'removeFile']);

    // Discussion routes
    Route::get('/discussions', [DiscussionController::class, 'index']);
    Route::post('/discussions', [DiscussionController::class, 'store']);
    Route::get('/discussions/{id}', [DiscussionController::class, 'show']);
    Route::put('/discussions/{id}', [DiscussionController::class, 'update']);
    Route::delete('/discussions/{id}', [DiscussionController::class, 'destroy']);
    Route::post('/discussions/{id}/reply', [DiscussionController::class, 'reply']);
    Route::post('/discussions/{id}/toggle-pin', [DiscussionController::class, 'togglePin']);
    Route::post('/discussions/{id}/toggle-lock', [DiscussionController::class, 'toggleLock']);

    // Schedule routes
    Route::get('/schedules/week', [ScheduleController::class, 'getWeekSchedules']);
    Route::get('/schedules/month', [ScheduleController::class, 'getMonthSchedules']);
    Route::get('/schedules/day', [ScheduleController::class, 'getDaySchedules']);
    Route::get('/schedules/upcoming', [ScheduleController::class, 'getUpcomingSchedules']);
    Route::post('/schedules', [ScheduleController::class, 'store']);
    Route::get('/schedules/{id}', [ScheduleController::class, 'show']);
    Route::put('/schedules/{id}', [ScheduleController::class, 'update']);
    Route::delete('/schedules/{id}', [ScheduleController::class, 'destroy']);

    // Settings routes
    Route::get('/settings', [SettingsController::class, 'show']);
    Route::put('/settings', [SettingsController::class, 'update']);
    Route::put('/settings/password', [SettingsController::class, 'updatePassword']);

    // Role routes (new)
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::get('/roles/{id}', [RoleController::class, 'show']);
    Route::put('/roles/{id}', [RoleController::class, 'update']);
    Route::delete('/roles/{id}', [RoleController::class, 'destroy']);

    // Enrollment routes (new)
    Route::get('/enrollments', [EnrollmentController::class, 'index']);
    Route::get('/courses/{courseId}/enrollments', [EnrollmentController::class, 'byCourse']);
    Route::post('/enrollments', [EnrollmentController::class, 'store']);
    Route::get('/enrollments/{id}', [EnrollmentController::class, 'show']);
    Route::put('/enrollments/{id}', [EnrollmentController::class, 'update']);
    Route::delete('/enrollments/{id}', [EnrollmentController::class, 'destroy']);

    // Attachment routes (file uploads)
    Route::post('/attachments/upload', [AttachmentController::class, 'upload']);
    Route::get('/attachments/{id}', [AttachmentController::class, 'show']);
    Route::get('/attachments/{id}/download', [AttachmentController::class, 'download']);
    Route::delete('/attachments/{id}', [AttachmentController::class, 'destroy']);
});