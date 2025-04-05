import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'ta' | 'nta')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { userRole, isAuthenticated } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: Checking access', { userRole, isAuthenticated, allowedRoles });

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    console.log('ProtectedRoute: Not authorized, redirecting based on role');
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admindashboard" replace />;
      case 'ta':
        return <Navigate to="/tadashboard" replace />;
      case 'nta':
        return <Navigate to="/nonverifiedtadashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  console.log('ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute; 