<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    Route::middleware('can:Manage Users')->group(function () {
        Route::resource('users', UserController::class)->only(['index','store','delete']);
        Route::put('users/{user}/roles', [UserController::class, 'updateRoles'])
            ->name('users.roles.update');
    });
});
