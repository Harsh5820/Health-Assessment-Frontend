import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ user, roleRequired, children }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roleRequired && user.role !== roleRequired) {
    // Redirect based on role if they try to access unauthorized route
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />;
  }

  return children;
};

export default PrivateRoute;
