// PrivateRoute.tsx
import React, { useContext } from 'react';
import { UserContext } from '../UserContext';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useContext(UserContext);
  const username = localStorage.getItem('username');


  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  // If user state is not null, render the children
  return children;
}

export default PrivateRoute;
