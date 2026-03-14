<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create roles (roles migration already seeds teacher and student)
        $adminRole = \App\Models\Role::firstOrCreate(['role' => 'admin']);

        // Create admin user (only if doesn't exist)
        $admin = \App\Models\User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'FName' => 'Admin',
                'LName' => 'User',
                'username' => 'admin',
                'password' => 'password', // Will be auto-hashed by model
            ]
        );
        $admin->roles()->syncWithoutDetaching([$adminRole->role_ID]);
    }
}
