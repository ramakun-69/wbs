<?php

namespace App\Http\Requests\Article;

use Illuminate\Foundation\Http\FormRequest;

class StoreArticleRequest extends FormRequest
{
    protected $fields = ['title', 'excerpt', 'content'];

    public function authorize(): bool
    {
        return $this->user()?->can('Manage Content') ?? false;
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
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'content' => ['required', 'string'],
            'cover_image' => ['nullable', 'image', 'max:5120'],
            'is_published' => ['boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => __('Article Title'),
            'excerpt' => __('Excerpt'),
            'content' => __('Article Content'),
            'cover_image' => __('Cover Image'),
            'is_published' => __('Published'),
        ];
    }
}
