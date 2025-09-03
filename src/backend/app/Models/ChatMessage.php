<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatMessage extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'chat_id',
        'sender_id',
        'content',
        'message_type',
        'read_at',
        'is_deleted',
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    
    public function chat(): BelongsTo
    {
        return $this->belongsTo(Chat::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'sender_id');
    }

    public function isRead(): bool
    {
        return $this->read_at !== null;
    }

    public function markAsRead(): void
    {
        $this->update(['read_at' => now()]);
    }

    public function isFromHR(): bool
    {
        return $this->sender_id === $this->chat->hr_employee_id;
    }

    public function isFromEmployee(): bool
    {
        return $this->sender_id === $this->chat->employee_employee_id;
    }

    public function getSenderName(): string
    {
        if ($this->isFromHR()) {
            return $this->sender->name ?? 'HR Manager';
        }
        return 'Anonymous Employee';
    }

    public function getSenderAvatar(): string
    {
        if ($this->isFromHR()) {
            return 'HR';
        }
        return 'AE';
    }

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeForChat($query, int $chatId)
    {
        return $query->where('chat_id', $chatId);
    }

    public function scopeNotDeleted($query)
    {
        return $query->where('is_deleted', false);
    }

    public function getSenderDisplayName(): string
    {
        if ($this->isFromHR()) {
            return $this->sender->name ?? 'HR Manager';
        }
        return 'Anonymous Employee';
    }

    protected static function booted()
    {
        static::created(function ($message) {
            $message->chat->updateLastMessage($message);
        });
    }
}
