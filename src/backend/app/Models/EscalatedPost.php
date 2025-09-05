<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\FlagPostStatus;

class EscalatedPost extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'flag_post_id',
        'status_id',
        'escalated_by_system',
        'escalation_reason',
        'management_notes',
        'resolved_at',
    ];

    protected $casts = [
        'escalated_by_system' => 'boolean',
        'resolved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function flagPost(): BelongsTo
    {
        return $this->belongsTo(FlagPost::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(FlagPostStatus::class, 'status_id');
    }

    public function isResolved(): bool
    {
        return $this->status_id == 3;
    }
    
}
