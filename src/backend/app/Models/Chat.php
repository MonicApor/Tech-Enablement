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
        'hr_employee_id',
        'employee_employee_id',
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
        return $this->belongsTo(Employee::class, 'employee_employee_id');
    }

    public function hrUser(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'hr_employee_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function lastMessage(): BelongsTo
    {
        return $this->belongsTo(ChatMessage::class, 'last_message_id');
    }

    public function getUnreadMessagesCount(int $employeeId): int
    {
        return $this->messages()
            ->where('sender_id', '!=', $employeeId)
            ->whereNull('read_at')
            ->count();
    }

    public function markAsRead(int $employeeId): void
    {
        $this->messages()
            ->where('sender_id', '!=', $employeeId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    public function isParticipant(int $employeeId): bool
    {
        return $this->employee_employee_id == $employeeId || $this->hr_employee_id == $employeeId;
    }

    public function getOtherParticipant(int $employeeId): ?Employee
    {
        return $this->employee_employee_id == $employeeId ? $this->hrUser : $this->employeeUser;
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForUser($query, int $employeeId)
    {
        return $query->where(function ($query) use ($employeeId) {
            $query->where('hr_employee_id', $employeeId)
                  ->orWhere('employee_employee_id', $employeeId);
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
