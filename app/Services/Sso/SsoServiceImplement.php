<?php

namespace App\Services\Sso;

use App\Models\User;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\Http;
use LaravelEasyRepository\ServiceApi;
use RuntimeException;

class SsoServiceImplement extends ServiceApi implements SsoService
{
    public function __construct(
        protected UserRepository $userRepository,
    ) {}

    public function hasApplicationAccess(array $identity, string $applicationCode): bool {
        $accesses = $identity['application_accesses'] ?? $identity['applicationAccesses'] ?? null;
        if (!is_array($accesses)) {
            return true;
        }
        $applicationCode = strtoupper(trim($applicationCode));
        foreach ($accesses as $access) {
            if (!is_array($access)) {
                continue;
            }

            $code = $access['code']
                ?? $access['application_code']
                ?? $access['application']['code']
                ?? null;

            $hasAccess = $access['has_access']
                ?? $access['hasAccess']
                ?? $access['is_active']
                ?? true;

            if (
                is_string($code)
                && strtoupper(trim($code)) === $applicationCode
                && filter_var($hasAccess, FILTER_VALIDATE_BOOLEAN)
            ) {
                return true;
            }
        }

        return false;
    }

    public function provisionUser(array $identity): User
    {
        $simpegUserId = $identity['id'] ?? $identity['user_id'] ?? null;
        abort_unless($simpegUserId, 422, 'Identity SIMPEG tidak memiliki user id.');

        $user = $this->userRepository->updateOrCreateBySimpegUserId(
            $simpegUserId,
            [
                'auth_type' => 'sso',
                'username' => $identity['username'] ?? null,
                'name' => $identity['name'] ?? '',
                'email' => $identity['email'] ?? null,
                'is_active' => true,
            ],
        );
        $isAdmin = filter_var(
            $identity['isAdmin'] ?? $identity['is_admin'] ?? false,
            FILTER_VALIDATE_BOOLEAN,
        );

        // SSO tidak boleh menghapus role yang sudah diatur oleh admin WBS.
        // Tambahkan role bawaan hanya jika user belum memiliki role apa pun.
        if (! $user->roles()->exists()) {
            $user->assignRole('User');
        }

        // Jika SIMPEG menandai user sebagai admin aplikasi, tambahkan role
        // Admin WBS tanpa menghapus role lain yang sudah ada.
        if ($isAdmin && ! $user->hasRole('Admin WBS')) {
            $user->assignRole('Admin WBS');
        }

        return $user;
    }

    public function searchUsers(string $search): array
    {
        $tokenResponse = Http::asForm()
            ->acceptJson()
            ->timeout(15)
            ->post(config('services.simpeg.token_url'), [
                'grant_type' => 'client_credentials',
                'client_id' => config('services.simpeg.client_id'),
                'client_secret' => config('services.simpeg.client_secret'),
            ]);
        if ($tokenResponse->failed()) {
            throw new RuntimeException('SIMPEG token request failed.');
        }

        $accessToken = $tokenResponse->json('access_token');

        if (!filled($accessToken)) {
            throw new RuntimeException('SIMPEG access token is missing.');
        }

        $response = Http::withToken($accessToken)
            ->acceptJson()
            ->timeout(15)
            ->get(
                config('services.simpeg.base_url') . '/api/employee-list',
                ['search' => $search],
            );

        if ($response->failed()) {
            throw new RuntimeException('SIMPEG user list request failed.');
        }

        $items = $response->json('data');

        return is_array($items) ? $items : [];
    }

    public function registerUser(array $data): User
    {
        $simpegUserId = (string) $data['simpeg_user_id'];
        $this->grantApplicationAccess($simpegUserId);
        return $this->userRepository->updateOrCreateBySimpegUserId(
            $simpegUserId,
            [
                'auth_type' => 'sso',
                'username' => $data['username'],
                'name' => $data['name'],
                'email' => $data['email'],
                'is_active' => true,
            ],
        );
    }

    public function grantApplicationAccess(string $simpegUserId,bool $isAdmin = false): void {
        $tokenResponse = Http::asForm()
            ->acceptJson()
            ->timeout(15)
            ->post(config('services.simpeg.token_url'), [
                'grant_type' => 'client_credentials',
                'client_id' => config('services.simpeg.client_id'),
                'client_secret' => config('services.simpeg.client_secret'),
            ]);

        if ($tokenResponse->failed()) {
            throw new RuntimeException('SIMPEG token request failed.');
        }

        $accessToken = $tokenResponse->json('access_token');

        if (!filled($accessToken)) {
            throw new RuntimeException('SIMPEG access token is missing.');
        }

        $response = Http::withToken($accessToken)
            ->acceptJson()
            ->timeout(15)
            ->post(config('services.simpeg.base_url') . "/api/employee/{$simpegUserId}/assign-application-access",
                [
                    'accesses' => [
                        [
                            'application_code' => 'WBS',
                            'is_admin' => $isAdmin,
                        ],
                    ],
                ],
            );

        if ($response->failed()) {
            throw new RuntimeException('SIMPEG application access request failed.');
        }
    }
}
