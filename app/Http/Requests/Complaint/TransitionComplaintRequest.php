<?php

namespace App\Http\Requests\Complaint;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TransitionComplaintRequest extends FormRequest
{
    protected $fields = [
        'note',
        'priority',
        'summary',
        'decision',
        'reviewer_role',
        'sk_number',
        'sk_date',
        'sk_file_path',
        'sk_file',
        'team_leader_name',
        'basis',
        'handling_type',
        'target_completion_date',
        'findings',
        'conclusion',
        'violation_element',
        'recommendation',
        'result_status',
        'review_document',
        'implementation_document',
        'conclusion_category',
        'recommendation_document',
        'reporter_report',
        'recommendations',
        'approval_note',
    ];

    public function authorize(): bool
    {
        return true;
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
        $rules = [
            'note' => ['nullable', 'string'],
            'priority' => ['nullable', Rule::in(['High', 'Medium', 'Low'])],
            'summary' => ['nullable', 'string'],
            'decision' => ['nullable', 'string', 'max:100'],
            'reviewer_role' => ['nullable', 'string', 'max:100'],
            'sk_number' => ['nullable', 'string', 'max:255'],
            'sk_date' => ['nullable', 'date'],
            'sk_file' => [
                'nullable',
                'file',
                'max:102400',
                'mimes:pdf,doc,docx,jpg,jpeg,png',
            ],
            'team_leader_name' => ['nullable', 'string', 'max:255'],
            'basis' => ['nullable', 'string'],
            'handling_type' => ['nullable', 'string', 'max:100'],
            'target_completion_date' => ['nullable', 'date'],
            'findings' => ['nullable', 'string'],
            'conclusion' => ['nullable', 'string'],
            'violation_element' => ['nullable', 'string'],
            'recommendation' => ['nullable', 'string'],
            'result_status' => ['nullable', 'string', 'max:100'],
            'conclusion_category' => ['nullable', Rule::in(['Administrative', 'Disciplinary Violation', 'Overpayment', 'Code of Ethics Violation'])],
            'recommendation_document' => ['nullable', 'file', 'max:102400', 'mimes:pdf,doc,docx,jpg,jpeg,png'],
            'recommendations' => ['nullable', 'array'],
            'recommendations.*.id' => ['nullable', 'uuid'],
            'recommendations.*.recommendation_type' => ['required', 'string', 'max:255'],
            'recommendations.*.description' => ['nullable', 'string'],
            'recommendations.*.document' => ['nullable', 'file', 'max:102400', 'mimes:pdf,doc,docx,jpg,jpeg,png'],
            'approval_note' => ['nullable', 'string'],
        ];

        if ($this->routeIs('dashboard.complaints.investigation.plan.save')) {
            $rules['handling_type'] = ['required', 'string', 'max:100'];
            $rules['target_completion_date'] = ['required', 'date'];
        }

        if ($this->routeIs('dashboard.complaints.investigation.result.save')
            || $this->routeIs('dashboard.complaints.investigation.submit')) {
            $rules['conclusion'] = ['required', 'string'];
            $rules['conclusion_category'] = ['required', Rule::in(['Administrative', 'Disciplinary Violation', 'Overpayment', 'Code of Ethics Violation'])];
            $rules['reporter_report'] = ['required', 'string'];
            $rules['recommendations'] = ['required', 'array', 'min:1'];
        }

        if ($this->routeIs('dashboard.complaints.investigation.return-team')
            || $this->routeIs('dashboard.complaints.review.return')
            || $this->routeIs('dashboard.complaints.approval.return')) {
            $rules['note'] = ['required', 'string', 'min:3'];
        }

        if ($this->routeIs('dashboard.complaints.approval.approve')) {
            $rules['approval_note'] = ['required', 'string'];
        }

        return $rules;
    }

    public function attributes(): array
    {
        return [
            'note' => __('Note'),
            'priority' => __('Priority'),
            'summary' => __('Analysis Summary'),
            'decision' => __('Decision'),
            'reviewer_role' => __('Reviewer Role'),
            'sk_number' => __('Assignment Letter Number'),
            'sk_date' => __('Assignment Letter Date'),
            'sk_file' => __('Assignment Letter File'),
            'team_leader_name' => __('Team Leader'),
            'basis' => __('Legal Basis'),
            'handling_type' => __('Handling Type'),
            'target_completion_date' => __('Target Completion Date'),
            'findings' => __('Findings'),
            'conclusion' => __('Conclusion'),
            'violation_element' => __('Violation Elements'),
            'recommendation' => __('Recommendation'),
            'result_status' => __('Result Status'),
            'review_document' => __('Review Document'),
            'implementation_document' => __('Implementation Document'),
            'conclusion_category' => __('Conclusion Category'),
            'recommendation_document' => __('Recommendation Document'),
            'approval_note' => __('Inspector Approval'),
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($this->routeIs('dashboard.complaints.approval.approve')) {
                if (trim(strip_tags((string) $this->input('approval_note'))) === '') {
                    $validator->errors()->add('approval_note', __('The :attribute field is required.', [
                        'attribute' => $this->attributes()['approval_note'],
                    ]));
                }

                return;
            }

            if (! $this->routeIs('dashboard.complaints.investigation.result.save')
                && ! $this->routeIs('dashboard.complaints.investigation.submit')) {
                if ($this->routeIs('dashboard.complaints.investigation.return-team')
                    || $this->routeIs('dashboard.complaints.review.return')
                    || $this->routeIs('dashboard.complaints.approval.return')) {
                    if (trim(strip_tags((string) $this->input('note'))) === '') {
                        $validator->errors()->add('note', __('The :attribute field is required.', [
                            'attribute' => $this->attributes()['note'],
                        ]));
                    }
                }

                return;
            }

            foreach (['conclusion', 'reporter_report'] as $field) {
                if (trim(strip_tags((string) $this->input($field))) === '') {
                    $validator->errors()->add($field, __('The :attribute field is required.', [
                        'attribute' => $this->attributes()[$field] ?? $field,
                    ]));
                }
            }
        });
    }
}
