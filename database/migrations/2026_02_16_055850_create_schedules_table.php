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
        Schema::create('schedules', function(Blueprint $table){
            $table->id('schedule_ID');
            $table->foreignId('user_id')->nullable()->constrained('users', 'user_ID')->onDelete('cascade');
            $table->foreignId('course_ID')->nullable()->constrained('courses','course_ID')->onDelete('cascade');
            $table->string('title');
            $table->enum('type', ['class', 'activity', 'assignment', 'exam', 'event'])->default('class');
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->string('color')->default('#3B82F6');
            $table->string('day_in_week')->nullable();
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->boolean('is_recurring')->default(false);
            $table->enum('recurrence_pattern',['daily','weekly','biweekly','monthly'])->nullable();
            $table->date('recurrence_end_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
