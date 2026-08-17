<?php

namespace App\Services\Sso;

use App\Models\Role;
use App\Models\User;
use App\Repositories\Sso\SsoRepository;
use Illuminate\Support\Str;
use LaravelEasyRepository\ServiceApi;

class SsoServiceImplement extends ServiceApi implements SsoService
{
    protected SsoRepository $mainRepository;

    public function __construct(SsoRepository $mainRepository)
    {
        $this->mainRepository = $mainRepository;
    }

    public function provisionUser(array $identity): User
    {
        $simpegUserId = $identity['id'] ?? $identity['user_id'] ?? null;

        abort_unless($simpegUserId, 422, 'Identity SIMPEG tidak memiliki user id.');

        $existingUser = $this->mainRepository->findBySimpegUserId($simpegUserId);

        $user = $this->mainRepository->updateOrCreateBySimpegUserId(
            $simpegUserId,
            [
                'id' => $existingUser?->getKey() ?: (string) Str::uuid(),
                'auth_type' => 'sso',
                'username' => $identity['username'] ?? $identity['nip'] ?? $identity['nik'] ?? null,
                'name' => $identity['name'] ?? $identity['full_name'] ?? 'Pengguna SIMPEG',
                'email' => $identity['email'] ?? null,
                'is_active' => true,
            ],
        );
        $isAdmin = filter_var($identity['isAdmin'] ?? false,FILTER_VALIDATE_BOOLEAN);
        if ($isAdmin) {
            $user->syncRoles('Admin WBS');
        }

        return $user;
    }
}
