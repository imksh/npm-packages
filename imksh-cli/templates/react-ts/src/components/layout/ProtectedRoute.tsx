import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import Loading from "../common/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <Loading />;

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
