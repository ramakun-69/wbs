import { usePage } from "@inertiajs/react";

export function useAuth() {
    const { auth } = usePage().props;

    const roles = auth?.roles || [];
    const permissions = auth?.permissions || [];

    const hasRole = (roleName) => roles.includes(roleName);

    const hasAnyRole = (allowedRoles) =>
        roles.some((role) => allowedRoles.includes(role));

    const hasPermission = (permissionName) =>
        permissions.includes(permissionName);

    const hasAnyPermission = (allowedPermissions) =>
        allowedPermissions.some((p) => permissions.includes(p));
    const user = auth?.user || null;
    return {
        user,
        roles,
        permissions,
        hasRole,
        hasAnyRole,
        hasPermission,
        hasAnyPermission,
    };
}
