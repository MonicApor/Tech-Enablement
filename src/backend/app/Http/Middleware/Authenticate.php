<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // For API requests or broadcasting authentication, return null to prevent redirect
        if ($request->expectsJson() || $request->is('api/*') || $request->is('broadcasting/*')) {
            return null;
        }
        
        // For web requests, redirect to login (if route exists)
        try {
            return route('login');
        } catch (\Exception $e) {
            return null;
        }
    }
}
