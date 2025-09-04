<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FlagPostStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function flagPosts()
    {
        return $this->hasMany(FlagPosts::class);
    }
}
