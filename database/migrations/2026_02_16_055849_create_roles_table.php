<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function(Blueprint $table){
            $table->id('role_ID'); // primary key
            $table->string('role'); // lowercase, matches controller and validation
            $table->timestamps();
        });

        // Seed default roles
        \DB::table('roles')->insert([
            ['role' => 'teacher', 'created_at' => now(), 'updated_at' => now()],
            ['role' => 'student', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};