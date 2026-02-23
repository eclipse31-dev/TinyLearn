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
            Schema::create('modules', function(Blueprint $table){
            $table->id('module_ID');
            $table->foreignId('course_ID')->constrained('courses','course_ID')->onDelete('cascade');
            $table->string('title');
            $table->integer('order')->default(1);
            $table->foreignId('created_by')->constrained('users','user_ID');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};
