<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';

// Google OAuth routes
Route::get('/auth/google/redirect', [\App\Http\Controllers\Api\GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [\App\Http\Controllers\Api\GoogleAuthController::class, 'callback']);
