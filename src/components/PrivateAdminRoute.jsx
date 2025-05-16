import React from "react";
import { Navigate } from "react-router-dom";

const PrivateAdminRoute = ({ children }) => {
  const storedAdmin = localStorage.getItem("admin");
  if (!storedAdmin) return <Navigate to="/connexion" />;

  try {
    const admin = JSON.parse(storedAdmin);

    // Vérifie si le rôle est admin OU user
    if (admin.role === "admin" || admin.role === "user") {
      return children;
    } else {
      return <Navigate to="/connexion" />;
    }
  } catch (error) {
    // Si JSON invalide, renvoyer à la connexion
    return <Navigate to="/connexion" />;
  }
};

export default PrivateAdminRoute;
