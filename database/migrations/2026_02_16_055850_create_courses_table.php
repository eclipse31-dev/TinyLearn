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
        Schema::create('courses', function(Blueprint $table){
            $table->id('course_ID');
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('course_code')->unique();
            $table->text('description')->nullable();
            $table->enum('status',['draft','active','archived'])->default('draft');
            $table->boolean('is_private')->default(true);
            $table->foreignId('created_by')->constrained('users', 'user_ID'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};