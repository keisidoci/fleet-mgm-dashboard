import type { ReactNode } from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface PermissionGuardProps {
  children: ReactNode;
  requireCreate?: boolean;
  requireEdit?: boolean;
  requireDelete?: boolean;
  requireView?: boolean;
}

export const PermissionGuard = ({
  children,
  requireCreate,
  requireEdit,
  requireDelete,
  requireView,
}: PermissionGuardProps) => {
  const permissions = usePermissions();

  if (requireCreate && !permissions.canCreate) return null;
  if (requireEdit && !permissions.canEdit) return null;
  if (requireDelete && !permissions.canDelete) return null;
  if (requireView && !permissions.canView) return null;

  return <>{children}</>;
};

