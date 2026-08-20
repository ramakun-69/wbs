<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRolesRequest extends FormRequest
{
    protected $fields = ['roles'];

    public function authorize(): bool
    {
        return $this->user()?->can('Manage Users') ?? false;
    }

    protected function prepareForValidation(): void
    {
        $roles = collect($this->input('roles', []))
            ->map(fn ($role) => is_string($role) ? trim($role) : $role)
            ->filter()
            ->values()
            ->all();

        $this->merge(['roles' => $roles]);
    }

    public function rules(): array
    {
        return [
            'roles' => ['present', 'array'],
            'roles.*' => [
                'string',
                Rule::exists('roles', 'name')->where('guard_name', 'web'),
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'roles' => __('Roles'),
            'roles.*' => __('Role'),
        ];
    }
}
