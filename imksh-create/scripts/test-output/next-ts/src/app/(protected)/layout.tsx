import React from "react";
import SidebarLayout from "../../components/layout/SidebarLayout";
import ProtectedRoute from "../../components/layout/ProtectedRoute";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarLayout>{children}</SidebarLayout>
    </ProtectedRoute>
  );
}
