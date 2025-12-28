import { useAppSelector } from '../app/hooks';
import { getPermissions } from '../utils/permissions';

export const usePermissions = () => {
  const user = useAppSelector((state) => state.auth.user);
  return getPermissions(user?.role || null);
};

export const useUser = () => {
  return useAppSelector((state) => state.auth.user);
};

export const useIsAuthenticated = () => {
  return useAppSelector((state) => state.auth.isAuthenticated);
};

