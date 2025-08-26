<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'body',
        'status',
        'upvote_count',
        'viewer_count',
        'flaged_at',
        'resolved_at',
        'created_at',
        'updated_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'upvote_count' => 'integer',
        'viewer_count' => 'integer',
        'flaged_at' => 'datetime',
        'resolved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the post.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category that owns the post.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function comments() : HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the upvotes for the post.
     */
    public function upvotes() : HasMany
    {
        return $this->hasMany(Upvote::class);
    }

    public function views() : HasMany
    {
        return $this->hasMany(View::class);
    }

    /**
     * Check if the post is flagged.
     */
    public function isFlagged()
    {
        return !is_null($this->flaged_at);
    }

    /**
     * Check if the post is resolved.
     */
    public function isResolved()
    {
        return !is_null($this->resolved_at);
    }

    /**
     * Scope to get only active posts.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to get only flagged posts.
     */
    public function scopeFlagged($query)
    {
        return $query->whereNotNull('flaged_at');
    }

    /**
     * Scope to get only resolved posts.
     */
    public function scopeResolved($query)
    {
        return $query->whereNotNull('resolved_at');
    }

    public function scopeCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeAnonIdentity($query, $anonIdentityId)
    {
        return $query->where('anon_identity_id', $anonIdentityId);
    }

    public function getAuthorNameAttribute()
    {
        return $this->user->username ?? 'Anonymous';
    }

    public function getAuthorInitialAttribute()
    {
        return substr($this->author_name, 0, 2);
    }

    public function getCommentsCountAttribute()
    {
        return $this->comments->count();
    }

    public function getUpvotesCountAttribute()
    {
        return $this->upvotes->count();
    }

    public function getViewsCountAttribute()
    {
        return $this->views->count();
    }

    public function incrementUpvotes()
    {
        $this->increment('upvote_count');  
    }

    public function incrementViews()
    {
        $this->increment('viewer_count');
    }

    public function flag()
    {
        $this->update(['flaged_at' => now()]);
    }

    public function resolve()
    {
        $this->update(['resolved_at' => now()]);
    }

    public function topLevelComments(): HasMany
    {
        return $this->hasMany(Comment::class)->whereNull('parent_id');
    }

    public function allComments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function getTopLevelCommentsCountAttribute()
    {
        return $this->topLevelComments()->count();
    }

    public function getTotalCommentsCountAttribute()
    {
        return $this->allComments()->count();
    }

}
