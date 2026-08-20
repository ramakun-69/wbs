<?php

namespace App\Enums;

enum InvestigationDecision : string
{
    case Forwarded = 'Forwarded';
    case Returned = 'Returned';
}
