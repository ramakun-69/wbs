<?php

namespace App\Services\Support;

use App\Models\SupportMessage;
use App\Models\SupportTicket;
use App\Models\User;
use App\Enums\SupportStatus;
use App\Repositories\App\AppRepository;
use App\Repositories\Support\SupportRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use LaravelEasyRepository\ServiceApi;

class SupportServiceImplement extends ServiceApi implements SupportService
{
    public function __construct(
        private AppRepository $appRepository,
        private SupportRepository $supportRepository,
    ) {}

    public function paginateForUser(User $user, bool $viewAll, int $perPage = 10, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        return $this->supportRepository->paginateForUser($user, $viewAll, $perPage, $search, $status);
    }

    public function findForUserOrFail(string $id, User $user, bool $viewAll): SupportTicket
    {
        return $this->supportRepository->findForUserOrFail($id, $user, $viewAll);
    }

    public function createTicket(array $data, User $user): SupportTicket
    {
        return DB::transaction(function () use ($data, $user) {
            $ticket = $this->appRepository->insertOneModel(new SupportTicket(), [
                'ticket_number' => $this->supportRepository->nextTicketNumber(now()->year),
                'created_by' => $user->getKey(),
                'subject' => $data['subject'],
                'message' => $data['message'],
                'status' => SupportStatus::Open->value,
                'last_replied_at' => now(),
            ]);

            $message = $this->appRepository->insertOneModel(new SupportMessage(), [
                'support_ticket_id' => $ticket->getKey(),
                'user_id' => $user->getKey(),
                'message' => $data['message'],
            ]);

            $this->storeAttachments($ticket, $message, $data['attachments'] ?? []);

            return $ticket;
        });
    }

    public function reply(SupportTicket $ticket, array $data, User $user): SupportTicket
    {
        return DB::transaction(function () use ($ticket, $data, $user) {
            $message = $this->appRepository->insertOneModel(new SupportMessage(), [
                'support_ticket_id' => $ticket->getKey(),
                'user_id' => $user->getKey(),
                'message' => $data['message'],
            ]);

            $ticket->update([
                'status' => $user->can('Manage Support')
                    ? SupportStatus::InProgress->value
                    : SupportStatus::Open->value,
                'last_replied_at' => now(),
            ]);

            $this->storeAttachments($ticket, $message, $data['attachments'] ?? []);

            return $ticket->refresh();
        });
    }

    public function close(SupportTicket $ticket): SupportTicket
    {
        $ticket->update(['status' => SupportStatus::Closed->value]);

        return $ticket->refresh();
    }

    public function updateStatus(SupportTicket $ticket, string $status): SupportTicket
    {
        $ticket->update(['status' => $status]);

        return $ticket->refresh();
    }

    private function storeAttachments(SupportTicket $ticket, SupportMessage $message, array $attachments): void
    {
        foreach ($attachments as $file) {
            $this->appRepository->insertOneModel(new \App\Models\SupportAttachment(), [
                'support_ticket_id' => $ticket->getKey(),
                'support_message_id' => $message->getKey(),
                'original_name' => $file->getClientOriginalName(),
                'path' => $file->store('support', 'public'),
                'size' => $file->getSize(),
                'mime_type' => $file->getClientMimeType(),
            ]);
        }
    }
}
