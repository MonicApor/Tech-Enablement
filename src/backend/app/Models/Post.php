<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Employee;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Chat;
use App\Models\PostUpvote;
use App\Models\PostAttachment;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_id',
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
        'deleted_at',
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
     * Get the employee that owns the post.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
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

    public function chats() : HasMany
    {
        return $this->hasMany(Chat::class);
    }



    /**
     * Get the upvotes for the post.
     */
    public function upvotes() : HasMany
    {
        return $this->hasMany(PostUpvote::class);
    }

    /**
     * Get the attachments for the post.
     */
    public function attachments() : HasMany
    {
        return $this->hasMany(PostAttachment::class);
    }

    // public function views() : HasMany
    // {
    //     return $this->hasMany(View::class);
    // }

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

    public function getAuthorNameAttribute()
    {
        return $this->employee->user->username ?? 'Anonymous';
    }

    public function getCommentsCountAttribute()
    {
        return $this->comments->count();
    }

    public function getUpvotesCountAttribute()
    {
        return $this->upvote_count ?? 0;
    }

    public function getViewsCountAttribute()
    {
        return $this->viewer_count ?? 0;
    }

    public function incrementUpvotes()
    {
        $this->increment('upvote_count');  
    }

    public function upvote()
    {
        $user = auth()->user();
        if (!$user->employee) {
            throw new \Exception('User does not have an associated employee record');
        }
        
        $employeeId = $user->employee->id;
        
        $existingUpvote = $this->upvotes()->where('employee_id', $employeeId)->first();
        
        if ($existingUpvote) {
            $existingUpvote->delete();
            $this->decrement('upvote_count');
            return false;
        } else {
            $this->upvotes()->create(['employee_id' => $employeeId]);
            $this->increment('upvote_count');
            return true;
        }
    }

    /**
     * Check if the current employee has upvoted this post.
     */
    public function isUpvotedByUser()
    {
        if (!auth()->check()) {
            return false;
        }
        
        $user = auth()->user();
        if (!$user->employee) {
            return false;
        }
        
        return $this->upvotes()->where('employee_id', $user->employee->id)->exists();
    }  

    public function incrementViews()
    {
        $this->increment('viewer_count');
    }

    public function flag()
    {
        $this->update(['flaged_at' => now()]);
    }

    public function unflag()
    {
        $this->update(['flaged_at' => null]);
    }

    public function toggleFlag()
    {
        if ($this->isFlagged()) {
            $this->unflag();
            return false;
        } else {
            $this->flag();
            return true;
        }
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

    public function scopeTrending($query)
    {
        return $query->withCount([
            'comments as total_comments_count',
            'comments as replies_count' => function ($q) {
                $q->whereNotNull('parent_id');
            },
            'comments as top_level_comments_count' => function ($q) {
                $q->whereNull('parent_id');
            }
        ])
        ->where('flaged_at', null)
        ->where('resolved_at', null)
        ->where('status', 'active')
        ->orderByRaw('
            (upvote_count + total_comments_count + replies_count) / 
            (TIMESTAMPDIFF(HOUR, created_at, NOW()) + 1) DESC
        ')
        ->with('category');
    }

    /**
     * Override the delete method to handle soft deletes for related chats and messages
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($post) {
            // Soft delete related chats
            $post->chats()->each(function ($chat) {
                $chat->delete(); // This will trigger soft delete for chat messages too
            });
        });
    }
}
