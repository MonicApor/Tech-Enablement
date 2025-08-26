<?php

namespace App\Http\Requests\Comment;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCommentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $comment = $this->route('comment');
        return auth()->check() && auth()->user()->id === $comment->user_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'body' => 'sometimes|required|string|min:10|max:1000',
            'parent_id' => 'sometimes|nullable|exists:comments,id',
        ];
    }

    public function messages(): array
    {
        return [
            'body.required' => 'The body is required.',
            'body.max' => 'The body must be less than 1000 characters.',
            'parent_id.exists' => 'The selected parent comment is invalid.',
        ];
    }
}
