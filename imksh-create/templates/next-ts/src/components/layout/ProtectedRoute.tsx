"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import Loading from "../common/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, isCheckingAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (role && user.role !== role) {
        router.replace("/");
      }
    }
  }, [user, loading, role, router]);

  if (loading || !user || (role && user.role !== role)) return <Loading />;

  return <>{children}</>;
};

export default ProtectedRoute;
