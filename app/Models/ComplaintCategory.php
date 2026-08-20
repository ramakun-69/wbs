<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Guarded([])]
class ComplaintCategory extends Model
{
    use HasUuids;
    public $keyType = 'string';
    public $incrementing = false;
    protected $casts = [
        'is_active' => 'boolean',
    ];


 

    public function complaints(): HasMany
    {
        return $this->hasMany(Complaint::class, 'category_id');
    }
}
