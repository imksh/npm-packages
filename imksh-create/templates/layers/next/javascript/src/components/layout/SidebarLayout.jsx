"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import SidebarHeader from "../ui/SidebarHeader";
import Sidebar from "../ui/sidebar";
import { useUiStore } from "../../store/useUiStore";
import appConfig from "../../config/appConfig";

const SidebarLayout = ({ children }) => {
  const { headerTitle, headerActions, setHeaderTitle, setHeaderActions } =
    useUiStore();
  const pathname = usePathname();

  // Reset header title and actions whenever the route shifts
  useEffect(() => {
    setHeaderTitle(appConfig.app.name);
    setHeaderActions(null);
  }, [pathname, setHeaderTitle, setHeaderActions]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <SidebarHeader title={headerTitle} actions={headerActions} />

        <main
          className="flex-1 h-full overflow-y-auto px-2 py-6 md:p-6 max-w-7xl"
          data-lenis-prevent
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
