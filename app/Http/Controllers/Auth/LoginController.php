<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\Auth\AuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function __construct(
        protected AuthService $authService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function authenticate(LoginRequest $request): RedirectResponse
    {
        if (! $this->authService->authenticate($request->validated())) {
            return back()
                ->withErrors(['email' => __('auth.failed')])
                ->onlyInput('email');
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard.index'))
            ->with('success', __('Authentication Successful'));
    }

   

   

    public function logout(): RedirectResponse
    {
        $isSsoUser = Auth::user()?->auth_type === 'sso';
        $ssoLogoutUrl = config('services.simpeg.base_url'). '/oauth/logout';

        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        if ($isSsoUser && filled($ssoLogoutUrl)) {
            $query = http_build_query([
                'client_id' => config('services.simpeg.client_id'),
                'post_logout_redirect_uri' => route('login'),
            ]);

            return redirect()->away($ssoLogoutUrl.'?'.$query);
        }

        return redirect()->route('login')->with('success', __("You have logged out."));
    }
}
