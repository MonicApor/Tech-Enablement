<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MicrosoftController extends Controller
{
    /**
     * Validate MSAL token from frontend and create Laravel session
     * This is the main method used by the MSAL frontend
     */
    public function validateMsalToken(Request $request)
    {
        // Handle CORS preflight
        if ($request->isMethod('OPTIONS')) {
            return response()->json([], 200)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'POST, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        }

        try {
            Log::info('MSAL token validation started', [
                'method' => $request->method(),
                'content_type' => $request->header('Content-Type'),
                'has_id_token' => $request->has('id_token'),
                'user_agent' => $request->header('User-Agent')
            ]);

            $idToken = $request->input('id_token');

            if (!$idToken) {
                Log::error('Missing ID token in request', [
                    'request_data' => $request->all(),
                    'content_type' => $request->header('Content-Type')
                ]);
                return response()->json(['error' => 'Missing ID token'], 400)
                    ->header('Access-Control-Allow-Origin', '*');
            }

            Log::info('ID token received', ['token_length' => strlen($idToken)]);

            // Validate and decode ID token
            $idTokenClaims = $this->validateIdToken($idToken);
            if (!$idTokenClaims) {
                Log::error('ID token validation failed');
                return response()->json(['error' => 'Invalid ID token'], 400)
                    ->header('Access-Control-Allow-Origin', '*');
            }

            Log::info('ID token decoded successfully', [
                'claims_count' => count($idTokenClaims),
                'has_aud' => isset($idTokenClaims['aud']),
                'has_iss' => isset($idTokenClaims['iss']),
                'has_email' => isset($idTokenClaims['email']) || isset($idTokenClaims['preferred_username'])
            ]);

            // Validate user using only ID token claims (no Graph API needed)
            $validationError = $this->validateUser($idTokenClaims);
            if ($validationError) {
                return response()->json(['error' => $validationError], 403)
                    ->header('Access-Control-Allow-Origin', '*');
            }

            // Set default role
            $userRole = 'Employee';

            // Create or update user using only ID token data
            $user = $this->createOrUpdateUser($idTokenClaims, $userRole);

            // Create Passport token
            $tokenResult = $user->createToken('Microsoft365Login');
            $token = $tokenResult->token;
            $token->expires_at = now()->addDays(30);
            $token->save();

            Log::info('Microsoft 365 authentication successful', [
                'user_id' => $user->id,
                'microsoft_id' => $idTokenClaims['oid'] ?? $idTokenClaims['sub'],
                'role' => $userRole,
            ]);

            return response()->json([
                'access_token' => $tokenResult->accessToken,
                'refresh_token' => null, // Not needed for this flow
                'token_type' => 'Bearer',
                'expires_at' => $token->expires_at->toDateTimeString(),
                'user' => $user,
            ])->header('Access-Control-Allow-Origin', '*');

        } catch (\Exception $e) {
            Log::error('MSAL token validation error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all(),
                'line' => $e->getLine(),
                'file' => basename($e->getFile())
            ]);
            return response()->json([
                'error' => 'Token validation failed', 
                'message' => $e->getMessage(),
                'debug' => config('app.debug') ? $e->getTraceAsString() : null,
                'line' => config('app.debug') ? $e->getLine() : null,
                'file' => config('app.debug') ? basename($e->getFile()) : null
            ], 500)->header('Access-Control-Allow-Origin', '*');
        }
    }

    /**
     * Get authenticated user info
     */
    public function user()
    {
        if (Auth::check()) {
            return response()->json(['user' => Auth::user()]);
        }
        
        return response()->json(['user' => null], 401);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Validate ID token (basic validation)
     */
    private function validateIdToken($idToken)
    {
        try {
            $parts = explode('.', $idToken);
            if (count($parts) !== 3) {
                Log::error('Invalid JWT format - expected 3 parts, got ' . count($parts));
                return null;
            }

            // Decode the payload with proper base64url decoding
            $payload = $this->base64UrlDecode($parts[1]);
            $claims = json_decode($payload, true);

            if (!$claims) {
                Log::error('Failed to decode JWT payload');
                return null;
            }

            Log::info('JWT payload decoded successfully', [
                'claims_count' => count($claims),
                'exp' => $claims['exp'] ?? 'missing',
                'iss' => $claims['iss'] ?? 'missing'
            ]);

            $now = time();
            if (isset($claims['exp']) && $claims['exp'] < $now) {
                Log::warning('ID token expired', [
                    'exp' => $claims['exp'],
                    'now' => $now,
                    'expired_seconds_ago' => $now - $claims['exp']
                ]);
                return null;
            }

            return $claims;

        } catch (\Exception $e) {
            Log::error('ID token validation error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }

    /**
     * Base64 URL decode (RFC 4648)
     */
    private function base64UrlDecode($data)
    {
        // Add padding if needed
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $padLength = 4 - $remainder;
            $data .= str_repeat('=', $padLength);
        }
        
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
    }

    /**
     * Get user info from Microsoft Graph API
     */
    private function getUserFromGraph($accessToken)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
                'Accept' => 'application/json',
            ])->get('https://graph.microsoft.com/v1.0/me', [
                '$select' => 'id,displayName,mail,userPrincipalName,accountEnabled,userType'
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Microsoft Graph API error', [
                'status' => $response->status(),
                'response' => $response->body()
            ]);
            return null;

        } catch (\Exception $e) {
            Log::error('Microsoft Graph API exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Validate user meets security requirements
     */
    private function validateUser($idTokenClaims)
    {
        try {
            Log::info('Validating user with claims', [
                'all_claims' => array_keys($idTokenClaims),
                'aud' => $idTokenClaims['aud'] ?? 'missing',
                'iss' => $idTokenClaims['iss'] ?? 'missing',
                'email' => $idTokenClaims['preferred_username'] ?? $idTokenClaims['email'] ?? 'missing',
                'name' => $idTokenClaims['name'] ?? 'missing'
            ]);

            // For multitenant with basic permissions, do minimal validation
            
            // 1. Check if token is from Microsoft
            $issuer = $idTokenClaims['iss'] ?? '';
            if (!str_contains($issuer, 'login.microsoftonline.com')) {
                Log::error('Invalid issuer', ['issuer' => $issuer]);
                return 'Invalid token issuer - not from Microsoft';
            }

            // 2. Check if we have basic user info
            $userEmail = $idTokenClaims['preferred_username'] ?? 
                        $idTokenClaims['email'] ?? 
                        $idTokenClaims['unique_name'] ?? 
                        $idTokenClaims['upn'] ?? null;
            
            if (!$userEmail) {
                Log::error('No email found in token', ['available_claims' => array_keys($idTokenClaims)]);
                return 'No email found in token';
            }

            // 3. Check if we have a user identifier
            if (!isset($idTokenClaims['oid']) && !isset($idTokenClaims['sub'])) {
                Log::error('No user identifier found in token');
                return 'No user identifier found in token';
            }

            // 4. Skip client ID validation for multitenant testing
            // In production, you'd want to validate this properly
            Log::info('Skipping client ID validation for multitenant testing');

            Log::info('User validation successful', [
                'email' => $userEmail,
                'user_id' => $idTokenClaims['oid'] ?? $idTokenClaims['sub'] ?? 'unknown'
            ]);
            
            return null; // Validation passed

        } catch (\Exception $e) {
            Log::error('User validation error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return 'User validation failed: ' . $e->getMessage();
        }
    }

    /**
     * Determine user role from department and job title
     */
    private function determineUserRole($graphUser)
    {
        $department = $graphUser['department'] ?? '';
        $jobTitle = $graphUser['jobTitle'] ?? '';
        
        $departmentRoles = [
            'IT' => 'System Admin',
            'Information Technology' => 'System Admin',
            'Technology' => 'System Admin',
            'Admin' => 'System Admin',
            'HR' => 'HR',
            'Human Resources' => 'HR',
            'People' => 'HR',
            'Management' => 'Manager',
            'Executive' => 'Manager',
        ];

        foreach ($departmentRoles as $dept => $role) {
            if (stripos($department, $dept) !== false) {
                return $role;
            }
        }

        $managerTitles = ['admin', 'administrator', 'manager', 'director', 'head', 'lead', 'supervisor'];
        foreach ($managerTitles as $title) {
            if (stripos($jobTitle, $title) !== false) {
                return 'Manager';
            }
        }

        return 'Employee';
    }

    /**
     * Create or update user in database
     */
    private function createOrUpdateUser($idTokenClaims, $userRole)
    {
        try {
            // Get user identifier (oid preferred, sub as fallback)
            $microsoftId = $idTokenClaims['oid'] ?? $idTokenClaims['sub'] ?? null;
            if (!$microsoftId) {
                throw new \Exception('No Microsoft user identifier found');
            }

            // Get email from various possible fields
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
                'user_type' => 'Member', // Default since we can't check without Graph API
                'role' => $userRole,
                'department' => null, // Not available with basic permissions
                'job_title' => null, // Not available with basic permissions
            ];

            Log::info('Creating/updating user', [
                'microsoft_id' => $microsoftId,
                'email' => $email,
                'role' => $userRole,
                'tenant_id' => $idTokenClaims['tid'] ?? 'unknown'
            ]);

            $user = User::updateOrCreate(
                ['microsoft_id' => $microsoftId],
                $userData
            );

            Log::info('User created/updated successfully', [
                'user_id' => $user->id,
                'role' => $user->role
            ]);

            return $user;

        } catch (\Exception $e) {
            Log::error('User creation/update failed: ' . $e->getMessage(), [
                'microsoft_id' => $idTokenClaims['oid'],
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Legacy redirect method (not used with MSAL frontend)
     */
    public function redirectToMicrosoft()
    {
        return response()->json([
            'error' => 'This endpoint is deprecated. Please use MSAL frontend authentication.'
        ], 410);
    }

    /**
     * Legacy callback method (not used with MSAL frontend) - can be removed if not used
     */
    public function handleMicrosoftCallback(Request $request)
    {
        return response()->json([
            'error' => 'This endpoint is deprecated. Please use MSAL frontend authentication.'
        ], 410);
    }
}