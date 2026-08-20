<?php

namespace App\Http\Requests\Support;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupportRequest extends FormRequest
{
    protected $fields = ['subject', 'message'];

    public function authorize(): bool
    {
        $user = $this->user();

        return $user
            && $user->can('Create Support')
            && ! $user->can('Manage Support');
    }

    protected function prepareForValidation(): void
    {
        $trimmed = [];
        foreach ($this->fields as $field) {
            if ($this->has($field) && is_string($this->input($field))) {
                $trimmed[$field] = trim($this->input($field));
            }
        }
        $this->merge($trimmed);
    }

    public function rules(): array
    {
        return [
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => ['file', 'max:102400'],
        ];
    }

    public function attributes(): array
    {
        return [
            'subject' => __('Support Subject'),
            'message' => __('Support Message'),
            'attachments.*' => __('Attachment'),
        ];
    }
}
