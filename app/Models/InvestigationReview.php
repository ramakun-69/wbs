<?php

namespace App\Models;

use App\Enums\InvestigationDecision;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;


#[Guarded([])]
class InvestigationReview extends Model
{
    use HasUuids;
    public $keyType = 'string';
    public $incrementing = false;

    protected $casts = [
        'decision' => InvestigationDecision::class,
        'note' => 'encrypted',
        'reviewed_at' => 'datetime',
    ];

    public function investigation()
    {
        return $this->belongsTo(Investigation::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
