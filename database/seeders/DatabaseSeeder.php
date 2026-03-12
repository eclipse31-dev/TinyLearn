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
        $teacherRole = \App\Models\Role::where('role', 'teacher')->first();
        $studentRole = \App\Models\Role::where('role', 'student')->first();

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

        // Create teacher user (only if doesn't exist)
        $teacher = \App\Models\User::firstOrCreate(
            ['email' => 'teacher@example.com'],
            [
                'FName' => 'Teacher',
                'LName' => 'User',
                'username' => 'teacher',
                'password' => 'password', // Will be auto-hashed by model
            ]
        );
        $teacher->roles()->syncWithoutDetaching([$teacherRole->role_ID]);

        // Create student user (only if doesn't exist)
        $student = \App\Models\User::firstOrCreate(
            ['email' => 'student@example.com'],
            [
                'FName' => 'Student',
                'LName' => 'User',
                'username' => 'student',
                'password' => 'password', // Will be auto-hashed by model
            ]
        );
        $student->roles()->syncWithoutDetaching([$studentRole->role_ID]);


    }
}
