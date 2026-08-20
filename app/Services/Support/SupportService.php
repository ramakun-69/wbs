<?php

namespace App\Services\Support;

use App\Models\SupportTicket;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use LaravelEasyRepository\BaseService;

interface SupportService extends BaseService
{
    public function paginateForUser(User $user, bool $viewAll, int $perPage = 10, ?string $search = null, ?string $status = null): LengthAwarePaginator;
    public function findForUserOrFail(string $id, User $user, bool $viewAll): SupportTicket;
    public function createTicket(array $data, User $user): SupportTicket;
    public function reply(SupportTicket $ticket, array $data, User $user): SupportTicket;
    public function close(SupportTicket $ticket): SupportTicket;

    public function updateStatus(SupportTicket $ticket, string $status): SupportTicket;
}
