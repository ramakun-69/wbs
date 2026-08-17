<?php

namespace App\Repositories\Sso;

use App\Models\User;
use LaravelEasyRepository\Implementations\Eloquent;

class SsoRepositoryImplement extends Eloquent implements SsoRepository
{
    protected User $model;

    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function findBySimpegUserId(string|int $simpegUserId): ?User
    {
        return $this->model
            ->where('simpeg_user_id', (string) $simpegUserId)
            ->first();
    }

    public function updateOrCreateBySimpegUserId(string|int $simpegUserId, array $attributes): User
    {
        return $this->model->updateOrCreate(
            ['simpeg_user_id' => (string) $simpegUserId],
            $attributes,
        );
    }
}
