// src/components/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const userRole = localStorage.getItem("role");
  const location = useLocation();

  // Only allow /admin/staff for admin role
  if (location.pathname.startsWith("/admin/staff")) {
    if (userRole !== "admin") {
      return <Navigate to="/login" />;
    }
    return children;
  }

  // For other admin pages, allow staff and admin
  if (location.pathname.startsWith("/admin")) {
    if (userRole === "admin" || userRole === "staff") {
      return children;
    }
    return <Navigate to="/login" />;
  }

  // For student pages, allow only student
  if (location.pathname.startsWith("/student")) {
    if (userRole === "student") {
      return children;
    }
    return <Navigate to="/login" />;
  }

  // Default: allow
  return children;
};

export default ProtectedRoute;
