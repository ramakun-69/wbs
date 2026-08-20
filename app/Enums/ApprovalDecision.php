<?php

namespace App\Enums;

enum ApprovalDecision : string
{
    case Approved = 'Approved';
    case Rejected = 'Rejected';
    case Returned = 'Returned';
}
