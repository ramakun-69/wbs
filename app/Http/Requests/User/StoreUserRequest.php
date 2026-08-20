<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    protected $fields = ['simpeg_user_id','username','email','name'];
    public function authorize(): bool
    {
        return $this->user()?->can('Manage Users') ?? false;
    }

    protected function prepareForValidation(): void
    {
        $trimmed = [];

        foreach ($this->fields as $field) {
            if ($this->has($field)) {
                $trimmed[$field] = is_string($this->input($field))
                    ? trim($this->input($field))
                    : $this->input($field);
            }
        }

        $this->merge($trimmed);
    }

    public function rules(): array
    {
        return [
            'simpeg_user_id' => ['required', 'string', 'max:255', Rule::unique('users', 'simpeg_user_id')],
            'username' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email:rfc', 'max:255', Rule::unique('users', 'email')],
        ];
    }
}
