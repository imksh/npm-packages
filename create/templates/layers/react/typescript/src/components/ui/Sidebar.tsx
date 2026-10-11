import { NavLink } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { useUiStore } from "../../store/useUiStore";
import { navigation } from "../../config/navigation";
import { Moon, Sun } from "lucide-react";
import appConfig from "../../config/appConfig";
import { motion, AnimatePresence } from "framer-motion";
import useWindowSize from "../../hooks/useWindowSize";
import { useAuthStore } from "../../store/useAuthStore";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { CiLogout } from "react-icons/ci";

const Sidebar = () => {
  const { open, close, collapsed, toggleCollapsed, theme, toggleTheme } =
    useUiStore();
  const { logout, user } = useAuthStore();
  const { width } = useWindowSize();
  const isMobile = width < 1024; // lg breakpoint

  const showSidebar = !isMobile || open;

  return (
    <>
      {/* Overlay with AnimatePresence */}
      <AnimatePresence>
        {isMobile && open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-base-100/40 z-40 lg:hidden"
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Sidebar with AnimatePresence */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            initial={isMobile ? { x: "-100%" } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: "-100%" } : undefined}
            transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
            className={`
              fixed lg:static top-0 left-0 z-50
              h-screen bg-base-200 border-r border-base-300
              flex flex-col overflow-hidden
              transition-[width] duration-300
              ${collapsed ? "w-18" : "w-[75%] md:w-[16%] md:max-w-60"}
            `}
          >
            {/* Header */}
            <div className="h-16 border-b border-base-300 flex items-center justify-between px-5">
              <div className="flex items-center gap-3">
                {appConfig.app.logo ? (
                  <img
                    src={appConfig.app.logo}
                    alt=""
                    className="w-8 h-8 rounded-lg"
                  />
                ) : (
                  <div className="flex items-center">
                    <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center text-primary-content font-bold">
                      {appConfig.app.name.charAt(0)}
                    </div>
                  </div>
                )}
                <h1
                  className={`text-xl font-black text-primary whitespace-nowrap overflow-hidden ${collapsed ? "hidden" : ""}`}
                >
                  {appConfig.app.name}
                </h1>
              </div>

              <button
                className={`btn btn-sm btn-circle btn-ghost md:hidden ${collapsed ? "hidden" : ""}`}
                onClick={close}
              >
                <IoClose size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav
              className="flex-1 overflow-y-auto p-2.5 space-y-1"
              data-lenis-prevent
            >
              {navigation
                .filter((item) => {
                  const orgRole = user?.orgRole;
                  const isUserAdmin =
                    user?.role === "ADMIN" ||
                    orgRole === "OWNER" ||
                    orgRole === "ADMIN";

                  // Check if item is hidden for this role
                  if (item.hiddenForRoles) {
                    if (
                      isUserAdmin &&
                      (item.hiddenForRoles.includes("OWNER") ||
                        item.hiddenForRoles.includes("ADMIN"))
                    ) {
                      return false;
                    }
                    if (orgRole && item.hiddenForRoles.includes(orgRole)) {
                      return false;
                    }
                  }

                  if (!item.allowedRoles) return true; // visible to all
                  // System-level ADMIN always gets full access
                  if (user?.role === "ADMIN") return true;
                  // If orgRole not yet resolved, show all items (fail open for admins)
                  if (!orgRole) return true;
                  return item.allowedRoles.includes(orgRole);
                })
                .map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={isMobile ? close : undefined}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-box px-4 py-3 duration-0  h-12 
                      ${
                        isActive
                          ? "bg-primary text-primary-content"
                          : "hover:bg-base-300"
                      } ${collapsed ? "justify-center px-0" : ""}`
                      }
                      title={collapsed ? item.title : ""}
                    >
                      <Icon
                        size={18}
                        className={`shrink-0 ${collapsed && "mr-auto"}`}
                      />

                      {!collapsed && (
                        <span className="font-medium transition-all duration-0 whitespace-nowrap">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
            </nav>

            {/* Footer with Actions */}
            <div
              className={`p-3 border-t border-base-300/50 shrink-0 flex gap-2 ${
                collapsed
                  ? "flex-col items-center justify-center"
                  : "flex-row items-center justify-between"
              }`}
            >
              <button
                onClick={() => {
                  logout();
                  close();
                }}
                className={`btn btn-sm btn-circle btn-soft btn-error ${collapsed ? "hidden" : "flex"}`}
                title="Logout"
              >
                <CiLogout size={18} />
              </button>

              <div
                className={`flex items-center gap-2 ${collapsed ? "flex-col" : ""}`}
              >
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  title="Toggle Theme"
                >
                  <div
                    className={`btn btn-sm btn-circle btn-primary btn-soft pointer-events-none ${collapsed ? "hidden" : "flex"}`}
                  >
                    {theme === "dark" ? (
                      <Sun size={16} className="shrink-0" />
                    ) : (
                      <Moon size={16} className="shrink-0" />
                    )}
                  </div>
                  {!collapsed && (
                    <span className="md:hidden font-medium text-sm text-base-content/80">
                      {theme === "dark" ? "Dark Mode" : "Light Mode"}
                    </span>
                  )}
                </button>

                <button
                  onClick={toggleCollapsed}
                  className="btn btn-sm btn-circle btn-outline border-none text-base-content/70 hover:text-base-content hover:bg-base-300/60 hidden md:flex"
                  title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                  {collapsed ? (
                    <GoSidebarExpand size={18} />
                  ) : (
                    <GoSidebarCollapse size={18} />
                  )}
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
