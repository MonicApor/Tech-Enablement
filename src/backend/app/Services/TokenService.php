<?php

namespace App\Services;

use App\Models\ActivationToken;
use App\Models\User;
use App\Models\PasswordResetToken;
use Exception;

class TokenService
{
    protected $activationToken;
    protected $passwordResetToken;

    public function __construct(ActivationToken $activationToken, PasswordResetToken $passwordResetToken)
    {
        $this->activationToken = $activationToken;
        $this->passwordResetToken = $passwordResetToken;
    }

    /**
     * Verify an activation token
     *
     * @param array $data
     * @return array
     * @throws Exception
     */
    public function verifyToken(array $data): array
    {
        if(!array_key_exists('token', $data)) {
            throw new Exception('Token is required');
        }

        if(!array_key_exists('type', $data)) {
            throw new Exception('Type is required');
        }

        if(!in_array($data['type'], ['activation', 'password_reset'])) {
            throw new Exception('Invalid token type');
        }

        $models = [
            'activation' => $this->activationToken,
            'password_reset' => $this->passwordResetToken
        ];

        $token = $models[$data['type']]->where('token', $data['token'])->first();
        
        if (!$token) {
            throw new Exception('Invalid or expired token');
        }

        if ($data['type'] === 'activation' && $token->revoked) {
            throw new Exception('Token has already been used');
        }

        return [
            'valid' => true,
            'token' => $token,
            'user' => $token->user
        ];
    }
}
