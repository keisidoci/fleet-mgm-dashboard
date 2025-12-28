import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated, useUser } from '../hooks/usePermissions';
import { canAccessRoute } from '../utils/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'fleet_manager' | 'driver';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    if (!canAccessRoute(user?.role || null, location.pathname)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

