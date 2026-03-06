<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\UserSession;
use Carbon\Carbon;

echo "Creating test session data...\n\n";

$users = User::all();

if ($users->isEmpty()) {
    echo "No users found. Please run the seeder first.\n";
    exit(1);
}

// Create sessions for the last 7 days
for ($i = 6; $i >= 0; $i--) {
    $date = Carbon::now()->subDays($i);
    
    echo "Creating sessions for " . $date->format('Y-m-d') . "...\n";
    
    foreach ($users as $user) {
        // Random number of sessions per day (0-3)
        $sessionsCount = rand(0, 3);
        
        for ($j = 0; $j < $sessionsCount; $j++) {
            // Random login time during the day
            $loginHour = rand(8, 20);
            $loginMinute = rand(0, 59);
            
            $loginAt = $date->copy()->setTime($loginHour, $loginMinute);
            
            // Random session duration (15 minutes to 4 hours)
            $durationMinutes = rand(15, 240);
            
            $logoutAt = $loginAt->copy()->addMinutes($durationMinutes);
            
            // Don't create future sessions
            if ($logoutAt->isFuture()) {
                continue;
            }
            
            UserSession::create([
                'user_id' => $user->user_ID,
                'login_at' => $loginAt,
                'logout_at' => $logoutAt,
                'duration_minutes' => $durationMinutes,
                'ip_address' => '127.0.0.' . rand(1, 255),
                'user_agent' => 'Mozilla/5.0 (Test Browser)',
                'is_active' => false,
            ]);
        }
    }
}

// Create some active sessions for today
echo "\nCreating active sessions for today...\n";
$activeUsers = $users->random(min(2, $users->count()));

foreach ($activeUsers as $user) {
    $loginAt = Carbon::now()->subMinutes(rand(10, 120));
    
    UserSession::create([
        'user_id' => $user->user_ID,
        'login_at' => $loginAt,
        'logout_at' => null,
        'duration_minutes' => null,
        'ip_address' => '127.0.0.' . rand(1, 255),
        'user_agent' => 'Mozilla/5.0 (Test Browser)',
        'is_active' => true,
    ]);
    
    echo "  - {$user->FName} {$user->LName} is currently online\n";
}

$totalSessions = UserSession::count();
echo "\n✅ Created {$totalSessions} test sessions successfully!\n";
echo "\nYou can now view the online hours dashboard at http://localhost:3000\n";
