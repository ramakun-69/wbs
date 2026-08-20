<?php

namespace App\Models;

use App\Enums\VerificationDecision;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

#[Guarded([])]
class ComplaintVerification extends Model
{
    use HasUuids;
    public $keyType = 'string';
    public $incrementing = false;

    protected $casts = [
            'decision' => VerificationDecision::class,
            'summary' => 'encrypted',
            'note' => 'encrypted',
            'verified_at' => 'datetime',
    ];


    public function complaint()
    {
        return $this->belongsTo(Complaint::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
