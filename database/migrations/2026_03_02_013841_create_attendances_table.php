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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id('attendance_ID');
            $table->foreignId('course_ID')->constrained('courses', 'course_ID')->onDelete('cascade');
            $table->foreignId('student_ID')->constrained('users', 'user_ID')->onDelete('cascade');
            $table->date('date');
            $table->enum('status', ['present', 'late', 'absent'])->default('absent');
            $table->text('notes')->nullable();
            $table->foreignId('marked_by')->nullable()->constrained('users', 'user_ID');
            $table->timestamps();
            
            $table->unique(['course_ID', 'student_ID', 'date']);
            $table->index(['course_ID', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
