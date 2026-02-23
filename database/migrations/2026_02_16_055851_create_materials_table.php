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
            Schema::create('materials', function(Blueprint $table){
            $table->id();
            $table->foreignId('module_ID')->constrained('modules','module_ID')->onDelete('cascade');
            $table->enum('materials_type',['video','document','link'])->default('document');
            $table->foreignId('attachment_ID')->nullable()->constrained('attachments','attachment_ID');
            $table->text('content')->nullable();
            $table->foreignId('created_by')->constrained('users','user_ID');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
