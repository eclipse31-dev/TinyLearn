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
                    
                    $role = Role::firstOrCreate(['role' => 'student']);
                    $user->roles()->attach($role->role_ID);
                }
            } else {
                \Log::info('User found by google_id');
                $user->update(['google_avatar' => $googleUser->getAvatar()]);
            }
            
            $user->tokens()->delete();
            $token = $user->createToken('api-token')->plainTextToken;
            $this->sessionService->startSession($user->user_ID);
            
            // Load user with roles
            $user = $user->load('roles');
            
            \Log::info('Google login successful for: ' . $user->email);
            \Log::info('Token created: ' . substr($token, 0, 10) . '...');
            
            // Store in cache for 5 minutes
            $cacheKey = 'google_auth_' . $token;
            cache()->put($cacheKey, [
                'token' => $token,
                'user' => $user,
            ], now()->addMinutes(5));
            
            \Log::info('Auth data cached with key: ' . $cacheKey);
            
            // Redirect to frontend with token as query param
            $redirectUrl = "http://localhost:5173/auth/google/callback?token=" . urlencode($token);
            
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
        $token = $request->query('token');
        
        \Log::info('getAuthData called with token: ' . substr($token, 0, 10) . '...');
        
        if (!$token) {
            \Log::error('No token provided');
            return response()->json(['error' => 'No token provided'], 400);
        }
        
        $cacheKey = 'google_auth_' . $token;
        $authData = cache()->get($cacheKey);
        
        if (!$authData) {
            \Log::error('Auth data not found in cache for key: ' . $cacheKey);
            return response()->json(['error' => 'Auth data not found'], 401);
        }
        
        \Log::info('Auth data retrieved from cache');
        
        // Clear cache
        cache()->forget($cacheKey);
        
        return response()->json($authData);
    }
}


