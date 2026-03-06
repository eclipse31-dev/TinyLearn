<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Title and description are now added in the main assessments table creation
        // This migration is no longer needed
    }

    public function down(): void
    {
        // Schema::table('assessments', function (Blueprint $table) {
        //     $table->dropColumn(['title', 'description']);
        // });
    }
};
