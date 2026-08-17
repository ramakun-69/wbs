<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

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

            // Content
            'Manage Content',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        $roles = [
            'User' => [
                'Create Complaint',
                'View Own Complaint',
            ],

            'Admin WBS' => [
                'View All Complaints',
                'Register Complaint',
                'Set Complaint Priority',
                'Export Complaints',
                'Manage Support',
                'Manage Content',
            ],

            'Irban' => [
                'View All Complaints',
                'Verify Complaint',
            ],

            'Sekretaris' => [
                'View All Complaints',
                'Create Investigation',
                'Review Investigation',
            ],

            'Tim Teknis' => [
                'View Investigation',
                'Execute Investigation',
                'Submit Investigation',
            ],

            'Inspektur' => [
                'View All Complaints',
                'Approve Recommendation',
            ],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::findOrCreate($roleName, 'web');

            $role->syncPermissions($rolePermissions);
        }
    }
}
