<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class UserSession extends Model
{
    protected $fillable = [
        'user_id',
        'login_at',
        'logout_at',
        'duration_minutes',
        'ip_address',
        'user_agent',
        'is_active',
    ];

    protected $casts = [
        'login_at' => 'datetime',
        'logout_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_ID');
    }

    public function endSession(): void
    {
        $this->update([
            'logout_at' => now(),
            'duration_minutes' => $this->login_at->diffInMinutes(now()),
            'is_active' => false,
        ]);
    }

    public function getDurationHours(): float
    {
        if ($this->duration_minutes) {
            return round($this->duration_minutes / 60, 2);
        }

        if ($this->is_active) {
            return round($this->login_at->diffInMinutes(now()) / 60, 2);
        }

        return 0;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('login_at', today());
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('login_at', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ]);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('login_at', now()->month)
                    ->whereYear('login_at', now()->year);
    }
}