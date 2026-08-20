<?php

namespace App\Http\Requests\Support;

use Illuminate\Foundation\Http\FormRequest;

class ReplySupportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('Manage Support') || $this->user()?->can('Create Support');
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('message') && is_string($this->input('message'))) {
            $this->merge(['message' => trim($this->input('message'))]);
        }
    }

    public function rules(): array
    {
        return [
            'message' => ['required', 'string'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => ['file', 'max:102400'],
        ];
    }

    public function attributes(): array
    {
        return [
            'message' => __('Support Message'),
            'attachments.*' => __('Attachment'),
        ];
    }
}
