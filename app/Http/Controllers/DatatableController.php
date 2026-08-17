<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class DatatableController extends Controller
{
    public function internalUsers(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $data =  User::with('roles:id,name')
            ->where('auth_type','sso')
            ->when($request->filled('search'), function ($q) use ($request) {
                $s = "%{$request->search}%";
                $q->where(
                    fn($q) =>
                    $q->where('name', 'like', $s)
                        ->orWhere('username', 'like', $s)
                        ->orWhere('email', 'like', $s)
                );
            })
            ->paginate($perPage);
        return response()->json([
            'data' => $data->items(),
            'total' => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page' => $data->perPage(),
        ]);
    }
}
