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
                    return $query->where('employee_id', auth()->user()->employee->id);
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
            'attachments.*' => [
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
            'remove_attachments' => [
                'nullable',
                'array',
            ],
            'remove_attachments.*' => [
                'integer',
                'exists:post_attachments,id',
            ],
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
            'attachments.max' => 'The attachments must be less than 5 files.',
            'attachments.*.max' => 'The attachment must be less than 5MB.',
            'attachments.*.mimes' => 'The attachment must be a valid file type.',
            'remove_attachments.*.exists' => 'The attachment to remove does not exist.',
        ];
    }
}
