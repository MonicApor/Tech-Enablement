<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function posts() : HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function getPostsCountAttribute()
    {
        return $this->posts()->count();
    }

    public function getActivePostsCountAttribute()
    {
        return $this->posts()->active()->count();
    }    
}

