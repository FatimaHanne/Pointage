// src/components/PrivateAdminRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateAdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('admin');
  return isAdmin ? children : <Navigate to="/connexion" />;
};

export default PrivateAdminRoute;
