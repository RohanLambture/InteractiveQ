import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

interface AuthRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthRoute({ 
  children, 
  requireAuth = false, 
  redirectTo = '/dashboard' 
}: AuthRouteProps) {
  const isLoggedIn = isAuthenticated();

  // If user is logged in and trying to access auth pages (login/signup)
  if (isLoggedIn && !requireAuth) {
    return <Navigate to={redirectTo} replace />;
  }

  // If user is not logged in and trying to access protected pages
  if (!isLoggedIn && requireAuth) {
    return <Navigate to="/SignIn" replace />;
  }

  return <>{children}</>;
} 