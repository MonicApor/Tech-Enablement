<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostUpvote extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'employee_id',
    ];

    /**
     * Get the post that owns the upvote.
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * Get the employee that owns the upvote.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }


}
