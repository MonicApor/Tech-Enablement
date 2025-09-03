<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\Employee;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the employee can create posts.
     */
    public function create(Employee $employee): bool
    {
        return true; // Any authenticated employee can create posts
    }

    /**
     * Determine whether the employee can update the post.
     */
    public function update(Employee $employee, Post $post): bool
    {
        // Employees can update their own posts
        return $employee->id === $post->employee_id;
    }

    /**
     * Determine whether the employee can delete the post.
     */
    public function delete(Employee $employee, Post $post): bool
    {
        // Employees can delete their own posts
        return $employee->id === $post->employee_id;
    }
}
