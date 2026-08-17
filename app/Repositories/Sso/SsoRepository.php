<?php

namespace App\Repositories\Sso;

use App\Models\User;
use LaravelEasyRepository\Repository;

interface SsoRepository extends Repository
{
    public function findBySimpegUserId(string|int $simpegUserId): ?User;

    public function updateOrCreateBySimpegUserId(string|int $simpegUserId, array $attributes): User;
}
