<?php

namespace App\Services\Article;

use App\Models\Article;
use LaravelEasyRepository\BaseService;

interface ArticleService extends BaseService
{
    public function createArticle(array $data): Article;
    public function updateArticle(Article $article, array $data): Article;
    public function deleteArticle(Article $article): bool;
}
