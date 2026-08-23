import { useAuth, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { LoadingState } from '@/components/common/LoadingState';

type Role = 'creator' | 'admin';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: Role;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded || (isSignedIn && !user)) return <LoadingState message="Vérification des accès..." />;
  if (!isSignedIn) return <Navigate to="/" replace />;

  const userRole = (user.publicMetadata as { role?: string })?.role;

  if (requiredRole === 'admin' && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'creator' && userRole !== 'creator' && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
