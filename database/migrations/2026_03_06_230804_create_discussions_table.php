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
        Schema::create('discussions', function (Blueprint $table) {
            $table->id('discussion_ID');
            $table->unsignedBigInteger('course_ID')->nullable();
            $table->unsignedBigInteger('user_ID');
            $table->string('title');
            $table->text('content');
            $table->enum('category', ['general', 'question', 'announcement', 'study-group'])->default('general');
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_locked')->default(false);
            $table->integer('views')->default(0);
            $table->timestamps();

            $table->foreign('course_ID')->references('course_ID')->on('courses')->onDelete('cascade');
            $table->foreign('user_ID')->references('user_ID')->on('users')->onDelete('cascade');
        });

        Schema::create('discussion_replies', function (Blueprint $table) {
            $table->id('reply_ID');
            $table->unsignedBigInteger('discussion_ID');
            $table->unsignedBigInteger('user_ID');
            $table->text('content');
            $table->unsignedBigInteger('parent_reply_ID')->nullable();
            $table->timestamps();

            $table->foreign('discussion_ID')->references('discussion_ID')->on('discussions')->onDelete('cascade');
            $table->foreign('user_ID')->references('user_ID')->on('users')->onDelete('cascade');
            $table->foreign('parent_reply_ID')->references('reply_ID')->on('discussion_replies')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discussion_replies');
        Schema::dropIfExists('discussions');
    }
};
