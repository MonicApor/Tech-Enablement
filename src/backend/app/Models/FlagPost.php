<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

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
     * get the escalated post.
     */
    public function escalatedPost(): HasOne
    {
        return $this->hasOne(EscalatedPost::class);
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

    /**
     * check if the flag post needs to be escalated
     */
    public function needsEscalation() : bool
    {
        //if escalated no need
        if ($this->escalated_at) {
            return false;
        }
        //if status is escalated no need
        if ($this->status_id == 3) {
            return false;
        }
        //if status is != open no need
        if ($this->status_id != 1) {
            return false;
        }
        
        if($this->hr_employee_id) {
            return false;
        }
        
        if($this->getDaysSinceCreation() >= 6) {
            return true;
        }
        return false;
    }

    public function needsEmailReminder() : bool
    {

        if($this->status_id == 3) {
            return false;
        }
        
        if($this->escalated_at) {
            return false;
        }
        
        if($this->status_id != 1) {
            return false;
        }

        if($this->hr_employee_id) {
            return false;
        }
        
        if($this->getDaysSinceCreation() >= 3) {
            return true;
        }
        return false;
    }

    public function getDaysSinceCreation() : int
    {
        return $this->created_at->diffInDays(now());
    }

    
}
