import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, validateToken } from '../../utils/auth';

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
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const isLoggedIn = isAuthenticated();

  useEffect(() => {
    const validate = async () => {
      if (isLoggedIn) {
        const valid = await validateToken();
        setIsValid(valid);
      }
      setIsValidating(false);
    };

    validate();
  }, [isLoggedIn]);

  if (isValidating) {
    return <div>Loading...</div>; // Or your loading component
  }

  // If user is logged in but token is invalid, redirect to signup
  if (isLoggedIn && !isValid) {
    return <Navigate to="/SignUp" replace />;
  }

  // If user is logged in and trying to access auth pages (login/signup)
  if (isLoggedIn && isValid && !requireAuth) {
    return <Navigate to={redirectTo} replace />;
  }

  // If user is not logged in and trying to access protected pages
  if (!isLoggedIn && requireAuth) {
    return <Navigate to="/SignIn" replace />;
  }

  return <>{children}</>;
} 