<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    /**
     * Default page for API.
     *
     * @return Illuminate\Http\Response
     */
    public function __invoke()
    {
        return response()->json([
            'message' => 'Welcome to AEFS-APOR API - Anonymous Employee Feedback System',
            'version' => '1.0.0',
            'status' => 'active',
            'timestamp' => now()->toISOString(),
            'endpoints' => [
                'authentication' => [
                    'microsoft_login' => '/api/auth/microsoft',
                    'logout' => '/api/auth/logout',
                    'user_info' => '/api/auth/user'
                ]
            ]
        ]);
    }
}
