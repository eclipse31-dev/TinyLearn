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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id('log_ID');
            $table->foreignId('user_id')->constrained('users', 'user_ID')->onDelete('cascade');
            $table->string('action'); // e.g., 'created', 'updated', 'deleted', 'login', 'logout'
            $table->string('model_type')->nullable(); // e.g., 'Assignment', 'Course'
            $table->unsignedBigInteger('model_id')->nullable(); // ID of the affected model
            $table->text('description'); // Human-readable description
            $table->json('properties')->nullable(); // Store old/new values
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'created_at']);
            $table->index(['model_type', 'model_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
