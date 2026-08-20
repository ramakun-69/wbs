<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Complaint\ComplaintController;
use App\Http\Controllers\Faq\FaqController;
use App\Http\Controllers\Article\ArticleController;
use App\Http\Controllers\Profile\ProfileController;
use App\Http\Controllers\Support\SupportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::prefix('dashboard')->middleware(['auth'])->name('dashboard.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('index');

    Route::middleware('can:Edit Profile')->group(function () {
        Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('profile', [ProfileController::class, 'update'])->name('profile.update');
    });

    Route::resource('faqs', FaqController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->middleware('can:Manage FAQ');

    Route::resource('articles', ArticleController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->middleware('can:Manage Content');

    Route::resource('supports', SupportController::class)
        ->only(['index', 'create', 'store', 'show'])
        ->middlewareFor('index', 'permission:View Support|Manage Support|View Own Support')
        ->middlewareFor(['create', 'store'], 'can:Create Support')
        ->middlewareFor('show', 'permission:View Support|Manage Support|View Own Support');
    Route::post('supports/{support}/reply', [SupportController::class, 'reply'])
        ->middleware('permission:Manage Support|Create Support')
        ->name('supports.reply');
    Route::post('supports/{support}/close', [SupportController::class, 'close'])
        ->middleware('can:Manage Support')
        ->name('supports.close');
    Route::patch('supports/{support}/status', [SupportController::class, 'updateStatus'])
        ->middleware('can:Manage Support')
        ->name('supports.status.update');

    Route::resource('complaints', ComplaintController::class)
        ->only(['index', 'show', 'create', 'store'])
        ->middlewareFor(
            ['index', 'show'],
            'permission:View Own Complaint|View All Complaints|View Investigation',
        )
        ->middlewareFor(
            ['create', 'store'],
            'can:Create Complaint',
        );

    Route::get('reports/complaints', [ComplaintController::class, 'report'])
        ->middleware('permission:View All Complaints|Export Complaints')
        ->name('reports.complaints.index');
    Route::get('reports/complaints/export', [ComplaintController::class, 'exportReport'])
        ->middleware('can:Export Complaints')
        ->name('reports.complaints.export');

    Route::post('complaints/{complaint}/admin/process', [ComplaintController::class, 'transition'])
        ->defaults('action', 'Register')
        ->middleware('can:Register Complaint')
        ->name('complaints.admin.process');
    Route::post('complaints/{complaint}/verification/verify', [ComplaintController::class, 'transition'])
        ->defaults('action', 'Verify')
        ->middleware('can:Verify Complaint')
        ->name('complaints.verification.verify');
    Route::post('complaints/{complaint}/verification/reject', [ComplaintController::class, 'transition'])
        ->defaults('action', 'Not Verify')
        ->middleware('can:Verify Complaint')
        ->name('complaints.verification.reject');
    Route::post('complaints/{complaint}/investigation/issue-sk', [ComplaintController::class, 'transition'])
        ->defaults('action', 'Issue SK')
        ->middleware('can:Create Investigation')
        ->name('complaints.investigation.issue-sk');
    Route::post('complaints/{complaint}/investigation/submit', [ComplaintController::class, 'transition'])
        ->defaults('action', 'Submit Investigation')
        ->defaults('stage', 'final')
        ->middleware('can:Execute Investigation')
        ->name('complaints.investigation.submit');
    Route::post('complaints/{complaint}/investigation/forward-secretary', [ComplaintController::class, 'transition'])
        ->defaults('action', 'Forward')
        ->middleware('can:Forward Investigation')
        ->name('complaints.investigation.forward-secretary');
    Route::post('complaints/{complaint}/investigation/return-team', [ComplaintController::class, 'transition'])
        ->defaults('action', 'Return')
        ->middleware('can:Forward Investigation')
        ->name('complaints.investigation.return-team');
    Route::post('complaints/{complaint}/investigation/result', [ComplaintController::class, 'saveExaminationResult'])
        ->defaults('stage', 'final')
        ->middleware('can:Execute Investigation')
        ->name('complaints.investigation.result.save');
    Route::post('complaints/{complaint}/investigation/plan', [ComplaintController::class, 'saveExaminationResult'])
        ->defaults('stage', 'plan')
        ->middleware('can:Execute Investigation')
        ->name('complaints.investigation.plan.save');
    Route::post('complaints/{complaint}/investigation/activities', [ComplaintController::class, 'storeActivity'])
        ->middleware('can:Execute Investigation')
        ->name('complaints.investigation.activities.store');
    Route::post('complaints/{complaint}/review/return', [ComplaintController::class, 'transition'])
        ->defaults('action', 'Return')
        ->middleware('can:Review Investigation')
        ->name('complaints.review.return');
    Route::post('complaints/{complaint}/review/forward', [ComplaintController::class, 'transition'])
        ->defaults('action', 'Forward')
        ->middleware('can:Review Investigation')
        ->name('complaints.review.forward');
    Route::post('complaints/{complaint}/approval/return', [ComplaintController::class, 'transition'])
        ->defaults('action', 'Return')
        ->middleware('can:Approve Recommendation')
        ->name('complaints.approval.return');
    Route::post('complaints/{complaint}/approval/approve', [ComplaintController::class, 'transition'])
        ->defaults('action', 'Complete')
        ->middleware('can:Approve Recommendation')
        ->name('complaints.approval.approve');

    Route::middleware('can:Manage Users')->group(function () {
        Route::get('users/simpeg/search', [UserController::class, 'searchSimpegUser'])->name('users.simpeg.search');
        Route::put('users/{user}/roles', [UserController::class, 'updateRoles'])->name('users.roles.update');
        Route::resource('users', UserController::class)->only(['index', 'store', 'delete']);
    });
});
