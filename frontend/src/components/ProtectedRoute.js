// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("role") === "admin"; // example role check

  return isAdmin ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
