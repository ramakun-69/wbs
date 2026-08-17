<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRolesRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        
        return Inertia::render('Users/Index', [
            'users' => User::query()
                ->with('roles:id,name')
                ->latest()
                ->paginate(15)
                ->withQueryString(),
            'roles' => Role::query()
                ->where('guard_name', 'web')
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function searchSimpeg(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('search', ''));

        if (mb_strlen($search) < 2) {
            return response()->json(['data' => []]);
        }

        $client = Http::acceptJson()->timeout(15);
        $token = config('services.simpeg.users_token');

        if (filled($token)) {
            $client = $client->withToken($token);
        }

        $response = $client->get(config('services.simpeg.users_url'), [
            'search' => $search,
        ]);

        if ($response->failed()) {
            report($response->toException());

            return response()->json([
                'message' => 'Daftar user SIMPEG tidak dapat diambil.',
            ], 502);
        }

        $items = $response->json('data');
        $items = is_array($items) ? $items : $response->json();
        $items = is_array($items) ? $items : [];

        $simpegIds = collect($items)
            ->map(fn ($item) => (string) ($item['id'] ?? $item['user_id'] ?? ''))
            ->filter()
            ->values();

        $existingIds = User::query()
            ->whereIn('simpeg_user_id', $simpegIds)
            ->pluck('simpeg_user_id')
            ->map(fn ($id) => (string) $id)
            ->all();

        $data = collect($items)->map(function (array $item) use ($existingIds) {
            $id = (string) ($item['id'] ?? $item['user_id'] ?? '');
            $username = $item['username'] ?? $item['nip'] ?? $item['nik'] ?? '';

            return [
                'id' => $id,
                'username' => $username,
                'name' => $item['name'] ?? $item['full_name'] ?? $username,
                'email' => $item['email'] ?? null,
                'exists' => in_array($id, $existingIds, true),
            ];
        })->values();

        return response()->json(['data' => $data]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = User::create([
            'simpeg_user_id' => $data['simpeg_user_id'],
            'auth_type' => 'sso',
            'username' => $data['username'],
            'name' => $data['name'],
            'email' => $data['email'],
            'is_active' => true,
        ]);

        return back()->with('success', __('User added successfully.'));
    }

    public function updateRoles(UpdateUserRolesRequest $request, User $user): RedirectResponse
    {
        $user->syncRoles($request->validated('roles', []));

        return back()->with('success', __('User roles updated successfully.'));
    }
}
