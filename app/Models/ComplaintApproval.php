<?php

namespace App\Models;

use App\Enums\ApprovalDecision;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;


#[Guarded([])]
class ComplaintApproval extends Model
{
    use HasUuids;
    public $keyType = 'string';
    public $incrementing = false;

    protected $casts = [
        'decision' => ApprovalDecision::class,
        'note' => 'encrypted',
        'decided_at' => 'datetime',
    ];

    public function complaint()
    {
        return $this->belongsTo(Complaint::class);
    }

    public function decider()
    {
        return $this->belongsTo(User::class, 'decided_by');
    }
}
