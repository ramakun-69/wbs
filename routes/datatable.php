<?php

use App\Http\Controllers\DatatableController;
use Illuminate\Support\Facades\Route;

Route::prefix('datatable')->name('datatable.')->middleware(['auth'])
    ->controller(DatatableController::class)->group(fn() => [
        Route::get('/internal-users', 'internalUsers')->name('internal-users'),
    ]);
