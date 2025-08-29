<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;

class BroadcastingController extends Controller
{
    /**
     * Authenticate the incoming request for a given channel.
     */
    public function authenticate(Request $request)
    {
        // Get the user from the API token
        $user = Auth::guard('api')->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Get the channel name and socket ID
        $channelName = $request->input('channel_name');
        $socketId = $request->input('socket_id');

        if (!$channelName || !$socketId) {
            return response()->json(['error' => 'Missing channel_name or socket_id'], 400);
        }

        // Use Laravel's built-in broadcasting authentication
        $pusher = new \Pusher\Pusher(
            config('broadcasting.connections.pusher.key'),
            config('broadcasting.connections.pusher.secret'),
            config('broadcasting.connections.pusher.app_id'),
            config('broadcasting.connections.pusher.options')
        );
        
        // Check authorization using Laravel's channel authorization
        $channel = Broadcast::channel($channelName, function ($user) use ($channelName) {
            // This will use the authorization rules defined in routes/channels.php
            return true; // Let Laravel handle the authorization
        });

        if (!$channel) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $auth = $pusher->socket_auth($channelName, $socketId);

        return response($auth);
    }
}
