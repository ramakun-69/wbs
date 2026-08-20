<?php

namespace App\Notifications;

use App\Models\Complaint;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ComplaintStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected Complaint $complaint,
        protected string $fromStatus,
        protected string $toStatus,
        protected ?string $note = null,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject("{$this->complaint->ticket_number} - Complaint status updated")
            ->greeting("Hello {$notifiable->name},")
            ->line("Complaint {$this->complaint->ticket_number} has moved to status: {$this->toStatus}.")
            ->line("Title: {$this->complaint->title}")
            ->action('View Complaint', route('dashboard.complaints.show', $this->complaint));

        if ($this->note) {
            $message->line("Note: {$this->note}");
        }

        return $message->line('This is an automated notification from WBS.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'complaint_id' => $this->complaint->getKey(),
            'ticket_number' => $this->complaint->ticket_number,
            'from_status' => $this->fromStatus,
            'to_status' => $this->toStatus,
        ];
    }
}
