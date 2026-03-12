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
           Schema::create('enrollments', function(Blueprint $table){
    $table->id('enrollment_ID');
    
    $table->unsignedBigInteger('user_id');
    $table->foreign('user_id')->references('user_ID')->on('users')->onDelete('cascade');

    $table->unsignedBigInteger('course_id');
    $table->foreign('course_id')->references('course_ID')->on('courses')->onDelete('cascade');

    $table->enum('status',['active','dropped','completed','invited','accepted'])->default('active');
    $table->enum('enrollment_type',['self','invited'])->default('self');
    $table->date('enrolled_at')->useCurrent();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
