<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommentUpvote extends Model
{
    use HasFactory;

    protected $fillable = [
        'comment_id',
        'employee_id',
    ];

    public function comment() : BelongsTo
    {
        return $this->belongsTo(Comment::class);
    }

    public function employee() : BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }


}