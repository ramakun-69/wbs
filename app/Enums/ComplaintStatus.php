<?php

namespace App\Enums;

enum ComplaintStatus : string
{
    case Draft = 'Draft';
    case Submitted = 'Submitted';
    case WaitingAdminReview = 'Waiting Admin Review';
    case Rejected = 'Rejected';
    case WaitingIrbanVerification = 'Waiting Irban Verification';
    case NotVerified = 'Not Verified';
    case WaitingSK = 'Waiting SK';
    case Investigation = 'Investigation';
    case WaitingIrbanReview = 'Waiting Irban Review';
    case WaitingSecretaryReview = 'Waiting Secretary Review';
    case WaitingInspectorApproval = 'Waiting Inspector Approval';
    case Completed = 'Completed';
}
