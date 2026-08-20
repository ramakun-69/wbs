<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;


#[Guarded([])]
class InvestigationActivityAttachment extends Model
{
    use HasUuids;
    public $keyType = 'string';
    public $incrementing = false;

    protected $casts = [
        'file_name' => 'encrypted',
        'file_path' => 'encrypted',
    ];

    public function activity()
    {
        return $this->belongsTo(InvestigationActivity::class, 'activity_id');
    }
}
