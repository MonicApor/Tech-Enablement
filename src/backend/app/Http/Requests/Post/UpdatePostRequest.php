<?php

namespace App\Http\Requests\Post;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
                 'title' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('posts', 'title')->ignore($this->route('post')->id)->where(function ($query) {
                    return $query->where('user_id', auth()->id());
                }),
            ],

            'body' => [
                'sometimes',
                'required',
                'string',
                'min:10',
                'max:1000',
            ],
            'category_id' => 'sometimes|required|exists:categories,id',
            'status' => 'sometimes|in:active,flagged,resolved',
        ];
    }

    public function messages(): array
    {
        return [
            'title.max' => 'The title must be less than 255 characters.',
            'body.min' => 'The body must be at least 10 characters.',
            'body.max' => 'The body must be less than 1000 characters.',
            'category_id.required' => 'The category is required.',
            'category_id.exists' => 'The selected category is invalid.',
            'status.in' => 'The status must be active, flagged, or resolved.',
        ];
    }
}
