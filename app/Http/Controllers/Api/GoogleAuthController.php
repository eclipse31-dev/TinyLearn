<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Services\UserSessionService;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Exception;

class GoogleAuthController extends Controller
{
    public function __construct(
        protected UserSessionService $sessionService
    ) {}

    public function redirect(Request $request)
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback(Request $request)
    {
        try {
            \Log::info('=== Google OAuth Callback Started ===');
            
            $googleUser = Socialite::driver('google')->user();
            
            \Log::info('Google user email: ' . $googleUser->getEmail());
            
            $user = User::where('google_id', $googleUser->getId())->first();
            
            if (!$user) {
                $user = User::where('email', $googleUser->getEmail())->first();
                
                if ($user) {
                    \Log::info('User found by email, updating google_id');
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'google_avatar' => $googleUser->getAvatar(),
                        'oauth_provider' => 'google',
                    ]);
                } else {
                    \Log::info('Creating new user from Google');
                    $user = User::create([
                        'FName' => $googleUser->user['given_name'] ?? 'User',
                        'LName' => $googleUser->user['family_name'] ?? '',
                        'email' => $googleUser->getEmail(),
                        'username' => str_replace('@gmail.com', '', $googleUser->getEmail()),
                        'password' => bcrypt(uniqid()),
                        'google_id' => $googleUser->getId(),
                        'google_avatar' => $googleUser->getAvatar(),
                        'oauth_provider' => 'google',
                    ]);
                    
                    // Assign role based on email
                    $roleToAssign = 'student';
                    if ($googleUser->getEmail() === 'kenu933@gmail.com') {
                        $roleToAssign = 'admin';
                    }
                    
                    $role = Role::firstOrCreate(['role' => $roleToAssign]);
                    $user->roles()->attach($role->role_ID);
                }
            } else {
                \Log::info('User found by google_id');
                $user->update(['google_avatar' => $googleUser->getAvatar()]);
            }
            
            // Ensure kenu933@gmail.com has admin role
            if ($user->email === 'kenu933@gmail.com') {
                $adminRole = Role::where('role', 'admin')->first();
                if ($adminRole && !$user->roles()->where('role_ID', $adminRole->role_ID)->exists()) {
                    // Remove all existing roles
                    $user->roles()->detach();
                    // Assign admin role
                    $user->roles()->attach($adminRole->role_ID);
                    \Log::info('Assigned admin role to kenu933@gmail.com');
                }
            }
            
            // Delete old tokens
            $user->tokens()->delete();
            
            // Create new token
            $token = $user->createToken('api-token')->plainTextToken;
            
            // Start session
            $this->sessionService->startSession($user->user_ID);
            
            // Load roles
            $user = $user->load('roles');
            
            \Log::info('Google login successful for: ' . $user->email);
            \Log::info('Token created: ' . substr($token, 0, 20) . '...');
            
            // Create user data JSON
            $userData = [
                'user_ID' => $user->user_ID,
                'FName' => $user->FName,
                'LName' => $user->LName,
                'email' => $user->email,
                'username' => $user->username,
                'google_avatar' => $user->google_avatar,
                'roles' => $user->roles->pluck('role')->toArray(),
            ];
            
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            
            // Pass token and user data directly in URL
            $redirectUrl = $frontendUrl . "/auth/google/callback?token=" . urlencode($token) . "&user=" . urlencode(json_encode($userData));
            
            \Log::info('Redirecting to: ' . $redirectUrl);
            
            return redirect($redirectUrl);
        } catch (Exception $e) {
            \Log::error('Google OAuth callback error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return redirect("http://localhost:5173/login?error=" . urlencode($e->getMessage()));
        }
    }

    public function getAuthData(Request $request)
    {
        // Retrieve auth data from session
        $token = session('oauth_token');
        $user = session('oauth_user');
        
        \Log::info('getAuthData called - token: ' . ($token ? 'present' : 'missing') . ', user: ' . ($user ? 'present' : 'missing'));
        
        if (!$token || !$user) {
            \Log::error('Auth data not found in session');
            return response()->json(['error' => 'Auth data not found'], 401);
        }
        
        // Clear session data after retrieval
        session()->forget(['oauth_token', 'oauth_user']);
        
        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }
}
