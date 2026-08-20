<?php

namespace App\Services\ComplaintWorkflow;

use App\Models\Complaint;
use App\Models\User;
use LaravelEasyRepository\BaseService;

interface ComplaintWorkflowService extends BaseService
{
    public function transition(Complaint $complaint, string $action, User $actor, array $data = []): Complaint;

    public function notify(Complaint $complaint, string $from, string $to, ?string $note = null): void;

    public function saveExaminationResult(Complaint $complaint, array $data): void;
}
