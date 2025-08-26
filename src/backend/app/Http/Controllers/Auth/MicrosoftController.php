<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MicrosoftController extends Controller
{
    /**
     * Authenticate user with Microsoft MSAL token
     * 
     * @OA\Post(
     *     path="/api/auth/microsoft/validate",
     *     summary="Validate Microsoft MSAL token",
     *     tags={"Authentication"},
     *     security={},
     *     @OA\RequestBody(required=true, @OA\JsonContent(required={"id_token"}, @OA\Property(property="id_token", type="string"))),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="access_token", type="string"), @OA\Property(property="refresh_token", type="string", nullable=true), @OA\Property(property="token_type", type="string"), @OA\Property(property="expires_at", type="string"), @OA\Property(property="user", ref="#/components/schemas/User"))),
     *     @OA\Response(response=400, description="Bad request", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=403, description="Forbidden", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function validateMsalToken(Request $request)
    {
        try {
            $idToken = $request->input('id_token');

            if (!$idToken) {
                return response()->json(['error' => 'Missing ID token'], 400);
            }

            $idTokenClaims = $this->validateIdToken($idToken);
            if (!$idTokenClaims) {
                return response()->json(['error' => 'Invalid ID token'], 400);
            }

            $validationError = $this->validateUser($idTokenClaims);
            if ($validationError) {
                return response()->json(['error' => $validationError], 403);
            }

            $user = $this->createOrUpdateUser($idTokenClaims, 'Employee');

            $tokenResult = $user->createToken('Microsoft365Login');
            $token = $tokenResult->token;
            $token->expires_at = now()->addDays(30);
            $token->save();

            return response()->json([
                'access_token' => $tokenResult->accessToken,
                'refresh_token' => null,
                'token_type' => 'Bearer',
                'expires_at' => $token->expires_at->toDateTimeString(),
                'user' => $user,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Token validation failed', 
                'message' => $e->getMessage(),
                'debug' => config('app.debug') ? $e->getTraceAsString() : null,
                'line' => config('app.debug') ? $e->getLine() : null,
                'file' => config('app.debug') ? basename($e->getFile()) : null
            ], 500);
        }
    }

    /**
     * Get current authenticated user
     * 
     * @OA\Get(
     *     path="/api/auth/user",
     *     summary="Get current authenticated user",
     *     tags={"Authentication"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="user", ref="#/components/schemas/User"))),
     *     @OA\Response(response=401, description="Unauthenticated", @OA\JsonContent(type="object", @OA\Property(property="user", type="string", nullable=true)))
     * )
     */
    public function user()
    {
        if (Auth::check()) {
            return response()->json(['user' => Auth::user()]);
        }
        
        return response()->json(['user' => null], 401);
    }

    /**
     * Logout current user
     * 
     * @OA\Post(
     *     path="/api/auth/logout",
     *     summary="Logout current user",
     *     tags={"Authentication"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(ref="#/components/schemas/SuccessMessage"))
     * )
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Get user profile
     * 
     * @OA\Get(
     *     path="/api/auth/profile",
     *     summary="Get user profile",
     *     tags={"Authentication"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="user", ref="#/components/schemas/User")))
     * )
     */
    public function profile()
    {
        return response()->json(['user' => Auth::user()]);
    }

    private function validateIdToken($idToken)
    {
        try {
            $parts = explode('.', $idToken);
            if (count($parts) !== 3) {
                return null;
            }

            $payload = $this->base64UrlDecode($parts[1]);
            $claims = json_decode($payload, true);

            if (!$claims) {
                return null;
            }

            $now = time();
            if (isset($claims['exp']) && $claims['exp'] < $now) {
                return null;
            }

            return $claims;

        } catch (\Exception $e) {
            return null;
        }
    }

    private function base64UrlDecode($data)
    {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $padLength = 4 - $remainder;
            $data .= str_repeat('=', $padLength);
        }
        
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
    }

    private function validateUser($idTokenClaims)
    {
        try {
            $issuer = $idTokenClaims['iss'] ?? '';
            if (!str_contains($issuer, 'login.microsoftonline.com')) {
                return 'Invalid token issuer - not from Microsoft';
            }

            $userEmail = $idTokenClaims['preferred_username'] ?? 
                        $idTokenClaims['email'] ?? 
                        $idTokenClaims['unique_name'] ?? 
                        $idTokenClaims['upn'] ?? null;
            
            if (!$userEmail) {
                return 'No email found in token';
            }

            if (!isset($idTokenClaims['oid']) && !isset($idTokenClaims['sub'])) {
                return 'No user identifier found in token';
            }
            
            return null;

        } catch (\Exception $e) {
            return 'User validation failed: ' . $e->getMessage();
        }
    }

    private function createOrUpdateUser($idTokenClaims, $userRole)
    {
        $microsoftId = $idTokenClaims['oid'] ?? $idTokenClaims['sub'] ?? null;
        if (!$microsoftId) {
            throw new \Exception('No Microsoft user identifier found');
        }

        $email = $idTokenClaims['preferred_username'] ?? 
                $idTokenClaims['email'] ?? 
                $idTokenClaims['unique_name'] ?? 
                $idTokenClaims['upn'] ?? null;

        if (!$email) {
            throw new \Exception('No email found in token claims');
        }

        $userData = [
            'name' => $idTokenClaims['name'] ?? 'Unknown User',
            'email' => $email,
            'microsoft_id' => $microsoftId,
            'email_verified_at' => now(),
            'microsoft_tenant_id' => $idTokenClaims['tid'] ?? null,
            'user_type' => 'Member',
            'role' => $userRole,
        ];

        return User::updateOrCreate(
            ['microsoft_id' => $microsoftId],
            $userData
        );
    }

}