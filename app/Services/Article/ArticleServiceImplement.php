<?php

namespace App\Services\Article;

use App\Models\Article;
use App\Repositories\App\AppRepository;
use Illuminate\Support\Str;
use LaravelEasyRepository\ServiceApi;

class ArticleServiceImplement extends ServiceApi implements ArticleService
{
    public function __construct(private AppRepository $appRepository) {}

    public function createArticle(array $data): Article
    {
        return $this->saveArticle(new Article(), $data);
    }

    public function updateArticle(Article $article, array $data): Article
    {
        return $this->saveArticle($article, $data);
    }

    public function deleteArticle(Article $article): bool
    {
        return $this->appRepository->deleteOneModel($article);
    }

    private function saveArticle(Article $article, array $data): Article
    {
        $isPublished = (bool) ($data['is_published'] ?? false);
        $values = [
            'title' => $data['title'],
            'slug' => $this->uniqueSlug($data['title'], $article),
            'excerpt' => $data['excerpt'] ?? null,
            'content' => $data['content'],
            'is_published' => $isPublished,
            'published_at' => $isPublished ? ($article->published_at ?? now()) : null,
        ];
            
        if ($article->exists) {
            $this->appRepository->updateOneModelWithFile(
                $article,
                $values,
                'cover_image',
                'articles',
                'cover_image_path',
            );

            return $article->refresh();
        }

        return $this->appRepository->insertOneModelWithFile(
            $article,
            $values,
            'cover_image',
            'articles',
            'cover_image_path',
        );
    }

    private function uniqueSlug(string $title, Article $article): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $counter = 2;

        while (Article::query()->where('slug', $slug)->when($article->exists, fn ($query) => $query->where($article->getKeyName(), '!=', $article->getKey()))->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
