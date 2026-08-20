<?php

namespace App\Services\Faq;

use App\Models\Faq;
use App\Repositories\App\AppRepository;
use LaravelEasyRepository\ServiceApi;

class FaqServiceImplement extends ServiceApi implements FaqService
{
    public function __construct(private AppRepository $appRepository) {}

    public function createFaq(array $data): Faq
    {
        return $this->appRepository->insertOneModel(new Faq(), $data);
    }

    public function updateFaq(Faq $faq, array $data): Faq
    {
        $this->appRepository->updateOneModel($faq, $data);

        return $faq->refresh();
    }

    public function deleteFaq(Faq $faq): bool
    {
        return $this->appRepository->deleteOneModel($faq);
    }
}
