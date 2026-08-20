<?php

namespace Database\Seeders;

use App\Models\ComplaintCategory;
use Illuminate\Database\Seeder;

class ComplaintCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'code' => 'CORRUPTION',
                'name' => 'Corruption',
                'description' => 'Reports related to corruption, bribery, or gratification.',
                'sort_order' => 1,
            ],
            [
                'code' => 'FRAUD',
                'name' => 'Fraud',
                'description' => 'Reports related to fraud, falsification, or financial irregularities.',
                'sort_order' => 2,
            ],
            [
                'code' => 'ABUSE_OF_AUTHORITY',
                'name' => 'Abuse of Authority',
                'description' => 'Reports related to abuse or misuse of authority.',
                'sort_order' => 3,
            ],
            [
                'code' => 'CONFLICT_OF_INTEREST',
                'name' => 'Conflict of Interest',
                'description' => 'Reports related to undisclosed or improper conflicts of interest.',
                'sort_order' => 4,
            ],
            [
                'code' => 'PROCUREMENT_VIOLATION',
                'name' => 'Procurement Violation',
                'description' => 'Reports related to violations in procurement processes.',
                'sort_order' => 5,
            ],
            [
                'code' => 'DISCIPLINARY_VIOLATION',
                'name' => 'Disciplinary Violation',
                'description' => 'Reports related to disciplinary or code of conduct violations.',
                'sort_order' => 6,
            ],
            [
                'code' => 'OTHER',
                'name' => 'Other',
                'description' => 'Reports that do not belong to the listed categories.',
                'sort_order' => 99,
            ],
        ];

        foreach ($categories as $category) {
            ComplaintCategory::query()->updateOrCreate(
                ['code' => $category['code']],
                [
                    'name' => $category['name'],
                    'description' => $category['description'],
                    'sort_order' => $category['sort_order'],
                    'is_active' => true,
                ],
            );
        }
    }
}
