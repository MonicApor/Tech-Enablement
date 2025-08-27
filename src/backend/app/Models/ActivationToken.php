<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivationToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'token',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Mark the token as used by setting revoked to true
     */
    public function markAsUsed()
    {
        $this->update(['revoked' => true]);
    }

    /**
     * Check if the token is valid (not revoked)
     */
    public function isValid()
    {
        return !$this->revoked;
    }
}
