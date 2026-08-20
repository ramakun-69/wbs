<?php

namespace App\Repositories\Support;

use App\Models\SupportTicket;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use LaravelEasyRepository\Implementations\Eloquent;

class SupportRepositoryImplement extends Eloquent implements SupportRepository
{
    protected SupportTicket $model;

    public function __construct(SupportTicket $model)
    {
        $this->model = $model;
    }

    public function paginateForUser(User $user, bool $viewAll, int $perPage = 10, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        return $this->model
            ->with('creator')
            ->when(! $viewAll, fn ($query) => $query->where('created_by', $user->getKey()))
            ->when($search, fn ($query) => $query->where(function ($query) use ($search) {
                $query->where('ticket_number', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            }))
            ->when($status, fn ($query) => $query->where('status', $status))
            ->latest('last_replied_at')
            ->paginate($perPage);
    }

    public function findForUserOrFail(string $id, User $user, bool $viewAll): SupportTicket
    {
        return $this->model
            ->with(['creator', 'messages.user', 'attachments'])
            ->when(! $viewAll, fn ($query) => $query->where('created_by', $user->getKey()))
            ->findOrFail($id);
    }

    public function nextTicketNumber(int $year): string
    {
        $prefix = "SUP-{$year}-";
        $lastNumber = $this->model->where('ticket_number', 'like', "{$prefix}%")
            ->orderByDesc('ticket_number')
            ->value('ticket_number');

        $sequence = $lastNumber ? ((int) substr($lastNumber, -4)) + 1 : 1;

        return $prefix . str_pad((string) $sequence, 4, '0', STR_PAD_LEFT);
    }
}
