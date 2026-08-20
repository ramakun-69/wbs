<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use App\Http\Requests\Support\ReplySupportRequest;
use App\Http\Requests\Support\StoreSupportRequest;
use App\Http\Requests\Support\UpdateSupportStatusRequest;
use App\Enums\SupportStatus;
use App\Models\SupportTicket;
use App\Services\Support\SupportService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SupportController extends Controller
{
    public function __construct(private SupportService $supportService) {}

    public function index(): Response
    {
        return Inertia::render('Support/Index');
    }

    public function create(): Response
    {
        $user = request()->user();

        abort_unless(
            $user->can('Create Support') && ! $user->can('Manage Support'),
            403,
        );

        return Inertia::render('Support/Create');
    }

    public function store(StoreSupportRequest $request): RedirectResponse
    {
        $this->supportService->createTicket($request->validated(), $request->user());

        return redirect()->route('dashboard.supports.index')->with('success', __('Support ticket created successfully.'));
    }

    public function show(SupportTicket $support): Response
    {
        $user = request()->user();
        $ticket = $this->supportService->findForUserOrFail(
            $support->getKey(),
            $user,
            $user->can('Manage Support'),
        );

        return Inertia::render('Support/Show', ['ticket' => $ticket]);
    }

    public function reply(ReplySupportRequest $request, SupportTicket $support): RedirectResponse
    {
        $user = $request->user();
        abort_if($support->status === SupportStatus::Closed->value, 422, __('Closed support tickets cannot receive replies.'));
        abort_unless($user->can('Manage Support') || $support->created_by === $user->getKey(), 403);

        $this->supportService->reply($support, $request->validated(), $user);

        return back()->with('success', __('Support reply sent successfully.'));
    }

    public function close(SupportTicket $support): RedirectResponse
    {
        abort_unless(request()->user()->can('Manage Support'), 403);
        $this->supportService->close($support);

        return back()->with('success', __('Support ticket closed successfully.'));
    }

    public function updateStatus(UpdateSupportStatusRequest $request, SupportTicket $support): RedirectResponse
    {
        $this->supportService->updateStatus($support, $request->validated('status'));

        return back()->with('success', __('Support status updated successfully.'));
    }
}
