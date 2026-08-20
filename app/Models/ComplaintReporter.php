<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


#[Guarded([])]
class ComplaintReporter extends Model
{
    use HasUuids;
    public $keyType = 'string';
    public $incrementing = false;
    protected function casts(): array
    {
        return [
            'name' => 'encrypted',
            'is_anonymous' => 'boolean',
        ];
    }

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
