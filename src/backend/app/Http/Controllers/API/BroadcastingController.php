<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;

/**
 * @OA\Tag(
 *     name="Broadcasting",
 *     description="WebSocket broadcasting authentication endpoints"
 * )
 */

class BroadcastingController extends Controller
{
    /**
     * Authenticate the incoming request for a given channel.
     * 
     * @OA\Post(
     *     path="/api/broadcasting/auth",
     *     summary="Authenticate WebSocket channel subscription",
     *     description="Authenticates a user for WebSocket channel subscription. This endpoint is used by Laravel Echo to authorize private channel subscriptions.",
     *     tags={"Broadcasting"},
     *     security={{"bearerAuth": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"channel_name", "socket_id"},
     *             @OA\Property(property="channel_name", type="string", example="private-chat.14", description="The name of the channel to subscribe to"),
     *             @OA\Property(property="socket_id", type="string", example="123456.789012", description="The socket ID from the WebSocket connection")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Authentication successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="auth", type="string", example="DRcpFZv3w5a4:123456.789012:abcdef1234567890", description="The authentication signature")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad request - missing parameters",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Missing channel_name or socket_id")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized - invalid or missing token",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Unauthorized")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden - user not authorized for this channel",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Forbidden")
     *         )
     *     )
     * )
     */
    public function authenticate(Request $request)
    {
        $user = Auth::guard('api')->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $channelName = $request->input('channel_name');
        $socketId = $request->input('socket_id');

        if (!$channelName || !$socketId) {
            return response()->json(['error' => 'Missing channel_name or socket_id'], 400);
        }

        $authorized = false;
        
        if (str_starts_with($channelName, 'private-chat.')) {
            $chatId = str_replace('private-chat.', '', $channelName);
            $chat = \App\Models\Chat::find($chatId);
            $authorized = $chat && $user->isEmployee() && $chat->isParticipant($user->employee->id);
        } elseif (str_starts_with($channelName, 'private-user.')) {
            $userId = str_replace('private-user.', '', $channelName);
            $authorized = (int) $user->id === (int) $userId;
        } elseif (str_starts_with($channelName, 'private-user-notification.')) {
            $userId = str_replace('private-user-notification.', '', $channelName);
            $authorized = (int) $user->id === (int) $userId;
        }
        
        if (!$authorized) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        // Generate the authentication response
        $pusher = new \Pusher\Pusher(
            config('broadcasting.connections.pusher.key'),
            config('broadcasting.connections.pusher.secret'),
            config('broadcasting.connections.pusher.app_id'),
            config('broadcasting.connections.pusher.options')
        );
        
        $auth = $pusher->socket_auth($channelName, $socketId);

        return response($auth);
    }


}
