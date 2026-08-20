<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\ComplaintStatus;
use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $this->dashboardRole($user);
        $query = Complaint::query();

        if ($role === 'user') {
            $query->where('created_by', $user->getKey());
        }

        $statuses = collect(ComplaintStatus::cases())->mapWithKeys(
            fn (ComplaintStatus $status) => [$status->name => $status->value],
        );

        $metrics = match ($role) {
            'admin' => [
                ['label' => 'Total Complaints', 'value' => (clone $query)->count(), 'tone' => 'primary'],
                ['label' => 'High Priority Active', 'value' => (clone $query)->where('priority', 'High')->whereNotIn('status', [$statuses['Completed'], $statuses['Rejected']])->count(), 'tone' => 'danger'],
                ['label' => 'Waiting Registration', 'value' => (clone $query)->where('status', $statuses['Submitted'])->count(), 'tone' => 'warning'],
                ['label' => 'Completed', 'value' => (clone $query)->where('status', $statuses['Completed'])->count(), 'tone' => 'success'],
            ],
            'irban' => [
                ['label' => 'Total Complaints', 'value' => (clone $query)->count(), 'tone' => 'primary'],
                ['label' => 'Waiting Verification', 'value' => (clone $query)->where('status', $statuses['WaitingIrbanVerification'])->count(), 'tone' => 'warning'],
                ['label' => 'Investigation', 'value' => (clone $query)->where('status', $statuses['Investigation'])->count(), 'tone' => 'info'],
                ['label' => 'Completed', 'value' => (clone $query)->where('status', $statuses['Completed'])->count(), 'tone' => 'success'],
            ],
            'secretary' => [
                ['label' => 'Waiting Assignment Letter', 'value' => (clone $query)->where('status', $statuses['WaitingSK'])->count(), 'tone' => 'primary'],
                ['label' => 'Waiting Result Review', 'value' => (clone $query)->where('status', $statuses['WaitingSecretaryReview'])->count(), 'tone' => 'warning'],
                ['label' => 'Active Investigations', 'value' => (clone $query)->where('status', $statuses['Investigation'])->count(), 'tone' => 'info'],
                ['label' => 'Completed', 'value' => (clone $query)->where('status', $statuses['Completed'])->count(), 'tone' => 'success'],
            ],
            'technical' => [
                ['label' => 'Active Investigations', 'value' => (clone $query)->where('status', $statuses['Investigation'])->count(), 'tone' => 'info'],
                ['label' => 'Returned to Team', 'value' => (clone $query)->where('status', $statuses['Investigation'])->count(), 'tone' => 'warning'],
                ['label' => 'Completed This Month', 'value' => (clone $query)->where('status', $statuses['Completed'])->whereMonth('completed_at', now()->month)->count(), 'tone' => 'success'],
                ['label' => 'Total Activities', 'value' => DB::table('investigation_activities')->where('created_by', $user->getKey())->count(), 'tone' => 'primary'],
            ],
            'inspector' => [
                ['label' => 'Total Cases This Year', 'value' => (clone $query)->whereYear('submitted_at', now()->year)->count(), 'tone' => 'primary'],
                ['label' => 'Waiting Approval', 'value' => (clone $query)->where('status', $statuses['WaitingInspectorApproval'])->count(), 'tone' => 'danger'],
                ['label' => 'High Priority Active', 'value' => (clone $query)->where('priority', 'High')->whereNotIn('status', [$statuses['Completed'], $statuses['Rejected']])->count(), 'tone' => 'warning'],
                ['label' => 'Completed', 'value' => (clone $query)->where('status', $statuses['Completed'])->count(), 'tone' => 'success'],
            ],
            default => [
                ['label' => 'My Complaints', 'value' => (clone $query)->count(), 'tone' => 'primary'],
                ['label' => 'In Process', 'value' => (clone $query)->whereNotIn('status', [$statuses['Completed'], $statuses['Rejected'], $statuses['Draft']])->count(), 'tone' => 'info'],
                ['label' => 'Completed', 'value' => (clone $query)->where('status', $statuses['Completed'])->count(), 'tone' => 'success'],
                ['label' => 'Drafts', 'value' => (clone $query)->where('status', $statuses['Draft'])->count(), 'tone' => 'secondary'],
            ],
        };

        $latest = (clone $query)
            ->with('category')
            ->latest('submitted_at')
            ->latest('created_at')
            ->limit(6)
            ->get(['id', 'ticket_number', 'title', 'priority', 'status', 'submitted_at', 'category_id'])
            ->map(fn (Complaint $complaint) => [
                'id' => $complaint->id,
                'ticket_number' => $complaint->ticket_number,
                'title' => $complaint->title,
                'priority' => $complaint->priority,
                'status' => $complaint->status->value,
                'category' => $complaint->category?->name,
                'submitted_at' => $complaint->submitted_at?->toISOString(),
            ])->values();

        $monthly = collect(range(5, 0))->map(function (int $monthsAgo) use ($query) {
            $date = now()->subMonths($monthsAgo);
            return [
                'label' => $date->format('M'),
                'value' => (clone $query)->whereYear('submitted_at', $date->year)->whereMonth('submitted_at', $date->month)->count(),
            ];
        })->values();

        return inertia('Dashboard', [
            'dashboard' => [
                'role' => $role,
                'metrics' => $metrics,
                'monthly' => $monthly,
                'latest' => $latest,
            ],
        ]);
    }

    private function dashboardRole($user): string
    {
        return match (true) {
            $user->can('Approve Recommendation') => 'inspector',
            $user->can('Review Investigation') => 'secretary',
            $user->can('Execute Investigation') => 'technical',
            $user->can('Verify Complaint') => 'irban',
            $user->can('Register Complaint') => 'admin',
            default => 'user',
        };
    }
}
