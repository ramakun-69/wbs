<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRolesRequest;
use App\Models\Role;
use App\Models\User;
use App\Services\Sso\SsoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class UserController extends Controller
{
    public function __construct(
        private SsoService $ssoService,
    ) {
    }

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

    public function searchSimpegUser(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('search', ''));

        try {
            $items = $this->ssoService->searchUsers($search);
        } catch (Throwable $exception) {
            report($exception);
            return response()->json([
                'message' => $exception->getMessage(),
            ], 502);
        }

        $simpegIds = collect($items)
            ->map(fn (array $item) => (string) (
                $item['id'] ??
                $item['user_id'] ??
                ''
            ))
            ->filter()
            ->values();

        $existingIds = User::query()
            ->whereIn('simpeg_user_id', $simpegIds)
            ->pluck('simpeg_user_id')
            ->map(fn ($id) => (string) $id)
            ->all();

        $data = collect($items)
            ->map(function (array $item) use ($existingIds) {
                $id = (string) ($item['id'] ?? "");
                $username = $item['username'] ??  $item['nip'];
                return [
                    'id' => $id,
                    'username' => $username,
                    'name' => $item['name'] ?? '',
                    'email' => $item['email'] ?? null,
                    'exists' => in_array($id, $existingIds, true),
                ];
            })
            ->values();

        return response()->json(['data' => $data]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        try {
            $this->ssoService->registerUser($data);
        } catch (Throwable $exception) {
            report($exception);

            throw ValidationException::withMessages([
                'simpeg_user_id' => __(
                    'Application access could not be assigned.'
                ),
            ]);
        }

        return back()->with('success', __('User added successfully.'));
    }

    public function updateRoles(UpdateUserRolesRequest $request, User $user): RedirectResponse
    {
        $user->syncRoles($request->validated('roles', []));

        return back()->with('success', __('User roles updated successfully.'));
    }
}
