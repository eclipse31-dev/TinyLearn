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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id('conversation_ID');
            $table->foreignId('user1_id')->constrained('users', 'user_ID')->onDelete('cascade');
            $table->foreignId('user2_id')->constrained('users', 'user_ID')->onDelete('cascade');
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();
            
            $table->index(['user1_id', 'user2_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
