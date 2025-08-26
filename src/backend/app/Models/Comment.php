<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'user_id',
        'body',
        'upvote_count',
        'parent_id',
        'status',
        'flaged_at',
        'created_at',
        'updated_at',
    ];
    
    protected $casts = [
        'upvote_count' => 'integer',
        'flaged_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function post() : BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent() : BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies() : HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function upvotes() : HasMany
    {
        return $this->hasMany(CommentUpvote::class);
    }

    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeReplies($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeFlagged($query)
    {
        return $query->whereNotNull('flaged_at');
    }

    public function getAuthorNameAttribute()
    {
        return $this->user->username ?? 'Anonymous';
    }

    public function getAuthorInitialAttribute()
    {
        return substr($this->author_name, 0, 2);
    }

    public function getUpvotesCountAttribute()
    {
        return $this->upvotes->count();
    }

    public function getRepliesCountAttribute()
    {
        return $this->replies->count();
    }

    public function isFlagged()
    {
        return !is_null($this->flaged_at);
    }

    public function isReply()
    {
        return !is_null($this->parent_id);
    }

    public function incrementUpvotes()
    {
        $this->increment('upvote_count');
    }
    
    public function flag()
    {
        $this->update(['flaged_at' => now()]);
    }
    
    public function unflag()
    {
        $this->update(['flaged_at' => null]);
    }
    
    
}
