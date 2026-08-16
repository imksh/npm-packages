"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { useUiStore } from "../../store/useUiStore";
import { navigation } from "../../config/navigation";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import appConfig from "../../config/appConfig";
import { motion, AnimatePresence } from "framer-motion";
import useWindowSize from "../../hooks/useWindowSize";

const Sidebar = () => {
  const { open, close, collapsed, toggleCollapsed } = useUiStore();
  const { theme, toggleTheme } = useUiStore();
  const { width } = useWindowSize();
  const pathname = usePathname();
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
              ${collapsed ? "w-20" : "w-[75%] md:w-[16%] md:max-w-60"}
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
            <nav className="flex-1 overflow-y-auto p-2.5 space-y-1" data-lenis-prevent>
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={isMobile ? close : undefined}
                    className={`flex items-center gap-3 rounded-box px-4 py-3 transition-all h-12 
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
                      <span className="font-medium transition-all duration-300">
                        {item.title}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Footer with Collapse Button */}
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center gap-3 px-3 py-2.5 md:px-4 text-sm font-semibold transition-all duration-150 text-base-content/60 hover:text-base-content hover:bg-base-300/60 justify-between rounded-none ${collapsed ? "justify-center" : ""}`}
              title="Toggle Theme"
            >
              {!collapsed && <span>{theme === "dark" ? "Dark" : "Light"}</span>}
              <span className="btn btn-xs btn-ghost btn-circle ">
                {theme === "dark" ? (
                  <Sun size={16} className="shrink-0 " />
                ) : (
                  <Moon size={16} className="shrink-0" />
                )}
              </span>
            </button>
            <div className="p-3 border-t border-base-300/50 shrink-0 flex flex-col gap-2">
              <button
                onClick={toggleCollapsed}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-base-content/60 hover:text-base-content hover:bg-base-300/60 ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {collapsed ? (
                  <ChevronRight size={18} className="shrink-0 mr-auto" />
                ) : (
                  <ChevronLeft size={18} className="shrink-0" />
                )}
                {!collapsed && <span className="truncate">Collapse</span>}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
