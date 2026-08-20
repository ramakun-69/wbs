<?php

namespace App\Http\Requests\Support;

use App\Enums\SupportStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSupportStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('Manage Support') ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(SupportStatus::class)],
        ];
    }

    public function attributes(): array
    {
        return [
            'status' => __('Support Status'),
        ];
    }
}
