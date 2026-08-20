<?php

namespace App\Services\ComplaintWorkflow;

use App\Enums\ComplaintActions;
use App\Enums\ComplaintStatus;
use App\Models\Complaint;
use App\Models\ComplaintStatusHistory;
use App\Models\ComplaintVerification;
use App\Models\ComplaintApproval;
use App\Models\Investigation;
use App\Models\InvestigationRecommendation;
use App\Models\InvestigationReview;
use App\Models\User;
use App\Notifications\ComplaintStatusNotification;
use App\Repositories\App\AppRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;
use LaravelEasyRepository\ServiceApi;

class ComplaintWorkflowServiceImplement extends ServiceApi implements ComplaintWorkflowService
{
    public function __construct(protected AppRepository $appRepository) {}

    public function transition(Complaint $complaint, string $action, User $actor, array $data = []): Complaint
    {
        return DB::transaction(function () use ($complaint, $action, $actor, $data) {
            $from = $complaint->status->value;
            [$to, $actionEnum] = $this->resolveTransition($complaint, $action);

            if ($actionEnum === ComplaintActions::Register && empty($data['priority'])) {
                throw ValidationException::withMessages([
                    'priority' => __('Priority is required when registering a complaint.'),
                ]);
            }

            $this->appRepository->updateOneModel($complaint, [
                'status' => $to,
                'completed_at' => $to === ComplaintStatus::Completed->value ? now() : null,
                'priority' => $actionEnum === ComplaintActions::Register ? ($data['priority'] ?? null) : $complaint->priority,
            ]);

            $this->storeWorkflowRecord($complaint, $to, $actionEnum, $actor, $data);
            $this->storeHistory($complaint, $from, $to, $actionEnum, $actor, $data['note'] ?? null);

            return $complaint->fresh(['category', 'reporter', 'parties', 'statusHistories', 'verification', 'investigation']);
        });
    }

    public function notify(Complaint $complaint, string $from, string $to, ?string $note = null): void
    {
        $recipients = collect([$complaint->creator])
            ->merge($this->recipientsFor($to))
            ->filter(fn (?User $user) => $user?->is_active && filled($user?->email))
            ->unique(fn (User $user) => $user->getKey());

        Notification::send($recipients, new ComplaintStatusNotification($complaint, $from, $to, $note));
    }

    private function resolveTransition(Complaint $complaint, string $action): array
    {
        $status = $complaint->status->value;
        $transitions = [
            ComplaintActions::Register->value => [ComplaintStatus::Submitted->value => [ComplaintStatus::WaitingIrbanVerification->value, ComplaintActions::Register]],
            ComplaintActions::Verify->value => [ComplaintStatus::WaitingIrbanVerification->value => [ComplaintStatus::WaitingSK->value, ComplaintActions::Verify]],
            ComplaintActions::NotVerify->value => [ComplaintStatus::WaitingIrbanVerification->value => [ComplaintStatus::NotVerified->value, ComplaintActions::NotVerify]],
            ComplaintActions::IssueSK->value => [ComplaintStatus::WaitingSK->value => [ComplaintStatus::Investigation->value, ComplaintActions::IssueSK]],
            ComplaintActions::SubmitInvestigation->value => [ComplaintStatus::Investigation->value => [ComplaintStatus::WaitingIrbanReview->value, ComplaintActions::SubmitInvestigation]],
            ComplaintActions::Return->value => [
                ComplaintStatus::WaitingIrbanVerification->value => [ComplaintStatus::NotVerified->value, ComplaintActions::Return],
                ComplaintStatus::WaitingIrbanReview->value => [ComplaintStatus::Investigation->value, ComplaintActions::Return],
                ComplaintStatus::WaitingSecretaryReview->value => [ComplaintStatus::Investigation->value, ComplaintActions::Return],
                ComplaintStatus::WaitingInspectorApproval->value => [ComplaintStatus::WaitingSecretaryReview->value, ComplaintActions::Return],
            ],
            ComplaintActions::Forward->value => [
                ComplaintStatus::WaitingIrbanReview->value => [ComplaintStatus::WaitingSecretaryReview->value, ComplaintActions::Forward],
                ComplaintStatus::WaitingSecretaryReview->value => [ComplaintStatus::WaitingInspectorApproval->value, ComplaintActions::Forward],
            ],
            ComplaintActions::Complete->value => [ComplaintStatus::WaitingInspectorApproval->value => [ComplaintStatus::Completed->value, ComplaintActions::Complete]],
        ];

        $transition = $transitions[$action][$status] ?? null;
        if (!$transition) {
            throw ValidationException::withMessages(['workflow' => "Action {$action} is not valid for status {$status}."]);
        }

        return $transition;
    }

