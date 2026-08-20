<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;


#[Guarded([])]
class InvestigationActivity extends Model
{
    use HasUuids;
    public $keyType = 'string';
    public $incrementing = false;

    protected $casts = [
        'activity_date' => 'date',
        'description' => 'encrypted',
    ];

    public function investigation()
    {
        return $this->belongsTo(Investigation::class);
    }

    public function attachments()
    {
        return $this->hasMany(InvestigationActivityAttachment::class,'activity_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
