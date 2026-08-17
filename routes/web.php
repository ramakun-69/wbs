<?php

use App\Http\Controllers\Auth\SsoController;
use App\Http\Controllers\LocalizationController;
use Illuminate\Support\Facades\Route;



Route::get('/', function () {
    return view('welcome');
});

Route::post('/set-language', LocalizationController::class)->name('set-language');