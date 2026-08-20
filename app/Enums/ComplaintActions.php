<?php

namespace App\Enums;

enum ComplaintActions :string
{

    case SaveDraft = 'Save Draft';

    case Submit = 'Submit';
    case Register = 'Register';
    case Approve = 'Approve';
    case Reject = 'Reject';
    case Verify = 'Verify';
    case NotVerify = 'Not Verify';
    case IssueSK = 'Issue SK';
    case StartInvestigation = 'Start Investigation';
    case SubmitInvestigation = 'Submit Investigation';
    case Return = 'Return';
    case Forward = 'Forward';
    case Complete = 'Complete';
}
