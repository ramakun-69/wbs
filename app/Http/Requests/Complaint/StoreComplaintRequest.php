<?php

namespace App\Http\Requests\Complaint;

use App\Enums\ComplaintStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreComplaintRequest extends FormRequest
{
    protected $fields = [
        'title',
        'description',
    ];

    public function authorize(): bool
    {
        return true;
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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'uuid', 'exists:complaint_categories,id'],
            'title' => ['required', 'string', 'max:500'],
            'description' => ['required', 'string'],
            'status' => ['required', Rule::in([
                ComplaintStatus::Submitted->value,
                ComplaintStatus::Draft->value,
            ])],
            'reporter' => ['required', 'array'],
            'reporter.name' => ['nullable', 'string', 'max:255'],
            'reporter.is_anonymous' => ['boolean'],
            'parties' => ['required', 'array', 'min:1'],
            'parties.*.name' => ['required', 'string', 'max:255'],
            'parties.*.position' => ['nullable', 'string', 'max:255'],
            'parties.*.position_classification' => ['nullable', 'string', 'max:100'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => ['file', 'max:102400'],
            'terms_accepted' => ['boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'category_id' => __('Category'),
            'title' => __('Complaint Title'),
            'description' => __('Complaint Description'),
            'reporter.name' => __('Full Name'),
            'parties.*.name' => __('Party Name'),
            'parties.*.position' => __('Position'),
            'parties.*.position_classification' => __('Position Classification'),
            'attachments.*' => __('Attachment'),
            'terms_accepted' => __('Terms and Conditions'),
        ];
    }
}
