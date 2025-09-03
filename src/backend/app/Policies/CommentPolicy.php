<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\Employee;
use Illuminate\Auth\Access\HandlesAuthorization;

class CommentPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the employee can create comments.
     */
    public function create(Employee $employee): bool
    {
        return true; // Any authenticated employee can create comments
    }

    /**
     * Determine whether the employee can update the comment.
     */
    public function update(Employee $employee, Comment $comment): bool
    {
        // Employees can update their own comments
        return $employee->id === $comment->employee_id;
    }

    /**
     * Determine whether the employee can delete the comment.
     */
    public function delete(Employee $employee, Comment $comment): bool
    {
        // Employees can delete their own comments
        return $employee->id === $comment->employee_id;
    }
}
