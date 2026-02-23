<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Schedule;
use App\Policies\SchedulePolicy;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    protected $policies = [
        Schedule::class => SchedulePolicy::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Schedule::class, SchedulePolicy::class);
    }
}
