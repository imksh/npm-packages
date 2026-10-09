"use client";
import { ReactNode } from "react";
import SidebarHeader from "../ui/SidebarHeader";
import Sidebar from "../ui/Sidebar";
import { useUiStore } from "../../store/useUiStore";

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const { headerTitle, headerActions } = useUiStore();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <SidebarHeader title={headerTitle} actions={headerActions} />

        <main className="flex-1 h-full overflow-y-auto" data-lenis-prevent>
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
