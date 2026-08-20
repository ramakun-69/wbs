<?php

namespace App\Http\Controllers\Article;

use App\Http\Controllers\Controller;
use App\Http\Requests\Article\StoreArticleRequest;
use App\Models\Article;
use App\Services\Article\ArticleService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function __construct(private ArticleService $articleService) {}

    public function index(): Response
    {
        return Inertia::render('Articles/Index');
    }

    public function store(StoreArticleRequest $request): RedirectResponse
    {
        $this->articleService->createArticle($request->validated());

        return back()->with('success', __(':attribute created successfully', ['attribute' => __('Article')]));
    }

    public function update(StoreArticleRequest $request, Article $article): RedirectResponse
    {
        $this->articleService->updateArticle($article, $request->validated());

        return back()->with('success', __(':attribute updated successfully', ['attribute' => __('Article')]));
    }

    public function destroy(Article $article): RedirectResponse
    {
        $this->articleService->deleteArticle($article);

        return back()->with('success', __(':attribute deleted successfully', ['attribute' => __('Article')]));
    }
}
