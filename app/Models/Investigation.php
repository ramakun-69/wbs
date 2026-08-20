<?php

namespace App\Models;

use App\Enums\InvestigationStatus;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;


#[Guarded([])]
class Investigation extends Model
{
    use HasUuids;
    public $keyType = 'string';
    public $incrementing = false;

    protected $casts = [
        'sk_date' => 'date',
        'target_completion_date' => 'date',

        'team_name' => 'encrypted',
        'team_leader_name' => 'encrypted',
        'basis' => 'encrypted',
        'review_document_path' => 'encrypted',
        'implementation_document_path' => 'encrypted',
        'review_document_path' => 'encrypted',
        'implementation_document_path' => 'encrypted',

        'findings' => 'encrypted',
        'conclusion' => 'encrypted',
        'violation_element' => 'encrypted',
        'recommendation' => 'encrypted',
        'reporter_report' => 'encrypted',
        'reporter_report' => 'encrypted',

        'status' => InvestigationStatus::class,
    ];
    public function complaint()
    {
        return $this->belongsTo(Complaint::class);
    }

    public function activities()
    {
        return $this->hasMany(InvestigationActivity::class);
    }

 

    public function reviews()
    {
        return $this->hasMany(InvestigationReview::class);
    }

    public function recommendations()
    {
        return $this->hasMany(InvestigationRecommendation::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
