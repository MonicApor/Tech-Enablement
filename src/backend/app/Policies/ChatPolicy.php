<?php

namespace App\Policies;

use App\Models\Chat;
use App\Models\Employee;
use Illuminate\Auth\Access\HandlesAuthorization;

class ChatPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the employee can view any models.
     */
    public function viewAny(Employee $employee): bool
    {
        return true; // Any authenticated employee can view their chats
    }

    /**
     * Determine whether the employee can view the model.
     */
    public function view(Employee $employee, Chat $chat): bool
    {
        return $chat->isParticipant($employee->user->id) && $chat->isActive();
    }

    /**
     * Determine whether the employee can create models.
     */
    public function create(Employee $employee): bool
    {
        return true; // Any authenticated employee can create chats
    }

    /**
     * Determine whether the employee can update the model.
     */
    public function update(Employee $employee, Chat $chat): bool
    {
        return $chat->isParticipant($employee->user->id) && $chat->isActive();
    }

    /**
     * Determine whether the employee can delete the model.
     */
    public function delete(Employee $employee, Chat $chat): bool
    {
        return $chat->hr_employee_id === $employee->id && $chat->isActive();
    }

    /**
     * Determine whether the employee can read messages in the chat.
     */
    public function readMessages(Employee $employee, Chat $chat): bool
    {
        return $chat->isParticipant($employee->user->id) && $chat->isActive();
    }

    /**
     * Determine whether the employee can send messages in the chat.
     */
    public function sendMessage(Employee $employee, Chat $chat): bool
    {
        return $chat->isParticipant($employee->user->id) && $chat->isActive();
    }

    /**
     * Determine whether the employee can delete messages in the chat.
     */
    public function deleteMessage(Employee $employee, Chat $chat): bool
    {
        return $chat->isParticipant($employee->user->id) && $chat->isActive();
    }

    /**
     * Determine whether the employee can close the chat.
     */
    public function close(Employee $employee, Chat $chat): bool
    {
        return $chat->isParticipant($employee->user->id) && $chat->isActive();
    }

    /**
     * Determine whether the employee can archive the chat.
     */
    public function archive(Employee $employee, Chat $chat): bool
    {
        return $chat->hr_employee_id === $employee->id && $chat->isActive();
    }

    /**
     * Determine whether the employee can restore the model.
     */
    public function restore(Employee $employee, Chat $chat): bool
    {
        return $chat->hr_employee_id === $employee->id && $chat->isArchived();
    }

    /**
     * Determine whether the employee can permanently delete the model.
     */
    public function forceDelete(Employee $employee, Chat $chat): bool
    {
        return $chat->hr_employee_id === $employee->id;
    }
}
