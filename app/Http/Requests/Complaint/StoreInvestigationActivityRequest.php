<?php

namespace App\Http\Requests\Complaint;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvestigationActivityRequest extends FormRequest
{
    protected $fields = [
        'activity_date',
        'activity_type',
        'description',
    ];

    public function authorize(): bool
    {
        return $this->user()?->can('Execute Investigation') ?? false;
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
            'activity_date' => ['required', 'date'],
            'activity_type' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'activity_document' => ['nullable', 'file', 'max:102400', 'mimes:pdf,doc,docx,jpg,jpeg,png'],
        ];
    }

    public function attributes(): array
    {
        return [
            'activity_date' => __('Activity Date'),
            'activity_type' => __('Activity Type'),
            'description' => __('Activity Description'),
            'activity_document' => __('Activity Document'),
        ];
    }
}
