<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Repositories\App\AppRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use LaravelEasyRepository\ServiceApi;

class AuthServiceImplement extends ServiceApi implements AuthService
{
    public function __construct(
        protected AppRepository $appRepository,
    ) {}

    public function register(array $data): User
    {
        return DB::transaction(function () use ($data): User {
            $user = $this->appRepository->insertOneModel(new User(), [
                'auth_type' => 'local',
                'name' => $data['name'] ?? null,
                'email' => $data['email'] ?? null,
                'password' => $data['password'],
                'is_active' => true,
            ]);

            $user->assignRole('User');

            return $user;
        });
    }

    public function authenticate(array $data): bool
    {
        return Auth::attempt([
            'email' => $data['email'],
            'password' => $data['password'],
            'auth_type' => 'local',
            'is_active' => true,
        ], filter_var($data['remember'] ?? false, FILTER_VALIDATE_BOOLEAN));
    }
}
