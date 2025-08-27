<?php

namespace App\Http\Requests\Token;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VerifyToken extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => [
                'required',
                Rule::in(['activation', 'password-reset'])
            ],
            'token' => 'required|string'
        ];
    }

    public function getToken()
    {
        return $this->input('token');
    }

    public function getType()
    {
        return $this->input('type');
    }
}
