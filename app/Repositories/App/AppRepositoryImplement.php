<?php

namespace App\Repositories\App;

use App\Models\App;
use Illuminate\Support\Facades\Storage;
use LaravelEasyRepository\Implementations\Eloquent;

class AppRepositoryImplement extends Eloquent implements AppRepository
{

    /**
     * Model class to be used in this repository for the common methods inside Eloquent
     * Don't remove or change $this->model variable name
     * @property Model|mixed $model;
     */
    public function insertOneModel($model, array $data)
    {
        return $model->create($data);
    }
    public function insertOneModelWithFile($model, array $data, $fileKey = null, $filePath = null, $attribute = null)
    {
        if ($fileKey && request()->hasFile($fileKey)) {
            $file = request()->file($fileKey);
            $fileName = $this->storeFile($file, $filePath);
            $data[$attribute ?? $fileKey] = $fileName;
        }
        return $model->create($data);
    }
    public function insertOneModelWithMultipleFiles($model, array $data, array $fileKeys = [], $filePath)
    {
        foreach ($fileKeys as $fileKey) {
            if (request()->hasFile($fileKey)) {
                $file = request()->file($fileKey);
                $fileName = $this->storeFile($file, $filePath);
                $data[$fileKey] = $fileName;
            }
        }
        return $model->create($data);
    }
    public function insertTwoDataInOneModel($model, $whereIn, array $array, array $data, $loopData)
    {

        $data1 = $model->whereIn($whereIn, $array)->get();
        foreach ($data1 as $d1) {
            $data[$loopData] = $d1->id;
        }
        return $model->insert($data);
    }
    public function updateOneModel($model, array $data)
    {
        return $model->update($data);
    }
    public function updateOneModelWithFile($model, array $data, $key = null, $filePath = null, $attribute = null)
    {
        $oldData = $model;
        $attribute ??= $key;
        $file = request()->file($key);

        if ($file != null) {
            if ($oldData->$attribute) {
                $this->deleteFile($oldData->$attribute);
            }
            $data[$key] = $file->store($filePath, 'public');
            $data[$attribute] = $data[$key];
            unset($data[$key]);
        } else {
            $data[$attribute] = $oldData->$attribute;
        }

        return $oldData->update($data);
    }
    public function deleteOneModel($model)
    {

        return $model->delete();
    }
    public function deleteOneModelWithFile($model, $path)
    {
        if ($path !== null) {
            $this->deleteFile($path);
        }
        return $model->delete();
    }
    public function forceDeleteOneModel($model)
    {
        $models = $model->get();
        $models->each(function ($data) {
            $data?->forceDelete();
        });
    }

    public function forceDeleteOneModelWithFile($model, $attribute)
    {
        $models = $model->get();
        $models->each(function ($data) use ($attribute) {
            $data?->forceDelete();
            if ($data->$attribute) {
                Storage::disk('public')->delete($data?->$attribute);
            }
        });
    }


    public function restore($model)
    {
        return $model->restore();
    }

    public function updateOrCreateOneModel($model, array $attributes, $values = [])
    {
        return $model->updateOrCreate($attributes, $values);
    }

    public function updateOrCreateOneModelWithFile($model, array $keys, array $data, $fileKey = null, $filePath = null)
    {
        $existing = $model->where($keys)->first();
        if ($fileKey && request()->hasFile($fileKey)) {
            if ($existing && $existing->$fileKey) {
                $this->deleteFile($existing->$fileKey);
            }
            $file = request()->file($fileKey);
            $fileName = $this->storeFile($file, $filePath);
            $data[$fileKey] = $fileName;
        }
        return $model->updateOrCreate($keys, $data);
    }

    public function insertData($model, array $data)
    {
        return $model->insert($data);
    }

    protected function deleteFile($path)
    {
        Storage::disk('public')->delete($path);
    }

    protected function storeFile($file, $filePath)
    {
        return $file->store($filePath, 'public');
    }
}
