<?php

namespace App\Http\Controllers\Complaint;

use App\Http\Controllers\Controller;
use App\Http\Requests\Complaint\StoreComplaintRequest;
use App\Http\Requests\Complaint\StoreInvestigationActivityRequest;
use App\Http\Requests\Complaint\TransitionComplaintRequest;
use App\Models\User;
use App\Services\Complaint\ComplaintService;
use App\Services\ComplaintWorkflow\ComplaintWorkflowService;
use App\Repositories\App\AppRepository;
use App\Models\InvestigationActivity;
use App\Models\InvestigationActivityAttachment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class ComplaintController extends Controller
{
    public function __construct(
        protected ComplaintService $complaintService,
        protected ComplaintWorkflowService $workflowService,
        protected AppRepository $appRepository,
    ) {}

    public function index(): Response
    {
        return inertia('Complaints/Index', [
            'complaints' => [],
        ]);
    }

    public function report(): Response
    {
        return inertia('Reports/Complaints/Index', [
            'categories' => $this->complaintService->activeCategories(),
        ]);
    }

    public function exportReport(Request $request): StreamedResponse
    {
        abort_unless($request->user()->can('Export Complaints'), 403);

        $filters = $request->only([
            'period_from',
            'period_to',
            'ticket_number',
            'category_id',
            'status',
        ]);
        $reports = $this->complaintService->reportRows($filters);

        return response()->streamDownload(function () use ($reports): void {
            $handle = fopen('php://output', 'w');
            fwrite($handle, "\xEF\xBB\xBF");
            fputcsv($handle, [
                __('Ticket Number'),
                __('Reporter'),
                __('Title'),
                __('Category'),
                __('Date'),
                __('Priority'),
                __('Status'),
            ]);

            foreach ($reports as $report) {
                fputcsv($handle, [
                    $report->ticket_number,
                    $report->reporter?->is_anonymous ? __('Anonymous') : ($report->reporter?->name ?? '-'),
                    $report->title,
                    $report->category?->name ?? '-',
                    optional($report->submitted_at ?? $report->created_at)->format('Y-m-d H:i'),
                    $report->priority ? __($report->priority) : '-',
                    __($report->status->value),
                ]);
            }

            fclose($handle);
        }, 'complaint-report.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function create(): Response
    {
        return inertia('Complaints/Create', [
            'categories' => $this->complaintService->activeCategories(),
        ]);
    }

    public function store(StoreComplaintRequest $request): RedirectResponse
    {
        $this->complaintService->createComplaint($request->validated(),Auth::user());
        return redirect()
            ->route('dashboard.complaints.index')
            ->with('success', __('Complaint submitted successfully.'));
    }

    public function transition(TransitionComplaintRequest $request, string $complaint, string $action): RedirectResponse
    {
        $action = str_replace('-', ' ', $action);
        $complaintModel = $this->complaintService->findForUserOrFail($complaint, Auth::user(), true);
        $from = $complaintModel->status->value;

        $updated = $this->workflowService->transition( $complaintModel, $action, Auth::user(), $request->validated());

        $this->workflowService->notify($updated, $from, $updated->status->value,$request->validated('note'));

        return redirect()
            ->route('dashboard.complaints.index')
            ->with('success', __('Complaint workflow updated successfully.'));
    }

    public function storeActivity(StoreInvestigationActivityRequest $request, string $complaint): RedirectResponse
    {
        $complaintModel = $this->complaintService->findForUserOrFail($complaint, Auth::user(), true);
        abort_unless($complaintModel->investigation, 422, __('Investigation has not been created yet.'));

        $activity = $this->appRepository->insertOneModel(new InvestigationActivity(), [
            'investigation_id' => $complaintModel->investigation->getKey(),
            'activity_date' => $request->validated('activity_date'),
            'activity_type' => $request->validated('activity_type'),
            'description' => $request->validated('description'),
            'created_by' => Auth::id(),
        ]);

        if ($request->hasFile('activity_document')) {
            $file = $request->file('activity_document');
            $this->appRepository->insertOneModel(new InvestigationActivityAttachment(), [
                'investigation_id' => $complaintModel->investigation->getKey(),
                'activity_id' => $activity->getKey(),
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $file->store('complaints/investigation-activities', 'public'),
                'disk' => 'public',
                'mime_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
                'uploaded_by' => Auth::id(),
            ]);
        }

        return back()->with('success', __('Investigation activity saved successfully.'));
    }

    public function saveExaminationResult(TransitionComplaintRequest $request, string $complaint): RedirectResponse
    {
        $complaintModel = $this->complaintService->findForUserOrFail($complaint, Auth::user(), true);
        $this->workflowService->saveExaminationResult($complaintModel, $request->validated());

        return back()->with('success', __('Examination result saved successfully.'));
    }

    public function show(string $complaint): Response
    {
        $user = User::find(Auth::id());
        $viewAll = $user->can('View All Complaints') || $user->can('View Investigation');

        return inertia('Complaints/Show', [
            'complaint' => $this->complaintService->findForUserOrFail($complaint,$user,$viewAll,
            ),
        ]);
    }
}
