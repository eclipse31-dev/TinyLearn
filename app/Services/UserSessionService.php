<?php

namespace App\Services;

use App\Models\UserSession;
use App\Models\User;
use App\Events\UserSessionUpdated;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\DB;

class UserSessionService
{
    public function startSession(int $userId): UserSession
    {
        // End any existing active sessions for this user
        $this->endActiveUserSessions($userId);

        $session = UserSession::create([
            'user_id' => $userId,
            'login_at' => now(),
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'is_active' => true,
        ]);

        // Broadcast login event (wrapped in try-catch for local development)
        try {
            $user = User::find($userId);
            if ($user) {
                broadcast(new UserSessionUpdated(
                    $userId,
                    $user->FName . ' ' . $user->LName,
                    'login'
                ))->toOthers();
            }
        } catch (\Exception $e) {
            \Log::warning('Failed to broadcast user session update: ' . $e->getMessage());
        }

        return $session;
    }

    public function endSession(int $userId): void
    {
        $user = User::find($userId);
        
        UserSession::where('user_id', $userId)
            ->where('is_active', true)
            ->get()
            ->each(function ($session) {
                $session->endSession();
            });

        // Broadcast logout event (wrapped in try-catch for local development)
        try {
            if ($user) {
                broadcast(new UserSessionUpdated(
                    $userId,
                    $user->FName . ' ' . $user->LName,
                    'logout'
                ))->toOthers();
            }
        } catch (\Exception $e) {
            \Log::warning('Failed to broadcast user session update: ' . $e->getMessage());
        }
    }

    public function endActiveUserSessions(int $userId): void
    {
        UserSession::where('user_id', $userId)
            ->where('is_active', true)
            ->get()
            ->each(function ($session) {
                $session->endSession();
            });
    }

    public function getUserOnlineHoursToday(int $userId): float
    {
        $sessions = UserSession::where('user_id', $userId)
            ->today()
            ->get();

        $totalMinutes = 0;
        foreach ($sessions as $session) {
            if ($session->is_active) {
                $totalMinutes += $session->login_at->diffInMinutes(now());
            } else {
                $totalMinutes += $session->duration_minutes ?? 0;
            }
        }

        return round($totalMinutes / 60, 2);
    }

    public function getUserOnlineHoursThisWeek(int $userId): float
    {
        $sessions = UserSession::where('user_id', $userId)
            ->thisWeek()
            ->get();

        $totalMinutes = 0;
        foreach ($sessions as $session) {
            if ($session->is_active) {
                $totalMinutes += $session->login_at->diffInMinutes(now());
            } else {
                $totalMinutes += $session->duration_minutes ?? 0;
            }
        }

        return round($totalMinutes / 60, 2);
    }

    public function getOnlineHoursStats(string $period = 'week'): array
    {
        $query = UserSession::with('user');

        switch ($period) {
            case 'today':
                $query->today();
                break;
            case 'week':
                $query->thisWeek();
                break;
            case 'month':
                $query->thisMonth();
                break;
        }

        $sessions = $query->get();
        $userStats = [];

        foreach ($sessions as $session) {
            $userId = $session->user_id;
            $userName = $session->user->FName . ' ' . $session->user->LName;

            if (!isset($userStats[$userId])) {
                $userStats[$userId] = [
                    'user_id' => $userId,
                    'name' => $userName,
                    'email' => $session->user->email,
                    'role' => $session->user->roles->first()->role ?? 'student',
                    'total_minutes' => 0,
                    'total_hours' => 0,
                    'sessions_count' => 0,
                ];
            }

            $userStats[$userId]['sessions_count']++;

            if ($session->is_active) {
                $userStats[$userId]['total_minutes'] += $session->login_at->diffInMinutes(now());
            } else {
                $userStats[$userId]['total_minutes'] += $session->duration_minutes ?? 0;
            }
        }

        // Convert minutes to hours and sort by hours
        foreach ($userStats as &$stat) {
            $stat['total_hours'] = round($stat['total_minutes'] / 60, 2);
        }

        // Sort by total hours descending
        uasort($userStats, function ($a, $b) {
            return $b['total_hours'] <=> $a['total_hours'];
        });

        return array_values($userStats);
    }

    public function getDailyOnlineHoursChart(int $days = 7): array
    {
        $data = [];
        
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dateStr = $date->format('Y-m-d');
            $dayName = $date->format('M j');

            $sessions = UserSession::whereDate('login_at', $date)->get();
            $totalMinutes = 0;

            foreach ($sessions as $session) {
                if ($session->is_active && $date->isToday()) {
                    $totalMinutes += $session->login_at->diffInMinutes(now());
                } else {
                    $totalMinutes += $session->duration_minutes ?? 0;
                }
            }

            $data[] = [
                'date' => $dateStr,
                'day' => $dayName,
                'hours' => round($totalMinutes / 60, 2),
                'users_count' => UserSession::whereDate('login_at', $date)->distinct('user_id')->count(),
            ];
        }

        return $data;
    }

    public function getActiveUsersCount(): int
    {
        return UserSession::active()->distinct('user_id')->count();
    }

    public function cleanupOldSessions(int $daysOld = 30): int
    {
        return UserSession::where('login_at', '<', now()->subDays($daysOld))
            ->where('is_active', false)
            ->delete();
    }
}