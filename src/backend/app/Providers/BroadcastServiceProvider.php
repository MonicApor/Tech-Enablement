<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Enable Laravel's built-in broadcasting routes with API prefix
        Broadcast::routes(['prefix' => 'api', 'middleware' => ['auth:api']]);

        require base_path('routes/channels.php');
    }

    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Laravel automatically registers the broadcast manager
        // No need to manually register it
    }
}
