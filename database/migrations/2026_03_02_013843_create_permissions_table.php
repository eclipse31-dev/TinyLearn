<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('permissions', function (Blueprint $table) {
            $table->id('permission_ID');
            $table->string('name')->unique(); // e.g., 'create_course', 'grade_submission'
            $table->string('display_name'); // e.g., 'Create Course'
            $table->string('description')->nullable();
            $table->string('group')->default('general'); // Group permissions: 'course', 'user', 'grade', etc.
            $table->timestamps();
            
            $table->index('group');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};
