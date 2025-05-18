import React from "react";
import { Navigate } from "react-router-dom";

const PrivateAdminRoute = ({ children }) => {
  const storedAdmin = localStorage.getItem("admin");

  if (!storedAdmin) return <Navigate to="/connexion" replace />;

  try {
    const admin = JSON.parse(storedAdmin);

    if (admin.role === "admin" || admin.role === "user") {
      return children;
    } else {
      return <Navigate to="/connexion" replace />;
    }
  } catch (error) {
    return <Navigate to="/connexion" replace />;
  }
};

export default PrivateAdminRoute;
