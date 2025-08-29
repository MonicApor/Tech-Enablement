<?php

namespace App\Http\Requests\Post;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:255',
                'min:2',
                Rule::unique('posts')->where(function ($query) {
                    return $query->where('user_id', auth()->user()->id);
                }),
            ],
            'body' => [
                'required',
                'string',
            ],
            'category_id' => [
                'required',
                'exists:categories,id',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The title is required.',
            'title.max' => 'The title must be less than 255 characters.',
            'body.required' => 'The body is required.',
            'body.max' => 'The body must be less than 1000 characters.',
            'body.min' => 'The body must be at least 2 characters.',
            'category_id.required' => 'The category is required.',
            'category_id.exists' => 'The category does not exist.',
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'user_id' => auth()->user()->id,
        ]);
    }
}
