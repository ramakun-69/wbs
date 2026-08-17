<?php

namespace App\Traits;

use App\Exceptions\BusinessException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

trait ResponseOutput
{
    public function responseErrorValidate($validator)
    {
        return response()->json([
            'message' => __('Validation Failed').'!!',
            'data' => $validator,
        ], 422);
    }

    public function responseUnauthorized($message)
    {
        return response()->json([
            'message' => $message,
            'data' => [],
        ], 401);
    }

    public function safeExecute(callable $callback)
    {
        try {
            return $callback();
        } catch (BusinessException $e) {
            return $this->responseFailed($e->getMessage(), $this->normalizeStatus($e->getCode()));
        } catch (\Throwable $th) {
            DB::rollBack();
            $errorMessage = config('app.debug')
                ? $th->getMessage().' | '.$th->getFile().' | '.$th->getLine()
                : __('Server Error');

            return $this->responseFailed($errorMessage, $this->normalizeStatus($th->getCode()));
        }
    }

    public function safeInertiaExecute(callable $callback)
    {
        try {
            return $callback();
        } catch (ValidationException $e) {
            throw $e;
        } catch (BusinessException $e) {
            return back()->with([
                'error' => $e->getMessage(),
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            $errorMessage = config('app.debug')
                ? $th->getMessage().' | '.$th->getFile().' | '.$th->getLine()
                : __('An Unexpected Error Occurred');

            return redirect()->back()->with([
                'error' => $errorMessage,
            ]);
        }
    }

    public function responseFailed($failedMsg, int $status = 500)
    {
        return response()->json([
            'message' => $failedMsg,
        ], $status);
    }

    private function normalizeStatus(mixed $status): int
    {
        $status = filter_var($status, FILTER_VALIDATE_INT);

        return is_int($status) && $status >= 100 && $status <= 599 ? $status : 500;
    }

    public function responseSuccess($message, $data = [])
    {

        return response()->json([
            'message' => $message,
            'data' => $data,
        ], 200);
    }

    public function responseConflict()
    {
        return response()->json([
            'message' => 'Failed',
            'data' => [],
        ], 409);
    }

    public function responseNotFound($message = 'Data Not Found', $data = [])
    {
        return response()->json([
            'message' => $message,
            'data' => $data,
        ], 404);
    }
}
