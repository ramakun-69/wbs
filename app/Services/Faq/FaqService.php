<?php

namespace App\Services\Faq;

use LaravelEasyRepository\BaseService;

interface FaqService extends BaseService
{
    public function createFaq(array $data): \App\Models\Faq;
    public function updateFaq(\App\Models\Faq $faq, array $data): \App\Models\Faq;
    public function deleteFaq(\App\Models\Faq $faq): bool;
}
