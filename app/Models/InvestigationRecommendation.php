<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

#[Guarded([])]
class InvestigationRecommendation extends Model
{
    use HasUuids;

    public $keyType = 'string';
    public $incrementing = false;

    protected $casts = [
        'description' => 'encrypted',
        'file_name' => 'encrypted',
        'file_path' => 'encrypted',
    ];

    public function investigation()
    {
        return $this->belongsTo(Investigation::class);
    }
}
