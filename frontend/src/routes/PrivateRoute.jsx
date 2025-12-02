import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/authProvider';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mientras se revisa el token, no redirigir
  if (isLoading) {
    return <div>Cargando...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;