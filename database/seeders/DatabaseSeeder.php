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
        if (!$admin->roles()->where('role_ID', $adminRole->role_ID)->exists()) {
            $admin->roles()->attach($adminRole->role_ID);
        }

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
        if (!$teacher->roles()->where('role_ID', $teacherRole->role_ID)->exists()) {
            $teacher->roles()->attach($teacherRole->role_ID);
        }

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
        if (!$student->roles()->where('role_ID', $studentRole->role_ID)->exists()) {
            $student->roles()->attach($studentRole->role_ID);
        }

        // Create sample courses
        $course1 = \App\Models\Course::create([
            'title' => 'Introduction to Programming',
            'slug' => 'intro-programming',
            'course_code' => 'CS101',
            'description' => 'Learn the basics of programming',
            'status' => 'active',
            'created_by' => $teacher->user_ID,
        ]);

        $course2 = \App\Models\Course::create([
            'title' => 'Web Development',
            'slug' => 'web-development',
            'course_code' => 'WEB201',
            'description' => 'Build modern web applications',
            'status' => 'active',
            'created_by' => $teacher->user_ID,
        ]);

        // Create sample resources
        \App\Models\Resource::create([
            'course_id' => $course1->course_ID,
            'title' => 'Course Syllabus',
            'description' => 'Complete course syllabus and schedule',
            'type' => 'link',
            'url' => 'https://example.com/syllabus',
        ]);

        \App\Models\Resource::create([
            'course_id' => $course1->course_ID,
            'title' => 'Programming Tutorial Video',
            'description' => 'Introduction to variables and data types',
            'type' => 'video',
            'url' => 'https://www.youtube.com/watch?v=example',
        ]);

        \App\Models\Resource::create([
            'course_id' => $course2->course_ID,
            'title' => 'HTML & CSS Guide',
            'description' => 'Comprehensive guide to HTML and CSS',
            'type' => 'link',
            'url' => 'https://example.com/html-css-guide',
        ]);

        \App\Models\Resource::create([
            'course_id' => $course2->course_ID,
            'title' => 'JavaScript Cheat Sheet',
            'description' => 'Quick reference for JavaScript syntax',
            'type' => 'link',
            'url' => 'https://example.com/js-cheatsheet',
        ]);
    }
}
