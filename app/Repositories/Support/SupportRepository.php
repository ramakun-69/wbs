<?php

namespace App\Repositories\Support;

use App\Models\SupportTicket;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use LaravelEasyRepository\Repository;

interface SupportRepository extends Repository
{
    public function paginateForUser(User $user, bool $viewAll, int $perPage = 10, ?string $search = null, ?string $status = null): LengthAwarePaginator;
    public function findForUserOrFail(string $id, User $user, bool $viewAll): SupportTicket;
    public function nextTicketNumber(int $year): string;
}
