<?php

namespace App\Repositories\User;

use App\Models\User;
use LaravelEasyRepository\Repository;

interface UserRepository extends Repository
{
    public function findBySimpegUserId(string|int $simpegUserId): ?User;

    public function updateOrCreateBySimpegUserId( string|int $simpegUserId, array $attributes): User;
}
