<?php

namespace App\Repositories\Complaint;

use App\Models\Complaint;
use App\Models\ComplaintCategory;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use LaravelEasyRepository\Implementations\Eloquent;

class ComplaintRepositoryImplement extends Eloquent implements ComplaintRepository
{
    protected Complaint $model;

    public function __construct(Complaint $model)
    {
        $this->model = $model;
    }

    public function paginateForUser( User $user, bool $viewAll, int $perPage = 10, ?string $search = null, ?string $status = null,): LengthAwarePaginator 
    {
        return $this->model
            ->with('category')
            ->when(! $viewAll, fn ($query) => $query->where('created_by', $user->getKey()))
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('ticket_number', 'like', "%{$search}%");
                });
            })
            ->when($status, fn ($query) => $query->where('status', $status))
            ->latest()
            ->paginate($perPage);
    }

    public function findForUserOrFail( string|int $id, User $user, bool $viewAll): Complaint {
        return $this->model
            ->with([
                'category',
                'reporter',
                'parties',
                'attachments',
                'statusHistories' => fn ($query) => $query
                    ->with('changedBy')
                    ->orderBy('created_at'),
                'approvals.decider',
                'verification.verifier',
                'investigation.activities.attachments',
                'investigation.recommendations',
                'investigation.reviews',
            ])
            ->when(! $viewAll, fn ($query) => $query->where('created_by', $user->getKey()))
            ->findOrFail($id);
    }

    public function nextTicketNumber(int $year): string
    {
        $prefix = "WBS-{$year}-";
        $lastTicket = $this->model
            ->where('ticket_number', 'like', "{$prefix}%")
            ->orderByDesc('ticket_number')
            ->value('ticket_number');

        $sequence = $lastTicket
            ? ((int) str($lastTicket)->afterLast('-')) + 1
            : 1;

        return $prefix . str_pad((string) $sequence, 4, '0', STR_PAD_LEFT);
    }

    public function activeCategories(): Collection
    {
        return ComplaintCategory::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'code', 'name']);
    }

    public function paginateReport(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        return $this->reportQuery($filters)
            ->latest('submitted_at')
            ->latest('created_at')
            ->paginate($perPage);
    }

    public function reportRows(array $filters): Collection
    {
        return $this->reportQuery($filters)
            ->latest('submitted_at')
            ->latest('created_at')
            ->get();
    }

    private function reportQuery(array $filters)
    {
        return $this->model
            ->with(['category', 'reporter'])
            ->when($filters['period_from'] ?? null, fn ($query, $date) =>
                $query->whereDate('submitted_at', '>=', $date))
            ->when($filters['period_to'] ?? null, fn ($query, $date) =>
                $query->whereDate('submitted_at', '<=', $date))
            ->when($filters['ticket_number'] ?? null, fn ($query, $ticket) =>
                $query->where('ticket_number', 'like', "%{$ticket}%"))
            ->when($filters['category_id'] ?? null, fn ($query, $categoryId) =>
                $query->where('category_id', $categoryId))
            ->when($filters['status'] ?? null, fn ($query, $status) =>
                $query->where('status', $status));
    }
}
