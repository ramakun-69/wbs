<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Guarded([])]
class ComplaintParty extends Model
{
    use HasUuids;
    public $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    protected $casts = [
        'name' => 'encrypted',
        'position' => 'encrypted',
        'institution' => 'encrypted',
        'role' => 'encrypted',
        'description' => 'encrypted',
    ];

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }
}
