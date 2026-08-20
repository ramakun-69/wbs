<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Article;
use App\Models\Faq;
use App\Services\Complaint\ComplaintService;
use App\Services\Support\SupportService;
use Illuminate\Http\Request;

class DatatableController extends Controller
{
    public function __construct(
        protected ComplaintService $complaintService,
        protected SupportService $supportService,
    ) {}

    public function internalUsers(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $data =  User::with('roles:id,name')
            ->where('auth_type','sso')
            ->when($request->filled('search'), function ($q) use ($request) {
                $s = "%{$request->search}%";
                $q->where(
                    fn($q) =>
                    $q->where('name', 'like', $s)
                        ->orWhere('username', 'like', $s)
                        ->orWhere('email', 'like', $s)
                );
            })
            ->paginate($perPage);
        return response()->json([
            'data' => $data->items(),
            'total' => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page' => $data->perPage(),
        ]);
    }

    public function complaints(Request $request)
    {
        $user = $request->user();
        $viewAll = $user->can('View All Complaints') || $user->can('View Investigation');
        $complaints = $this->complaintService->listForUser(
            $user,
            $viewAll,
            min(max((int) $request->input('per_page', 10), 1), 100),
            trim((string) $request->input('search', '')) ?: null,
            $request->input('status'),
        );

        return response()->json([
            'data' => $complaints->items(),
            'total' => $complaints->total(),
            'current_page' => $complaints->currentPage(),
            'per_page' => $complaints->perPage(),
        ]);
    }

    public function complaintReports(Request $request)
    {
        abort_unless(
            $request->user()->can('View All Complaints') || $request->user()->can('Export Complaints'),
            403,
        );

        $filters = $request->only([
            'period_from',
            'period_to',
            'ticket_number',
            'category_id',
            'status',
        ]);

        $reports = $this->complaintService->paginateReport(
            $filters,
            min(max((int) $request->input('per_page', 10), 1), 100),
        );

        return response()->json([
            'data' => $reports->items(),
            'total' => $reports->total(),
            'current_page' => $reports->currentPage(),
            'per_page' => $reports->perPage(),
        ]);
    }

    public function articles(Request $request)
    {
        $perPage = min(max((int) $request->input('per_page', 10), 1), 100);
        $search = trim((string) $request->input('search', ''));

        $articles = Article::query()
            ->when($search !== '', fn ($query) => $query->where(function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            }))
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'data' => $articles->items(),
            'total' => $articles->total(),
            'current_page' => $articles->currentPage(),
            'per_page' => $articles->perPage(),
        ]);
    }

    public function faqs(Request $request)
    {
        $perPage = min(max((int) $request->input('per_page', 10), 1), 100);
        $search = trim((string) $request->input('search', ''));

        $faqs = Faq::query()
            ->when($search !== '', fn ($query) => $query->where(function ($query) use ($search) {
                $query->where('question', 'like', "%{$search}%")
                    ->orWhere('answer', 'like', "%{$search}%");
            }))
            ->orderBy('sort_order')
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'data' => $faqs->items(),
            'total' => $faqs->total(),
            'current_page' => $faqs->currentPage(),
            'per_page' => $faqs->perPage(),
        ]);
    }

    public function supports(Request $request)
    {
        $user = $request->user();
        $tickets = $this->supportService->paginateForUser(
            $user,
            $user->can('Manage Support'),
            min(max((int) $request->input('per_page', 10), 1), 100),
            trim((string) $request->input('search', '')) ?: null,
            $request->input('status'),
        );

        return response()->json([
            'data' => $tickets->items(),
            'total' => $tickets->total(),
            'current_page' => $tickets->currentPage(),
            'per_page' => $tickets->perPage(),
        ]);
    }
}
