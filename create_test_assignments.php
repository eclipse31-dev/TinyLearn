<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Course;
use App\Models\Module;
use App\Models\Assignment;

// Get a teacher
$teacher = User::whereHas('roles', function($q) {
    $q->where('role', 'teacher');
})->first();

if (!$teacher) {
    echo "No teacher found. Please run database seeder first.\n";
    exit(1);
}

// Get or create a course
$course = Course::first();
if (!$course) {
    $course = Course::create([
        'title' => 'Introduction to Programming',
        'course_code' => 'CS101',
        'description' => 'Learn the basics of programming',
        'instructor_ID' => $teacher->user_ID,
        'status' => 'active',
    ]);
    echo "Created course: {$course->title}\n";
}

// Get or create a module
$module = Module::where('course_ID', $course->course_ID)->first();
if (!$module) {
    $module = Module::create([
        'course_ID' => $course->course_ID,
        'title' => 'Week 1: Getting Started',
        'description' => 'Introduction to programming concepts',
        'order' => 1,
        'created_by' => $teacher->user_ID,
    ]);
    echo "Created module: {$module->title}\n";
}

// Create test assignments
$assignments = [
    [
        'title' => 'Hello World Program',
        'description' => 'Create a simple Hello World program in your preferred programming language. Upload your source code file.',
        'due_date' => now()->addDays(7),
    ],
    [
        'title' => 'Variables and Data Types',
        'description' => 'Write a program that demonstrates the use of different data types (integers, strings, booleans, etc.). Include comments explaining each variable.',
        'due_date' => now()->addDays(14),
    ],
    [
        'title' => 'Control Flow Assignment',
        'description' => 'Create a program using if-else statements and loops. Upload your code and a screenshot of the output.',
        'due_date' => now()->addDays(21),
    ],
];

foreach ($assignments as $assignmentData) {
    $assignment = Assignment::create([
        'module_ID' => $module->module_ID,
        'title' => $assignmentData['title'],
        'description' => $assignmentData['description'],
        'due_date' => $assignmentData['due_date'],
        'status' => 'published',
        'created_by' => $teacher->user_ID,
    ]);
    echo "Created assignment: {$assignment->title}\n";
}

// Enroll a student in the course
$student = User::whereHas('roles', function($q) {
    $q->where('role', 'student');
})->first();

if ($student) {
    $enrollment = \App\Models\Enrollment::firstOrCreate([
        'user_id' => $student->user_ID,
        'course_id' => $course->course_ID,
    ], [
        'enrolled_at' => now(),
        'status' => 'active',
    ]);
    echo "Enrolled student: {$student->FName} {$student->LName} in {$course->title}\n";
}

echo "\nTest assignments created successfully!\n";
echo "Total assignments: " . Assignment::count() . "\n";
