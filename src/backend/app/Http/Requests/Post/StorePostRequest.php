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
                    return $query->where('employee_id', auth()->user()->employee->id);
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
            'attachments.*' => [  //rule for each attachment
                'nullable',
                'file',
                'max:5120', // 5MB max
                'mimes:jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt',
            ],
            'attachments' => [
                'nullable',
                'array',
                'max:5', // Max 5 files
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
            'attachments.max' => 'The attachments must be less than 5 files.',
            'attachments.*.max' => 'The attachment must be less than 5MB.',
            'attachments.*.mimes' => 'The attachment must be a valid file type.',
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'employee_id' => auth()->user()->employee->id,
        ]);
    }
}
