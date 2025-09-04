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
        // User must have an associated employee record to view chats
        return $user->isEmployee();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Chat $chat): bool
    {
        return $user->isEmployee() && $chat->isParticipant($user->employee->id) && $chat->isActive();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // User must have an associated employee record to create chats
        return $user->isEmployee();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Chat $chat): bool
    {
        return $user->isEmployee() && $chat->isParticipant($user->employee->id) && $chat->isActive();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Chat $chat): bool
    {
        return $user->isEmployee() && $chat->hr_employee_id === $user->employee->id && $chat->isActive();
    }

    /**
     * Determine whether the user can read messages in the chat.
     */
    public function readMessages(User $user, Chat $chat): bool
    {
        return $user->isEmployee() && $chat->isParticipant($user->employee->id) && $chat->isActive();
    }

    /**
     * Determine whether the user can send messages in the chat.
     */
    public function sendMessage(User $user, Chat $chat): bool
    {
        return $user->isEmployee() && $chat->isParticipant($user->employee->id) && $chat->isActive();
    }

    /**
     * Determine whether the user can delete messages in the chat.
     */
    public function deleteMessage(User $user, Chat $chat): bool
    {
        return $user->isEmployee() && $chat->isParticipant($user->employee->id) && $chat->isActive();
    }

    /**
     * Determine whether the user can close the chat.
     */
    public function close(User $user, Chat $chat): bool
    {
        return $user->isEmployee() && $chat->isParticipant($user->employee->id) && $chat->isActive();
    }

    /**
     * Determine whether the user can archive the chat.
     */
    public function archive(User $user, Chat $chat): bool
    {
        return $user->isEmployee() && $chat->hr_employee_id === $user->employee->id && $chat->isActive();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Chat $chat): bool
    {
        return $user->isEmployee() && $chat->hr_employee_id === $user->employee->id && $chat->isArchived();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Chat $chat): bool
    {
        return $user->isEmployee() && $chat->hr_employee_id === $user->employee->id;
    }
}
