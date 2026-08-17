<?php

use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;

Route::middleware(['guest'])->group(function () {
    Route::get('login', [LoginController::class, 'index'])->name('login');
    Route::post('login', [LoginController::class, 'authenticate'])->name('login.authenticate');
    Route::get('register', [LoginController::class, 'register'])->name('register');
    Route::post('register', [LoginController::class, 'store'])->name('register.store');
});

Route::match(['get', 'post'], '/logout', [LoginController::class, 'logout'])->middleware(['auth'])->name('logout');
