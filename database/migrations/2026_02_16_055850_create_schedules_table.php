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
            $table->foreignId('course_ID')->constrained('courses','course_ID')->onDelete('cascade');
            $table->string('day_in_week');
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('is_recurring',['yes','no'])->default('no');
            $table->enum('recurrence_pattern',['daily','weekly','monthly'])->nullable();
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
