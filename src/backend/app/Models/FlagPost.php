<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FlagPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'employee_id',
        'hr_employee_id',
        'reason',
        'status_id',
        'escalated_at',
    ];

    protected $casts = [
        'escalated_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
    
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
    
    public function hrEmployee()
    {
        return $this->belongsTo(Employee::class, 'hr_employee_id');
    }
    
    public function status()
    {
        return $this->belongsTo(FlagPostStatus::class, 'status_id');
    }

    /**
     * Check if the flag has been escalated.
     */
    public function isEscalated(): bool
    {
        return !is_null($this->escalated_at);
    }

    /**
     * Escalate the flag.
     */
    public function escalate(): void
    {
        $this->update(['escalated_at' => now()]);
    }

    /**
     * Scope to get only escalated flags.
     */
    public function scopeEscalated($query)
    {
        return $query->whereNotNull('escalated_at');
    }

    /**
     * Scope to get flags by status.
     */
    public function scopeByStatus($query, $statusId)
    {
        return $query->where('status_id', $statusId);
    }

    /**
     * Scope to get flags by status name.
     */
    public function scopeByStatusName($query, $statusName)
    {
        return $query->whereHas('status', function($q) use ($statusName) {
            $q->where('name', $statusName);
        });
    }

    
}
