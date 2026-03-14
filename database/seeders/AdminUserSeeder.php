<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin role if it doesn't exist
        $adminRole = Role::firstOrCreate(['role' => 'admin']);

        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@tinylearn.com'],
            [
                'FName' => 'Admin',
                'LName' => 'User',
                'username' => 'admin',
                'password' => bcrypt('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Assign admin role
        $admin->roles()->syncWithoutDetaching([$adminRole->role_ID]);

        echo "Admin account created:\n";
        echo "Email: admin@tinylearn.com\n";
        echo "Password: password\n";
    }
}
