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
        try {
            $accessToken = $request->input('access_token');
            $idToken = $request->input('id_token');

            if (!$accessToken || !$idToken) {
                return response()->json(['error' => 'Missing tokens'], 400);
            }

            $idTokenClaims = $this->validateIdToken($idToken);
            if (!$idTokenClaims) {
                return response()->json(['error' => 'Invalid ID token'], 400);
            }

            $graphUser = $this->getUserFromGraph($accessToken);
            if (!$graphUser) {
                return response()->json(['error' => 'Unable to verify user account'], 400);
            }

            $validationError = $this->validateUser($idTokenClaims, $graphUser);
            if ($validationError) {
                return response()->json(['error' => $validationError], 403);
            }

            $userRole = $this->determineUserRole($graphUser);

            $user = $this->createOrUpdateUser($idTokenClaims, $graphUser, $userRole);

            $tokenResult = $user->createToken('Microsoft365Login');
            $token = $tokenResult->token;
            $token->expires_at = now()->addDays(30);
            $token->save();

            Log::info('Microsoft 365 authentication successful', [
                'user_id' => $user->id,
                'microsoft_id' => $idTokenClaims['oid'],
                'role' => $userRole,
            ]);

            return response()->json([
                'access_token' => $tokenResult->accessToken,
                'token_type' => 'Bearer',
                'expires_at' => $token->expires_at->toDateTimeString(),
                'user' => $user,
            ]);

        } catch (\Exception $e) {
            Log::error('MSAL token validation error: ' . $e->getMessage());
            return response()->json(['error' => 'Token validation failed'], 500);
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
                return null;
            }

            $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1]));
            $claims = json_decode($payload, true);

            if (!$claims) {
                return null;
            }

            $now = time();
            if (isset($claims['exp']) && $claims['exp'] < $now) {
                Log::warning('ID token expired');
                return null;
            }

            return $claims;

        } catch (\Exception $e) {
            Log::error('ID token validation error: ' . $e->getMessage());
            return null;
        }
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
                '$select' => 'id,displayName,mail,userPrincipalName,accountEnabled,userType,department,jobTitle'
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
    private function validateUser($idTokenClaims, $graphUser)
    {
        $tenantId = config('services.microsoft-azure.tenant_id');
        $clientId = config('services.microsoft-azure.client_id');

        if ($idTokenClaims['aud'] !== $clientId) {
            return 'Invalid token audience';
        }

        $expectedIssuer = "https://login.microsoftonline.com/{$tenantId}/v2.0";
        if ($idTokenClaims['iss'] !== $expectedIssuer) {
            return 'Invalid token issuer';
        }

        if ($idTokenClaims['tid'] !== $tenantId) {
            return 'Access denied. Unauthorized tenant';
        }

        if (isset($graphUser['accountEnabled']) && !$graphUser['accountEnabled']) {
            return 'Account is disabled';
        }

        if (config('services.microsoft-azure.members_only', true) && 
            isset($graphUser['userType']) && 
            $graphUser['userType'] !== 'Member') {
            return 'Access denied. Guest accounts are not allowed';
        }

        return null;
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
    private function createOrUpdateUser($idTokenClaims, $graphUser, $userRole)
    {
        return User::updateOrCreate(
            ['microsoft_id' => $idTokenClaims['oid']],
            [
                'name' => $idTokenClaims['name'] ?? $graphUser['displayName'],
                'email' => $idTokenClaims['preferred_username'] ?? $graphUser['mail'] ?? $graphUser['userPrincipalName'],
                'microsoft_id' => $idTokenClaims['oid'],
                'email_verified_at' => now(),
                'microsoft_tenant_id' => $idTokenClaims['tid'],
                'user_type' => $graphUser['userType'] ?? 'Member',
                'role' => $userRole,
                'department' => $graphUser['department'] ?? null,
                'job_title' => $graphUser['jobTitle'] ?? null,
            ]
        );
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