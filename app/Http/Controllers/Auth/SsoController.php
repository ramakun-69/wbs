<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Sso\SsoService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use App\Models\User;

class SsoController extends Controller
{
    public function __construct(protected SsoService $ssoService)
    {
    }

    public function redirect(Request $request)
    {
        $state = Str::random(64);
        $codeVerifier = Str::random(128);
        $codeChallenge = rtrim(strtr(base64_encode(hash('sha256', $codeVerifier, true)), '+/', '-_'), '=');

        $request->session()->put('sso.oauth', [
            'state' => $state,
            'code_verifier' => $codeVerifier,
            'redirect_uri' => route('sso.callback'),
        ]);

        $query = http_build_query(array_filter([
            'response_type' => 'code',
            'client_id' => config('services.simpeg.client_id'),
            'redirect_uri' => route('sso.callback'),
            'scope' => config('services.simpeg.scope'),
            'prompt' => config('services.simpeg.prompt'),
            'state' => $state,
            'code_challenge' => $codeChallenge,
            'code_challenge_method' => 'S256',
        ], static fn ($value) => filled($value)));

        return redirect()->away(config('services.simpeg.authorize_url').'?'.$query);
    }

    public function callback(Request $request)
    {
        $oauth = $request->session()->pull('sso.oauth');

        if (!$oauth || !hash_equals($oauth['state'], (string) $request->query('state'))) {
            return redirect()->route('login')->with('error', 'Sesi SSO tidak valid atau sudah kedaluwarsa.');
        }

        if ($request->filled('error')) {
            return redirect()->route('login')->with('error', $request->query('error_description', 'Login SSO dibatalkan.'));
        }

        if (!$request->filled('code')) {
            return redirect()->route('login')->with('error', 'Authorization code SSO tidak ditemukan.');
        }

        try {
            $tokenResponse = Http::asForm()
                ->acceptJson()
                ->timeout(15)
                ->post(config('services.simpeg.token_url'), [
                    'grant_type' => 'authorization_code',
                    'client_id' => config('services.simpeg.client_id'),
                    'client_secret' => config('services.simpeg.client_secret'),
                    'redirect_uri' => $oauth['redirect_uri'],
                    'code' => $request->query('code'),
                    'code_verifier' => $oauth['code_verifier'],
                ]);
            if ($tokenResponse->failed()) {
                report($tokenResponse->toException());
                return redirect()->route('login')->with('error', 'SIMPEG gagal memberikan access token.');
            }

            $accessToken = $tokenResponse->json('access_token');
            if (!$accessToken) {
                return redirect()->route('login')->with('error', 'Access token SIMPEG tidak ditemukan.');
            }

            $identityResponse = Http::withToken($accessToken)
                ->acceptJson()
                ->timeout(15)
                ->get(config('services.simpeg.user_url'));

            if ($identityResponse->status() === 403) {
                $simpegUserId = $identityResponse->json('simpeg_user_id');

                if ($simpegUserId) {
                    User::query()
                        ->where('simpeg_user_id', $simpegUserId)
                        ->update([
                            'is_active' => false,
                        ]);
                }

                return redirect()->route('login')->with('error', __('You do not have access to the WBS.'));
            }

            $identity = $identityResponse->json('data') ?: $identityResponse->json();
            $user = $this->ssoService->provisionUser($identity);

            if (!$user->is_active) {
                return redirect()->route('login')->with('error', 'Akun WBS Anda tidak aktif.');
            }

            Auth::login($user);
            $request->session()->regenerate();
            $user->update(['last_login_at' => now()]);

            return redirect()->intended('/dashboard');
        } catch (ConnectionException $exception) {
            report($exception);

            return redirect()->route('login')->with('error', 'SIMPEG tidak dapat dihubungi.');
        }
    }

}
