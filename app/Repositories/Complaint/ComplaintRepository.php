<?php

namespace App\Repositories\Complaint;

use App\Models\Complaint;
use App\Models\ComplaintCategory;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use LaravelEasyRepository\Repository;

interface ComplaintRepository extends Repository
{
    public function paginateForUser( User $user, bool $viewAll, int $perPage = 10, ?string $search = null, ?string $status = null): LengthAwarePaginator;

    public function findForUserOrFail(string|int $id,User $user, bool $viewAll): Complaint;

    public function nextTicketNumber(int $year): string;

    public function activeCategories(): Collection;

    public function paginateReport(array $filters, int $perPage = 10): LengthAwarePaginator;

    public function reportRows(array $filters): Collection;
}
