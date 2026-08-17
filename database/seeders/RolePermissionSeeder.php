<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Complaint
            'Create Complaint',
            'View Own Complaint',
            'View All Complaints',
            'Register Complaint',
            'Set Complaint Priority',
            'Verify Complaint',
            'Export Complaints',

            // Investigation
            'Create Investigation',
            'View Investigation',
            'Execute Investigation',
            'Submit Investigation',
            'Review Investigation',

            // Recommendation
            'Approve Recommendation',

            // Support
            'Manage Support',
            'View Support',
            'View FAQ',
            'View Own Support',
            'Create Support',
            'Manage Users',

            // Content
            'Manage Content',
        ];

        foreach ($permissions as $permission) {
            Permission::query()->firstOrCreate(
                [
                    'name' => $permission,
                    'guard_name' => 'web',
                ],
                [
                    'id' => (string) Str::uuid(),
                ],
            );
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $roles = [
            'User' => [
                'Create Complaint',
                'View Own Complaint',
                'View Own Support',
                'Create Support',
            ],

            'Admin WBS' => [
                'View All Complaints',
                'Register Complaint',
                'Set Complaint Priority',
                'Export Complaints',
                'Manage Support',
                'View Support',
                'View FAQ',
                'Manage Users',
                'Manage Content',
            ],

            'Irban' => [
                'View All Complaints',
                'Verify Complaint',
                'View Support',
                'View FAQ',
            ],

            'Sekretaris' => [
                'View All Complaints',
                'Create Investigation',
                'Review Investigation',
                'View Support',
                'View FAQ',
            ],

            'Tim Teknis' => [
                'View Investigation',
                'Execute Investigation',
                'Submit Investigation',
                'View Support',
                'View FAQ',
            ],

            'Inspektur' => [
                'View All Complaints',
                'Approve Recommendation',
                'View Support',
                'View FAQ',
            ],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::query()->firstOrCreate(
                [
                    'name' => $roleName,
                    'guard_name' => 'web',
                ],
                [
                    'id' => (string) Str::uuid(),
                ],
            );

            $role->syncPermissions($rolePermissions);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
