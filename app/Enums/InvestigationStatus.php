<?php

namespace App\Enums;

enum InvestigationStatus : string
{
    case WaitingSK = 'Waiting SK';
    case Active = 'Active';
    case WaitingSecretaryReview = 'Waiting Secretary Review';
    case ReturnedToTeam = 'Returned To Team';
    case WaitingInspectorApproval = 'Waiting Inspector Approval';
    case ReturnedToSecretary = 'Returned To Secretary';
    case Completed = 'Completed';
}
