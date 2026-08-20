<?php

namespace App\Models;

use App\Enums\ComplaintStatus;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


#[Guarded([])]
class Complaint extends Model
{
    use HasUuids;
    public $keyType = 'string';
    public $incrementing = false;
    protected $casts = [
        'title' => 'encrypted',
        'description' => 'encrypted',
        'status' => ComplaintStatus::class,
        'submitted_at' => 'datetime',
        'completed_at' => 'datetime',
    ];


    public function category(): BelongsTo
    {
        return $this->belongsTo(ComplaintCategory::class);
    }

    public function reporter()
    {
        return $this->hasOne(ComplaintReporter::class);
    }

    public function parties()
    {
        return $this->hasMany(ComplaintParty::class);
    }

    public function attachments()
    {
        return $this->hasMany(ComplaintAttachment::class);
    }

    public function statusHistories()
    {
        return $this->hasMany(ComplaintStatusHistory::class);
    }

    public function verification()
    {
        return $this->hasOne(ComplaintVerification::class);
    }

    public function investigation()
    {
        return $this->hasOne(Investigation::class);
    }

    public function approvals()
    {
        return $this->hasMany(ComplaintApproval::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
