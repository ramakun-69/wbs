<?php

namespace App\Http\Controllers;

use App\Traits\ResponseOutput;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class LocalizationController extends Controller
{
    use ResponseOutput;
    public function __invoke(Request $request)
    {
        return $this->safeExecute(function () use ($request) {
            $lang = $request->locale;
            $lang = strtolower(substr($lang, 0, 2));
            Session::put('locale', $lang);
            return $this->responseSuccess([
                'message' => __('Language changed successfully')
            ]);
        });
    }
}
