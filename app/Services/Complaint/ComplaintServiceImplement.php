<?php

namespace App\Services\Complaint;

use App\Enums\ComplaintActions;
use App\Enums\ComplaintStatus;
use App\Models\Complaint;
use App\Models\ComplaintStatusHistory;
use App\Models\User;
use App\Repositories\App\AppRepository;
use App\Repositories\Complaint\ComplaintRepository;
use App\Services\ComplaintWorkflow\ComplaintWorkflowService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use LaravelEasyRepository\ServiceApi;

class ComplaintServiceImplement extends ServiceApi implements ComplaintService
{
    public function __construct(
        protected ComplaintRepository $complaintRepository,
        protected AppRepository $appRepository,
        protected ComplaintWorkflowService $workflowService,
    ) {}

    public function listForUser( User $user, bool $viewAll, int $perPage = 10, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        return $this->complaintRepository->paginateForUser( $user, $viewAll, $perPage, $search, $status);
    }

    public function findForUserOrFail(string|int $id, User $user, bool $viewAll): Complaint
    {
        return $this->complaintRepository->findForUserOrFail($id, $user, $viewAll);
    }

    public function createComplaint(array $data, User $user): Complaint
    {
        $complaint = DB::transaction(function () use ($data, $user): Complaint {
            $status = $data['status'] ?? ComplaintStatus::Submitted->value;
            $status = $status === ComplaintStatus::Submitted->value
                ? ComplaintStatus::Submitted->value
                : ComplaintStatus::Draft->value;
            $complaint = $this->appRepository->insertOneModel(new Complaint(), [
                'ticket_number' => $this->complaintRepository->nextTicketNumber((int) now()->year),
                'category_id' => $data['category_id'],
                'title' => $data['title'],
                'description' => $data['description'],
                'priority' => null,
                'status' => $status,
                'created_by' => $user->getKey(),
                'submitted_at' => $status === ComplaintStatus::Submitted->value ? now() : null,
            ]);

            $reporter = $data['reporter'] ?? [];
            $this->appRepository->insertOneModel($complaint->reporter()->getModel(), [
                'complaint_id' => $complaint->getKey(),
                'name' => $reporter['name'] ?? null,
                'is_anonymous' => (bool) ($reporter['is_anonymous'] ?? false),
            ]);

            foreach ($data['parties'] ?? [] as $party) {
                $this->appRepository->insertOneModel($complaint->parties()->getModel(), [
                    'complaint_id' => $complaint->getKey(),
                    'name' => $party['name'],
                    'position' => $party['position'] ?? null,
                    'position_classification' => $party['position_classification'] ?? null,
                ]);
            }

            foreach ($data['attachments'] ?? [] as $file) {
                $this->appRepository->insertOneModel($complaint->attachments()->getModel(), [
                    'complaint_id' => $complaint->getKey(),
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $file->store("complaints/{$complaint->getKey()}", 'public'),
                    'disk' => 'public',
                    'mime_type' => $file->getClientMimeType(),
                    'file_size' => $file->getSize(),
                    'uploaded_by' => $user->getKey(),
                ]);
            }

            $this->appRepository->insertOneModel(new ComplaintStatusHistory(), [
                'complaint_id' => $complaint->getKey(),
                'from_status' => null,
                'to_status' => $status,
                'action' => $status === ComplaintStatus::Submitted->value
                    ? ComplaintActions::Submit->value
                    : ComplaintActions::SaveDraft->value,
                'note' => null,
                'created_by' => $user->getKey(),
            ]);

            return $complaint->load('category', 'reporter', 'parties', 'attachments');
        });

        if ($complaint->status->value === ComplaintStatus::Submitted->value) {
            $this->workflowService->notify(
                $complaint,
                ComplaintStatus::Draft->value,
                ComplaintStatus::Submitted->value,
            );
        }

        return $complaint;
    }

    public function activeCategories(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->complaintRepository->activeCategories();
    }

    public function paginateReport(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        return $this->complaintRepository->paginateReport($filters, $perPage);
    }

    public function reportRows(array $filters): \Illuminate\Database\Eloquent\Collection
    {
        return $this->complaintRepository->reportRows($filters);
    }
}
