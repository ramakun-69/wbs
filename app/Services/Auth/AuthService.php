<?php

namespace App\Services\Auth;

use App\Models\User;
use LaravelEasyRepository\BaseService;

interface AuthService extends BaseService
{
    public function register(array $data): User;

    public function authenticate(array $data): bool;
}
