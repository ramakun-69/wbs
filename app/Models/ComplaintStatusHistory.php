<?php

namespace App\Models;

use App\Enums\ComplaintActions;
use App\Enums\ComplaintStatus;
use App\Models\Complaint;
use App\Models\User;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Guarded([])]
class ComplaintStatusHistory extends Model
{
    use HasUuids;
    public $keyType = 'string';
    public $incrementing = false;
    public const UPDATED_AT = null;

    protected $casts = [
        'from_status' => ComplaintStatus::class,
        'to_status' => ComplaintStatus::class,
        'action' => ComplaintActions::class,
        'note' => 'encrypted',
    ];

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
