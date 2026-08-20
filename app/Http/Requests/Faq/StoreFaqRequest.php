<?php

namespace App\Http\Requests\Faq;

use Illuminate\Foundation\Http\FormRequest;

class StoreFaqRequest extends FormRequest
{
    protected $fields = ['question', 'answer'];

    public function authorize(): bool
    {
        return $this->user()?->can('Manage FAQ') ?? false;
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
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'question' => __('Question'),
            'answer' => __('Answer'),
            'is_active' => __('Active'),
        ];
    }
}
