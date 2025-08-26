<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    /**
     * Default page for API.
     *
     * @OA\Get(
     *     path="/api",
     *     summary="API Welcome Page",
     *     tags={"API"},
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="version", type="string"), @OA\Property(property="status", type="string"), @OA\Property(property="timestamp", type="string"), @OA\Property(property="endpoints", type="object")))
     * )
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
