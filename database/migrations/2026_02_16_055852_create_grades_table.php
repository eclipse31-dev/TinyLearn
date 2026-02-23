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
            Schema::create('grade', function(Blueprint $table){
    $table->id('grade_ID');
    $table->foreignId('submission_ID')->constrained('submissions', 'submission_ID')->onDelete('cascade');
    $table->integer('score');
    $table->text('feedback')->nullable();
    // Point to the custom user_ID
    $table->foreignId('graded_by')->constrained('users', 'user_ID'); 
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
