import type { Permission, UserRole } from "../types";

export const getPermissions = (role: UserRole | null): Permission => {
  if (!role) {
    return {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: false,
    };
  }

  switch (role) {
    case 'admin':
      return {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canView: true,
      };
    case 'fleet_manager':
      return {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canView: true,
      };
    case 'driver':
      return {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canView: true,
      };
    default:
      return {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canView: false,
      };
  }
};

export const canAccessRoute = (role: UserRole | null, route: string): boolean => {
  if (!role) return false;

  // Admin can access everything
  if (role === 'admin') return true;

  // Fleet Manager can access most routes except admin-specific ones
  if (role === 'fleet_manager') {
    return route !== '/admin';
  }

  // Driver can only access dashboard and their own data
  if (role === 'driver') {
    return ['/dashboard', '/vehicles', '/maintenance'].includes(route);
  }

  return false;
};

