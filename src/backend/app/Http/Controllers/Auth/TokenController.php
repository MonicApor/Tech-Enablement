<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\TokenService;
use Exception;

/**
 * @OA\Tag(
 *     name="Token Management",
 *     description="Token verification and management endpoints"
 * )
 */
class TokenController extends Controller
{
    protected $tokenService;

    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }

    /**
     * Verify activation token
     * 
     * @OA\Post(
     *     path="/api/auth/verify-token",
     *     summary="Verify activation token",
     *     tags={"Token Management"},
     *     security={},
     *     @OA\RequestBody(required=true, @OA\JsonContent(required={"token"}, @OA\Property(property="token", type="string"))),
     *     @OA\Response(response=200, description="Token is valid", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="valid", type="boolean", example=true))),
     *     @OA\Response(response=400, description="Invalid or expired token", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function verify(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'type' => 'required|string|in:activation,password_reset',
        ]);

        try {
            $result = $this->tokenService->verifyToken([
                'token' => $request->token,
                'type' => $request->type
            ]);

            return response()->json([
                'message' => 'Token is valid',
                'valid' => true,
                'user' => $result['user']
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'valid' => false
            ], 400);
        }
    }
}
