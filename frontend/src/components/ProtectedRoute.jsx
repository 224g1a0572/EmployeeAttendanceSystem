import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // redirect to user dashboard based on role
    return (
      <Navigate
        to={user.role === "manager" ? "/manager/dashboard" : "/employee/dashboard"}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
