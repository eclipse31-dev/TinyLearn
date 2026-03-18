<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add is_private to courses table
        if (!Schema::hasColumn('courses', 'is_private')) {
            Schema::table('courses', function (Blueprint $table) {
                $table->boolean('is_private')->default(true)->after('status');
            });
        }

        // Update enrollments table to add new statuses and enrollment_type
        if (Schema::hasColumn('enrollments', 'status')) {
            // For PostgreSQL, we need to use raw SQL to modify enum
            DB::statement("ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_status_check");
            DB::statement("ALTER TABLE enrollments ADD CONSTRAINT enrollments_status_check CHECK (status IN ('active', 'dropped', 'completed', 'invited', 'accepted'))");
        }

        if (!Schema::hasColumn('enrollments', 'enrollment_type')) {
            Schema::table('enrollments', function (Blueprint $table) {
                $table->enum('enrollment_type', ['self', 'invited'])->default('self')->after('status');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('courses', 'is_private')) {
            Schema::table('courses', function (Blueprint $table) {
                $table->dropColumn('is_private');
            });
        }

        if (Schema::hasColumn('enrollments', 'enrollment_type')) {
            Schema::table('enrollments', function (Blueprint $table) {
                $table->dropColumn('enrollment_type');
            });
        }
    }
};
