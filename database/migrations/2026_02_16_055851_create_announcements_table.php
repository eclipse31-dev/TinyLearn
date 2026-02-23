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
           Schema::create('announcements', function(Blueprint $table){
    $table->id('announcement_ID');

    $table->unsignedBigInteger('course_ID');
    $table->foreign('course_ID')->references('course_ID')->on('courses')->onDelete('cascade');

    $table->string('title');
    $table->text('content');

    $table->unsignedBigInteger('attachment_ID')->nullable();
    $table->foreign('attachment_ID')->references('attachment_ID')->on('attachments')->onDelete('set null');

    $table->unsignedBigInteger('created_by');
    $table->foreign('created_by')->references('user_ID')->on('users')->onDelete('cascade');

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
