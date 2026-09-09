import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { canAccess, homeForRole } from './types';

export function RequireAuth() {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!canAccess(session.role, location.pathname)) {
    return <Navigate to={homeForRole(session.role)} replace />;
  }

  return <Outlet />;
}
