// components/ProtectedRoute.tsx
import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../service/authService';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
