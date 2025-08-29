<?php

namespace App\Policies;

use App\Models\Chat;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ChatPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Any authenticated user can view their chats
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Chat $chat): bool
    {
        return $chat->isParticipant($user->id) && $chat->isActive();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Any authenticated user can create chats
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Chat $chat): bool
    {
        return $chat->isParticipant($user->id) && $chat->isActive();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Chat $chat): bool
    {
        return $chat->hr_user_id === $user->id && $chat->isActive();
    }

    /**
     * Determine whether the user can read messages in the chat.
     */
    public function readMessages(User $user, Chat $chat): bool
    {
        return $chat->isParticipant($user->id) && $chat->isActive();
    }

    /**
     * Determine whether the user can send messages in the chat.
     */
    public function sendMessage(User $user, Chat $chat): bool
    {
        return $chat->isParticipant($user->id) && $chat->isActive();
    }

    /**
     * Determine whether the user can delete messages in the chat.
     */
    public function deleteMessage(User $user, Chat $chat): bool
    {
        return $chat->isParticipant($user->id) && $chat->isActive();
    }

    /**
     * Determine whether the user can close the chat.
     */
    public function close(User $user, Chat $chat): bool
    {
        return $chat->isParticipant($user->id) && $chat->isActive();
    }

    /**
     * Determine whether the user can archive the chat.
     */
    public function archive(User $user, Chat $chat): bool
    {
        return $chat->hr_user_id === $user->id && $chat->isActive();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Chat $chat): bool
    {
        return $chat->hr_user_id === $user->id && $chat->isArchived();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Chat $chat): bool
    {
        return $chat->hr_user_id === $user->id;
    }
}
