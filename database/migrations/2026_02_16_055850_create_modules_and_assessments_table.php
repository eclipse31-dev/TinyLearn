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
        // Create modules table first
        Schema::create('modules', function(Blueprint $table){
            $table->id('module_ID');
            $table->foreignId('course_ID')->constrained('courses','course_ID')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('order')->default(1);
            $table->foreignId('created_by')->constrained('users','user_ID');
            $table->timestamps();
        });

        // Then create assessments table
        Schema::create('assessments', function(Blueprint $table){
            $table->id('assessment_ID');
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('module_ID')->constrained('modules','module_ID')->onDelete('cascade');
            $table->foreignId('attachment_ID')->nullable()->constrained('attachments','attachment_ID');
            $table->enum('status',['draft','published','closed'])->default('draft');
            $table->date('due_date');
            $table->foreignId('created_by')->constrained('users','user_ID');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessments');
        Schema::dropIfExists('modules');
    }
};

