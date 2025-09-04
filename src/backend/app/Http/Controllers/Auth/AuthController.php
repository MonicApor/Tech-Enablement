<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Services\UserService;
use Exception;
use App\Http\Resources\NewUserResource;
use App\Models\ActivationToken;

/**
 * @OA\Tag(
 *     name="Traditional Authentication",
 *     description="API Endpoints of Traditional Authentication"
 * )
 */
class AuthController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;

        // Only apply auth middleware to methods that need authentication
        $this->middleware(['auth:api'], ['only' => ['logout', 'me']]);
    }

    /**
     * Register a new user and send activation email
     * 
     * @OA\Post(
     *     path="/api/auth/register",
     *     summary="Register a new user and send activation email",
     *     tags={"Traditional Authentication"},
     *     security={},
     *     @OA\RequestBody(required=true, @OA\JsonContent(required={"first_name", "last_name", "email"}, @OA\Property(property="first_name", type="string"), @OA\Property(property="last_name", type="string"), @OA\Property(property="email", type="string"))),
     *     @OA\Response(response=201, description="Created", @OA\JsonContent(type="object", @OA\Property(property="data", ref="#/components/schemas/NewUser"), @OA\Property(property="message", type="string"))),
     *     @OA\Response(response=400, description="Bad request", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function register(RegisterRequest $request)
    {
        $request->validated();
        try {
            $formData = [
                'first_name' => $request->getFirstName(),
                'last_name' => $request->getLastName(),
                'email' => $request->getEmail(),
                'password' => null,
                'type' => 'signup',
            ];

            $user = $this->userService->createUser($formData);
            
            return response()->json([
                'message' => 'Invitation sent successfully. Please check your email to activate your account.',
                'data' => new NewUserResource($user)
            ], 201);

        } catch (Exception $e) {
            return response()->json(['message' => 'Failed to send invitation: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Activate user account with token and set password
     * 
     * @OA\Post(
     *     path="/api/auth/activate",
     *     summary="Activate user account with token and set password",
     *     tags={"Traditional Authentication"},
     *     security={},
     *     @OA\RequestBody(required=true, @OA\JsonContent(required={"token", "password", "password_confirmation"}, @OA\Property(property="token", type="string"), @OA\Property(property="password", type="string"), @OA\Property(property="password_confirmation", type="string"))),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="user", ref="#/components/schemas/NewUser"))),
     *     @OA\Response(response=400, description="Invalid or expired token", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function activate(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        try {
            // Find the activation token
            $activationToken = ActivationToken::where('token', $request->token)
                ->where('revoked', false)
                ->first();

            if (!$activationToken) {
                return response()->json(['message' => 'Invalid or expired token'], 400);
            }

            // Get the user
            $user = $activationToken->user;
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Update user password
            $user->update([
                'password' => Hash::make($request->password),
                'email_verified_at' => now(),
            ]);

            // Mark token as used
            $activationToken->markAsUsed();

            return response()->json([
                'message' => 'Account activated successfully',
                'user' => new NewUserResource($user)
            ], 200);

        } catch (Exception $e) {
            return response()->json(['message' => 'Failed to activate account: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Issue OAuth token for password grant
     * 
     * @OA\Post(
     *     path="/api/oauth/token",
     *     summary="Issue OAuth token for password grant",
     *     tags={"OAuth"},
     *     security={},
     *     @OA\RequestBody(required=true, @OA\JsonContent(required={"grant_type", "username", "password", "client_id", "client_secret"}, @OA\Property(property="grant_type", type="string"), @OA\Property(property="username", type="string"), @OA\Property(property="password", type="string"), @OA\Property(property="client_id", type="string"), @OA\Property(property="client_secret", type="string"))),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="access_token", type="string"), @OA\Property(property="token_type", type="string"), @OA\Property(property="expires_in", type="integer"))),
     *     @OA\Response(response=401, description="Invalid credentials", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function issueToken(Request $request)
    {
        $request->validate([
            'grant_type' => 'required|string',
            'username' => 'required|email',
            'password' => 'required|string',
            'client_id' => 'required|string',
            'client_secret' => 'required|string',
        ]);

        // Validate client credentials (you can make this more secure)
        if ($request->client_id !== config('auth.oauth.client_id') || 
            $request->client_secret !== config('auth.oauth.client_secret')) {
            return response()->json(['error' => 'Invalid client credentials'], 401);
        }

        try {
            $user = User::where('email', $request->username)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            if (!$user->email_verified_at) {
                return response()->json(['error' => 'Account not activated'], 401);
            }

            $tokenResult = $user->createToken('PasswordGrant', ['*'], now()->addDays(30));

            return response()->json([
                'access_token' => $tokenResult->plainTextToken,
                'token_type' => 'Bearer',
                'expires_in' => 30 * 24 * 60 * 60, // 30 days in seconds
                'refresh_token' => null, // Sanctum doesn't provide refresh tokens by default
            ], 200);

        } catch (Exception $e) {
            return response()->json(['error' => 'Token generation failed'], 500);
        }
    }

    /**
     * Refresh OAuth token
     * 
     * @OA\Post(
     *     path="/api/oauth/refresh",
     *     summary="Refresh OAuth token",
     *     tags={"OAuth"},
     *     security={},
     *     @OA\RequestBody(required=true, @OA\JsonContent(required={"grant_type", "refresh_token", "client_id", "client_secret"}, @OA\Property(property="grant_type", type="string"), @OA\Property(property="refresh_token", type="string"), @OA\Property(property="client_id", type="string"), @OA\Property(property="client_secret", type="string"))),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="access_token", type="string"), @OA\Property(property="token_type", type="string"), @OA\Property(property="expires_in", type="integer"))),
     *     @OA\Response(response=401, description="Invalid refresh token", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function refreshToken(Request $request)
    {
        $request->validate([
            'grant_type' => 'required|string',
            'refresh_token' => 'required|string',
            'client_id' => 'required|string',
            'client_secret' => 'required|string',
        ]);

        if ($request->client_id !== config('auth.oauth.client_id') || 
            $request->client_secret !== config('auth.oauth.client_secret')) {
            return response()->json(['error' => 'Invalid client credentials'], 401);
        }

        try {            
            return response()->json(['error' => 'Refresh tokens not implemented with Sanctum'], 501);
            
        } catch (Exception $e) {
            return response()->json(['error' => 'Token refresh failed'], 500);
        }
    }

    /**
     * Login user with email and password
     * 
     * @OA\Post(
     *     path="/api/auth/login",
     *     summary="Login user with email and password",
     *     tags={"Traditional Authentication"},
     *     security={},
     *     @OA\RequestBody(required=true, @OA\JsonContent(required={"email", "password"}, @OA\Property(property="email", type="string"), @OA\Property(property="password", type="string"))),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="user", ref="#/components/schemas/NewUser"), @OA\Property(property="token", type="string"))),
     *     @OA\Response(response=401, description="Invalid credentials", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        try {
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            if (!$user->email_verified_at) {
                return response()->json(['message' => 'Please activate your account first'], 401);
            }

            $tokenResult = $user->createToken('AuthToken', ['*'], now()->addDays(30));

            return response()->json([
                'message' => 'Login successful',
                'user' => new NewUserResource($user),
                'token' => $tokenResult->plainTextToken
            ], 200);

        } catch (Exception $e) {
            return response()->json(['message' => 'Login failed'], 500);
        }
    }

    /**
     * Logout user and revoke token
     * 
     * @OA\Post(
     *     path="/api/auth/logout",
     *     summary="Logout user and revoke token",
     *     tags={"Traditional Authentication"},
     *     security={{"passport":{}}},
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"))),
     *     @OA\Response(response=401, description="Unauthorized", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->token()->revoke();
            return response()->json(['message' => 'Logged out successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Logout failed'], 500);
        }
    }

    /**
     * Get current authenticated user
     * 
     * @OA\Get(
     *     path="/api/auth/me",
     *     summary="Get current authenticated user",
     *     tags={"Traditional Authentication"},
     *     security={{"passport":{}}},
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="user", ref="#/components/schemas/NewUser"))),
     *     @OA\Response(response=401, description="Unauthorized", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function me(Request $request)
    {
        try {
            return response()->json([
                'user' => new NewUserResource($request->user())
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Failed to get user data'], 500);
        }
    }
}
