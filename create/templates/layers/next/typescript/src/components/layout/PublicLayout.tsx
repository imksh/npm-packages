"use client";
import { ReactNode } from "react";

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {children}
    </div>
  );
};

export default PublicLayout;
