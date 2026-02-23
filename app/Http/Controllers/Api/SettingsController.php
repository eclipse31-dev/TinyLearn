<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
    /**
     * Get user settings
     */
    public function show(Request $request)
    {
        $user = Auth::user();

        return response()->json([
            'message' => 'Settings retrieved successfully',
            'data' => [
                'profile' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone ?? '',
                    'bio' => $user->bio ?? '',
                ],
                'notifications' => [
                    'email' => true,
                    'push' => true,
                    'sms' => false,
                ],
                'privacy' => [
                    'profile_visibility' => 'public',
                    'show_activity' => true,
                ],
            ],
        ]);
    }

    /**
     * Update user settings
     */
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:users,email,' . Auth::id(),
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string|max:500',
            'notifications' => 'nullable|array',
            'privacy' => 'nullable|array',
        ]);

        $user = Auth::user();

        // Update user profile
        if ($request->has('name')) {
            $user->name = $request->input('name');
        }
        if ($request->has('email')) {
            $user->email = $request->input('email');
        }
        if ($request->has('phone')) {
            $user->phone = $request->input('phone');
        }
        if ($request->has('bio')) {
            $user->bio = $request->input('bio');
        }

        $user->save();

        return response()->json([
            'message' => 'Settings updated successfully',
            'data' => [
                'profile' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'bio' => $user->bio,
                ],
            ],
        ]);
    }

    /**
     * Update password
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = Auth::user();

        if (!\Hash::check($request->input('current_password'), $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
            ], 422);
        }

        $user->password = \Hash::make($request->input('new_password'));
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }
}
