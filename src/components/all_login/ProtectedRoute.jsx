import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * ProtectedRoute component that checks if a user is authenticated 
 * and has the required role to access a specific route.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role, isAuthenticated, isReady } = useAuth();

  // Wait for AuthProvider to restore state from localStorage
  if (!isReady) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to the login page if the user is not authenticated
    return <Navigate to="/Login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to the home page if the user doesn't have the authorized role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;