<?php

use App\Models\Chat;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Chat channels - allow users to listen to chat channels they're part of
Broadcast::channel('chat.{chatId}', function ($user, $chatId) {
    // Check if the user is a participant in this chat
    $chat = Chat::find($chatId);
    return $chat && $chat->isParticipant($user->id);
});

// User channels for chat updates
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
