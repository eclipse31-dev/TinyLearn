<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get dashboard overview data
     */
    public function overview(Request $request)
    {
        $user = $request->user();

        // ✅ Get roles as objects with role_ID and role
        $roles = $user->roles()->get(['role_ID', 'role']);

        return response()->json([
            'message' => 'Dashboard overview retrieved successfully',
            'data' => [
                'user' => [
                    'id' => $user->user_ID,
                    'name' => $user->FName . ' ' . $user->LName,
                    'email' => $user->email,
                    'username' => $user->username,
                    'roles' => $roles, // now array of objects
                ],
                'stats' => [
                    'learning_time' => '2h 37m',
                    'tasks_completed' => 21,
                    'new_messages' => 3,
                ],
                'featured_course' => [
                    'id' => 1,
                    'title' => 'Learn How To Die within 30 Days',
                    'description' => 'Time to become advance then others with this course',
                ],
            ],
        ]);
    }
}