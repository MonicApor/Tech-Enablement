<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'middle_name',
        'name',
        'email',
        'username',
        'microsoft_id',
        'avatar',
        'email_verified_at',
        'microsoft_tenant_id',
        'user_type',
        'role',
        'position',
        'immediate_supervisor',
        'hire_date',
        'password',
        'password_confirmation',
        'login_attempts',
        'user_status_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'hire_date' => 'date',
    ];

    /**
     * Generate a unique anonymous username
     */
    public static function generateAnonymousUsername(): string
    {
        $adjectives = [
            'Anonymous', 'Quiet', 'Silent', 'Hidden', 'Secret', 'Mystery', 'Shadow', 'Phantom',
            'Invisible', 'Unknown', 'Nameless', 'Faceless', 'Masked', 'Veiled', 'Covert',
            'Private', 'Discreet', 'Incognito', 'Undercover', 'Ghostly', 'Stealth', 'Whisper'
        ];
        
        $nouns = [
            'Employee', 'Worker', 'Staff', 'Member', 'Person', 'Individual', 'User', 'Voice',
            'Contributor', 'Participant', 'Colleague', 'Professional', 'Associate', 'Team',
            'Source', 'Reporter', 'Witness', 'Observer', 'Insider', 'Agent', 'Contact'
        ];

        do {
            $adjective = $adjectives[array_rand($adjectives)];
            $noun = $nouns[array_rand($nouns)];
            $number = random_int(1000, 9999);
            $username = $adjective . $noun . $number;
        } while (self::where('username', $username)->exists());

        return $username;
    }

    /**
     * Get the user status that owns the user.
     */
    public function userStatus()
    {
        return $this->belongsTo(UserStatus::class, 'user_status_id');
    }

    /**
     * Get the activation tokens for the user.
     */
    public function activationTokens()
    {
        return $this->hasMany(ActivationToken::class);
    }

    /**
     * Get the latest activation token for the user.
     */
    public function activationToken()
    {
        return $this->hasOne(ActivationToken::class)->latest();
    }

    /**
     * Get the chats where this user is a participant.
     */
    public function chats()
    {
        return Chat::where('employee_user_id', $this->id)
                    ->orWhere('hr_user_id', $this->id);
    }

    /**
     * Boot the model and set up event listeners
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (empty($user->username)) {
                $user->username = self::generateAnonymousUsername();
            }
        });
    }
}
