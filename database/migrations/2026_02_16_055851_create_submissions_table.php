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
Schema::create('submissions', function(Blueprint $table){
    $table->id('submission_ID');
    $table->foreignId('user_id')
          ->constrained('users','user_ID')
          ->onDelete('cascade');
    $table->foreignId('assessment_id')
          ->constrained('assessments','assessment_ID')
          ->onDelete('cascade');
    $table->foreignId('attachment_ID')
          ->nullable()
          ->constrained('attachments','attachment_ID');
    $table->enum('status',['submitted','graded','late'])->default('submitted');
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
