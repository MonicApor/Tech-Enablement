<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class Password implements Rule
{
    /**
     * Rules
     *  - 8 Characters
     *  - 1 Uppercase
     *  - 1 Special Character
     *
     * @var string
     */
    private static $RULES = '/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/';

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     */
    public function passes($attribute, $value): bool
    {
        return (bool) preg_match(self::$RULES, $value);
    }

    /**
     * Get the validation error message.
     */
    public function message(): string
    {
        return 'Password must contain the following: 1 uppercase, 1 special character and a minimum of 8 characters.';
    }
}