    private function storeWorkflowRecord(Complaint $complaint, string $to, ComplaintActions $action, User $actor, array $data): void
    {
        if (in_array($action, [ComplaintActions::Verify, ComplaintActions::NotVerify], true)) {
            $this->appRepository->updateOrCreateOneModel(new ComplaintVerification(), ['complaint_id' => $complaint->getKey()], [
                'decision' => $data['decision'] ?? ($action === ComplaintActions::Verify ? 'Verified' : 'Not Verified'),
                'summary' => $data['summary'] ?? null,
                'note' => $data['note'] ?? null,
                'verified_by' => $actor->getKey(),
                'verified_at' => now(),
            ]);
        }

        if ($action === ComplaintActions::IssueSK) {
            $skFilePath = $data['sk_file_path'] ?? null;
            if ($data['sk_file'] ?? null) {
                $skFilePath = $data['sk_file']->store('complaints/assignment-letters', 'public');
            }

            $this->appRepository->updateOrCreateOneModel(new Investigation(), ['complaint_id' => $complaint->getKey()], [
                'status' => 'Active',
                'sk_number' => $data['sk_number'] ?? null,
                'sk_date' => $data['sk_date'] ?? null,
                'sk_file_path' => $skFilePath,
                'team_leader_name' => $data['team_leader_name'] ?? null,
                'basis' => $data['basis'] ?? null,
                'created_by' => $actor->getKey(),
            ]);
        }

        if ($action === ComplaintActions::SubmitInvestigation) {
            $this->saveExaminationResult($complaint, $data);
        }

        if (in_array($action, [ComplaintActions::Return, ComplaintActions::Forward, ComplaintActions::Complete], true)) {
            $investigation = $complaint->investigation;
            if ($investigation) {
                $this->appRepository->updateOneModel($investigation, ['status' => $this->investigationStatus($to)]);
                if (in_array($action, [ComplaintActions::Return, ComplaintActions::Forward], true)) {
                    $this->appRepository->insertOneModel(new InvestigationReview(), [
                        'investigation_id' => $investigation->getKey(),
                        'reviewer_role' => $data['reviewer_role'] ?? 'Secretary',
                        'decision' => $action === ComplaintActions::Forward ? 'Forwarded' : 'Returned',
                        'note' => $data['note'] ?? null,
                        'reviewed_by' => $actor->getKey(),
                        'reviewed_at' => now(),
                    ]);
                }

                if ($action === ComplaintActions::Complete) {
                    $this->appRepository->insertOneModel(new ComplaintApproval(), [
                        'complaint_id' => $complaint->getKey(),
                        'stage' => 'Inspector',
                        'decision' => 'Approved',
                        'note' => $data['approval_note'],
                        'decided_by' => $actor->getKey(),
                        'decided_at' => now(),
                    ]);
                }
            }
        }
    }

    public function saveExaminationResult(Complaint $complaint, array $data): void
    {
        $investigation = $complaint->investigation;
        if (!$investigation) {
            throw ValidationException::withMessages(['investigation' => __('Investigation has not been created yet.')]);
        }

        $updates = [
            'handling_type' => $data['handling_type'] ?? $investigation->handling_type,
            'target_completion_date' => $data['target_completion_date'] ?? $investigation->target_completion_date,
            'conclusion' => $data['conclusion'] ?? $investigation->conclusion,
            'conclusion_category' => $data['conclusion_category'] ?? $investigation->conclusion_category,
            'recommendation' => $data['recommendation'] ?? $investigation->recommendation,
            'reporter_report' => $data['reporter_report'] ?? $investigation->reporter_report,
        ];

        foreach (['review_document' => 'review_document_path', 'implementation_document' => 'implementation_document_path', 'recommendation_document' => 'recommendation_document_path'] as $input => $column) {
            if (($data[$input] ?? null) !== null) {
                $updates[$column] = $data[$input]->store('complaints/examination', 'public');
            }
        }

        $this->appRepository->updateOneModel($investigation, $updates);

        if (array_key_exists('recommendations', $data)) {
            foreach (collect($data['recommendations'] ?? []) as $recommendation) {
                $model = !empty($recommendation['id']) ? $investigation->recommendations()->firstWhere('id', $recommendation['id']) : null;
                $values = [
                    'recommendation_type' => $recommendation['recommendation_type'],
                    'description' => $recommendation['description'] ?? null,
                    'created_by' => Auth::id(),
                ];

                if ($file = $recommendation['document'] ?? null) {
                    $values['file_name'] = $file->getClientOriginalName();
                    $values['file_path'] = $file->store('complaints/recommendations', 'public');
                    $values['mime_type'] = $file->getClientMimeType();
                    $values['file_size'] = $file->getSize();
                    $values['disk'] = 'public';
                }

                if ($model) {
                    $this->appRepository->updateOneModel($model, $values);
                } else {
                    $this->appRepository->insertOneModel(new InvestigationRecommendation(), [...$values, 'investigation_id' => $investigation->getKey()]);
                }
            }
        }
    }

    private function storeHistory(Complaint $complaint, string $from, string $to, ComplaintActions $action, User $actor, ?string $note): void
    {
        $this->appRepository->insertOneModel(new ComplaintStatusHistory(), [
            'complaint_id' => $complaint->getKey(),
            'from_status' => $from,
            'to_status' => $to,
            'action' => $action->value,
            'note' => $note,
            'created_by' => $actor->getKey(),
        ]);
    }

    private function investigationStatus(string $status): string
    {
        return match ($status) {
            ComplaintStatus::WaitingIrbanReview->value => 'Waiting Irban Review',
            ComplaintStatus::WaitingSecretaryReview->value => 'Waiting Secretary Review',
            ComplaintStatus::Investigation->value => 'Returned To Team',
            ComplaintStatus::WaitingInspectorApproval->value => 'Waiting Inspector Approval',
            ComplaintStatus::Completed->value => 'Completed',
            default => 'Active',
        };
    }

    private function recipientsFor(string $status)
    {
        $permission = match ($status) {
            ComplaintStatus::Submitted->value => 'Register Complaint',
            ComplaintStatus::WaitingIrbanVerification->value => 'Verify Complaint',
            ComplaintStatus::WaitingSK->value => 'Create Investigation',
            ComplaintStatus::Investigation->value => 'Execute Investigation',
            ComplaintStatus::WaitingIrbanReview->value => 'Forward Investigation',
            ComplaintStatus::WaitingSecretaryReview->value => 'Review Investigation',
            ComplaintStatus::WaitingInspectorApproval->value => 'Approve Recommendation',
            default => null,
        };

        return $permission ? User::permission($permission)->get() : collect();
    }
}
