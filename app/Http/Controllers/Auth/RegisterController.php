<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\Auth\AuthService;
use App\Traits\ResponseOutput;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    use ResponseOutput;
    public function __construct(
        protected AuthService $authService
    ) {}

    public function index()
    {
        return inertia('Auth/Register');
    }

    public function store(RegisterRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            $this->authService->register($data);
            return redirect()->route('login')->with('success', __('Registration successful. Please log in to your account.'));
        });
    }
}
