<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CommentPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create comments.
     */
    public function create(User $user): bool
    {
        // User must have an associated employee record to create comments
        return $user->isEmployee();
    }

    /**
     * Determine whether the user can update the comment.
     */
    public function update(User $user, Comment $comment): bool
    {
        // Users can update their own comments (through their employee record)
        return $user->isEmployee() && $user->employee->id === $comment->employee_id;
    }

    /**
     * Determine whether the user can delete the comment.
     */
    public function delete(User $user, Comment $comment): bool
    {
        // Users can delete their own comments (through their employee record)
        return $user->isEmployee() && $user->employee->id === $comment->employee_id;
    }
}
