<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

#[Guarded([])]
class Article extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];
}
