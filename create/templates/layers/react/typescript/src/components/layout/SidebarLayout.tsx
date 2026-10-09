import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarHeader from "../ui/SidebarHeader";
import Sidebar from "../ui/Sidebar";
import { useUiStore } from "../../store/useUiStore";
import appConfig from "../../config/appConfig";

const SidebarLayout = () => {
  const { headerTitle, headerActions, setHeaderTitle, setHeaderActions } =
    useUiStore();
  const { pathname } = useLocation();

  // Layout no longer resets title on every route change.
  // Individual pages are responsible for setting their own title via useUiStore.

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <SidebarHeader title={headerTitle} actions={headerActions} />

        <main
          className="flex-1 h-full overflow-y-auto "
          data-lenis-prevent
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
