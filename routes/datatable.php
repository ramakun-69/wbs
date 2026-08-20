<?php

use App\Http\Controllers\DatatableController;
use Illuminate\Support\Facades\Route;

Route::prefix('datatable')->name('datatable.')->middleware(['auth'])
    ->controller(DatatableController::class)->group(fn() => [
        Route::get('/internal-users', 'internalUsers')->name('internal-users'),
        Route::get('/complaints', 'complaints')
            ->middleware('permission:View Own Complaint|View All Complaints|View Investigation')
            ->name('complaints'),
        Route::get('/complaint-reports', 'complaintReports')
            ->middleware('permission:View All Complaints|Export Complaints')
            ->name('complaint-reports'),
        Route::get('/articles', 'articles')
            ->middleware('can:Manage Content')
            ->name('articles'),
        Route::get('/faqs', 'faqs')
            ->middleware('can:Manage FAQ')
            ->name('faqs'),
        Route::get('/supports', 'supports')
            ->middleware('permission:View Support|Manage Support|View Own Support')
            ->name('supports'),
    ]);
