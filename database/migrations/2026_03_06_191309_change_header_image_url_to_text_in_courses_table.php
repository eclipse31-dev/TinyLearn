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
        Schema::table('courses', function (Blueprint $table) {
            // Add header_image_url column if it doesn't exist
            if (!Schema::hasColumn('courses', 'header_image_url')) {
                $table->longText('header_image_url')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            if (Schema::hasColumn('courses', 'header_image_url')) {
                $table->dropColumn('header_image_url');
            }
        });
    }
};
