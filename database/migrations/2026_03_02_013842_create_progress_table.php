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
        Schema::create('progress', function (Blueprint $table) {
            $table->id('progress_ID');
            $table->foreignId('student_ID')->constrained('users', 'user_ID')->onDelete('cascade');
            $table->foreignId('course_ID')->constrained('courses', 'course_ID')->onDelete('cascade');
            $table->decimal('completion_percentage', 5, 2)->default(0.00); // 0.00 to 100.00
            $table->integer('completed_assessments')->default(0);
            $table->integer('total_assessments')->default(0);
            $table->decimal('average_grade', 5, 2)->nullable();
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamps();
            
            $table->unique(['student_ID', 'course_ID']);
            $table->index('completion_percentage');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('progress');
    }
};
