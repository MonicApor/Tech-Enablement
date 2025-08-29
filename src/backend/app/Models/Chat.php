<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Chat extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'post_id',
        'hr_user_id',
        'employee_user_id',
        'status',
        'last_message_id',
        'last_message_at',
    ];
    
    protected $casts = [
        'last_message_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function employeeUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employee_user_id');
    }

    public function hrUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'hr_user_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function lastMessage(): BelongsTo
    {
        return $this->belongsTo(ChatMessage::class, 'last_message_id');
    }

    public function getUnreadMessagesCount(int $userId): int
    {
        return $this->messages()
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->count();
    }

    public function markAsRead(int $userId): void
    {
        $this->messages()
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    public function isParticipant(int $userId): bool
    {
        return $this->employee_user_id == $userId || $this->hr_user_id == $userId;
    }

    public function getOtherParticipant(int $userId): ?User
    {
        return $this->employee_user_id == $userId ? $this->hrUser : $this->employeeUser;
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where(function ($query) use ($userId) {
            $query->where('hr_user_id', $userId)
                  ->orWhere('employee_user_id', $userId);
        });
    }

    /**
     * Check if chat is active
     * Example: $chat->isActive() returns true/false
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if chat is closed
     * Example: $chat->isClosed() returns true/false
     */
    public function isClosed(): bool
    {
        return $this->status === 'closed';
    }

    /**
     * Check if chat is archived
     * Example: $chat->isArchived() returns true/false
     */
    public function isArchived(): bool
    {
        return $this->status === 'archived';
    }

    public function updateLastMessage(ChatMessage $message): void
    {
        $this->update([
            'last_message_id' => $message->id,
            'last_message_at' => $message->created_at,
        ]);
    }

    /**
     * Override the delete method to handle soft deletes for related messages
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($chat) {
            // Soft delete related messages
            $chat->messages()->each(function ($message) {
                $message->delete();
            });
        });
    }
    
}
