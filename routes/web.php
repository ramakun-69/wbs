<?php

use App\Http\Controllers\Auth\SsoController;
use App\Http\Controllers\LocalizationController;
use App\Http\Controllers\Public\PublicController;
use Illuminate\Support\Facades\Route;



Route::get('/', [PublicController::class, 'home'])->name('public.home');
Route::get('/articles', [PublicController::class, 'articles'])->name('public.articles.index');
Route::get('/articles/{article:slug}', [PublicController::class, 'article'])->name('public.articles.show');
Route::get('/tracking', [PublicController::class, 'tracking'])->name('public.tracking');

Route::post('/set-language', LocalizationController::class)->name('set-language');
