<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Exception;
use Illuminate\Support\Facades\DB;
use App\Exceptions\UserNotCreatedException; 
use Illuminate\Support\Facades\Mail;
use App\Mail\InviteUserMail;
use App\Mail\UserSignUpMail;
use App\Models\ActivationToken;

class UserService
{
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Create a new user
     *
     * @param array $data
     * @return User
     * @throws Exception
     */
    public function createUser(array $data): User
    {
        DB::beginTransaction();
        try {
            $existingUser = $this->user->where('email', $data['email'])->first();
            if (!$existingUser) {
                throw new Exception('User not found');
            }

            if ($existingUser->password) {
                throw new Exception('User already has a password');
            }

            $user = $existingUser;

            if(!($user instanceof User)) {
                throw new UserNotCreatedException();
            }

            $token = Hash::make(time() . uniqid());
            $activationToken = new ActivationToken([
                'token' => $token,
            ]);
            $user->activationTokens()->save($activationToken);

            $template = ('signup' === $data['type']) ? UserSignUpMail::class : InviteUserMail::class;
            Mail::to($user)->send(new $template($user, $token));
            
            DB::commit();
            return $user;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception('Failed to create user: ' . $e->getMessage());
        }
    }

    /**
     * Update existing user with password for traditional login
     *
     * @param User $user
     * @param string $password
     * @return User
     * @throws Exception
     */
    public function updateUserWithPassword(User $user, string $password): User
    {
        try {
            $user->update([
                'password' => Hash::make($password),
            ]);

            return $user;
        } catch (Exception $e) {
            throw new Exception('Failed to update user password: ' . $e->getMessage());
        }
    }

    /**
     * Find user by email
     *
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    /**
     * Check if user exists by email
     *
     * @param string $email
     * @return bool
     */
    public function userExists(string $email): bool
    {
        return User::where('email', $email)->exists();
    }

    /**
     * Update user login attempts
     *
     * @param User $user
     * @param int $attempts
     * @return User
     */
    public function updateLoginAttempts(User $user, int $attempts): User
    {
        $user->update(['login_attempts' => $attempts]);
        return $user;
    }

    /**
     * Reset user login attempts
     *
     * @param User $user
     * @return User
     */
    public function resetLoginAttempts(User $user): User
    {
        return $this->updateLoginAttempts($user, 0);
    }

    /**
     * Increment user login attempts
     *
     * @param User $user
     * @return User
     */
    public function incrementLoginAttempts(User $user): User
    {
        $currentAttempts = $user->login_attempts ?? 0;
        return $this->updateLoginAttempts($user, $currentAttempts + 1);
    }
}
