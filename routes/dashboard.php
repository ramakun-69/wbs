<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');
