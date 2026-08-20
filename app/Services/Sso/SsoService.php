<?php

namespace App\Services\Sso;

use App\Models\User;
use LaravelEasyRepository\BaseService;

interface SsoService extends BaseService
{
    public function hasApplicationAccess(array $identity, string $applicationCode,): bool;
    public function provisionUser(array $identity): User;
    public function searchUsers(string $search): array;
    public function registerUser(array $data): User;
    public function grantApplicationAccess(string $simpegUserId, bool $isAdmin = false,): void;
}
