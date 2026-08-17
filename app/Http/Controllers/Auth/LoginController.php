<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function authenticate(LoginRequest $request): RedirectResponse
    {
        $credentials = [
            'username' => $request->string('nik')->toString(),
            'password' => $request->string('password')->toString(),
            'auth_type' => 'local',
        ];

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors(['nik' => __('auth.failed')])
                ->withInput($request->only('nik'));
        }

        $request->session()->regenerate();
        $user = $request->user();

        if (! $user->is_active) {
            Auth::logout();
            return back()->withErrors([
                'nik' => __('Akun Anda tidak aktif. Silakan hubungi administrator.'),
            ]);
        }

        $user->update(['last_login_at' => now()]);

        return redirect()->intended(route('dashboard'))
            ->with('success', __('Login berhasil.'));
    }

    public function register(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(RegisterRequest $request): RedirectResponse
    {
        $user = User::create([
            'id' => (string) Str::uuid(),
            'auth_type' => 'local',
            'username' => $request->string('nik')->toString(),
            'name' => $request->string('name')->toString(),
            'email' => $request->filled('email') ? $request->string('email')->toString() : null,
            'password' => Hash::make($request->string('password')->toString()),
            'is_active' => true,
        ]);

        $user->assignRole(Role::findOrCreate('Pelapor', 'web'));

        return redirect()->route('login')
            ->with('success', 'Registrasi berhasil. Silakan masuk ke akun Anda.');
    }

    public function logout(): RedirectResponse
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'Anda telah keluar.');
    }
}
