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
        Schema::create('role_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_ID')->constrained('roles', 'role_ID')->onDelete('cascade');
            $table->foreignId('permission_ID')->constrained('permissions', 'permission_ID')->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['role_ID', 'permission_ID']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_permissions');
    }
};
