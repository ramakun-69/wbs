<?php

namespace App\Http\Controllers\Faq;

use App\Http\Controllers\Controller;
use App\Http\Requests\Faq\StoreFaqRequest;
use App\Models\Faq;
use App\Services\Faq\FaqService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function __construct(private FaqService $faqService) {}

    public function index(): Response
    {
        return Inertia::render('Faqs/Index');
    }

    public function store(StoreFaqRequest $request): RedirectResponse
    {
        $this->faqService->createFaq($request->validated());
        return back()->with('success', __('FAQ created successfully.'));
    }

    public function update(StoreFaqRequest $request, Faq $faq): RedirectResponse
    {
        $this->faqService->updateFaq($faq, $request->validated());
        return back()->with('success', __('FAQ updated successfully.'));
    }

    public function destroy(Faq $faq): RedirectResponse
    {
        $this->faqService->deleteFaq($faq);
        return back()->with('success', __('FAQ deleted successfully.'));
    }
}
