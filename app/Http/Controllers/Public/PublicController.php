<?php

namespace App\Http\Controllers\Public;

use App\Models\Article;
use App\Models\Complaint;
use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Response;

class PublicController
{
    public function home(): Response
    {
        return inertia('Public/Home', [
            'articles' => Article::query()
                ->where('is_published', true)
                ->latest('published_at')
                ->limit(4)
                ->get(),
            'faqs' => Faq::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->latest('created_at')
                ->limit(8)
                ->get(),
        ]);
    }

    public function articles(): Response
    {
        return inertia('Public/Articles/Index', [
            'articles' => Article::query()
                ->where('is_published', true)
                ->latest('published_at')
                ->paginate(8)
                ->withQueryString(),
        ]);
    }

    public function article(Article $article): Response
    {
        abort_unless($article->is_published, 404);

        return inertia('Public/Articles/Show', [
            'article' => $article,
        ]);
    }

    public function tracking(Request $request): Response
    {
        $ticketNumber = trim((string) $request->query('ticket'));
        $tracking = null;

        if ($ticketNumber !== '') {
            $complaint = Complaint::query()
                ->with(['category', 'statusHistories'])
                ->where('ticket_number', $ticketNumber)
                ->first();

            $tracking = $complaint ? [
                'ticket_number' => $complaint->ticket_number,
                'status' => $complaint->status->value,
                'category' => $complaint->category?->name,
                'submitted_at' => $complaint->submitted_at,
                'completed_at' => $complaint->completed_at,
                'histories' => $complaint->statusHistories
                    ->sortByDesc('created_at')
                    ->values()
                    ->map(fn ($history) => [
                        'status' => $history->to_status?->value ?? $history->to_status,
                        'action' => $history->action,
                        'created_at' => $history->created_at,
                    ]),
            ] : null;
        }

        return inertia('Public/Tracking', [
            'ticket' => $ticketNumber,
            'tracking' => $tracking,
        ]);
    }
}
