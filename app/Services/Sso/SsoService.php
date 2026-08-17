<?php

namespace App\Services\Sso;

use App\Models\User;
use LaravelEasyRepository\BaseService;

interface SsoService extends BaseService
{
    public function provisionUser(array $identity): User;
}
