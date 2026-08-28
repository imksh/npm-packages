import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
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
  const isMobile = width < 1024;
  const showSidebar = !isMobile || open;
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsx(AnimatePresence, {
        children:
          isMobile &&
          open &&
          /* @__PURE__ */ jsx(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 },
            className: "fixed inset-0 bg-base-100/40 z-40 lg:hidden",
            onClick: close,
          }),
      }),
      /* @__PURE__ */ jsx(AnimatePresence, {
        children:
          showSidebar &&
          /* @__PURE__ */ jsxs(motion.aside, {
            initial: isMobile ? { x: "-100%" } : false,
            animate: { x: 0 },
            exit: isMobile ? { x: "-100%" } : void 0,
            transition: { type: "tween", duration: 0.25, ease: "easeInOut" },
            className: `
              fixed lg:static top-0 left-0 z-50
              h-screen bg-base-200 border-r border-base-300
              flex flex-col overflow-hidden
              transition-[width] duration-300
              ${collapsed ? "w-20" : "w-[75%] md:w-[16%] md:max-w-60"}
            `,
            children: [
              /* @__PURE__ */ jsxs("div", {
                className:
                  "h-16 border-b border-base-300 flex items-center justify-between px-5",
                children: [
                  /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [
                      appConfig.app.logo
                        ? /* @__PURE__ */ jsx("img", {
                            src: appConfig.app.logo,
                            alt: "",
                            className: "w-8 h-8 rounded-lg",
                          })
                        : /* @__PURE__ */ jsx("div", {
                            className: "flex items-center",
                            children: /* @__PURE__ */ jsx("div", {
                              className:
                                "bg-primary w-8 h-8 rounded-lg flex items-center justify-center text-primary-content font-bold",
                              children: appConfig.app.name.charAt(0),
                            }),
                          }),
                      /* @__PURE__ */ jsx("h1", {
                        className: `text-xl font-black text-primary whitespace-nowrap overflow-hidden ${collapsed ? "hidden" : ""}`,
                        children: appConfig.app.name,
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsx("button", {
                    className: `btn btn-sm btn-circle btn-ghost md:hidden ${collapsed ? "hidden" : ""}`,
                    onClick: close,
                    children: /* @__PURE__ */ jsx(IoClose, { size: 20 }),
                  }),
                ],
              }),
              /* @__PURE__ */ jsx("nav", {
                className: "flex-1 overflow-y-auto p-2.5 space-y-1",
                "data-lenis-prevent": true,
                children: navigation.map((item) => {
                  const Icon = item.icon;
                  return /* @__PURE__ */ jsxs(
                    NavLink,
                    {
                      to: item.path,
                      onClick: isMobile ? close : void 0,
                      className: ({
                        isActive,
                      }) => `flex items-center gap-3 rounded-box px-4 py-3 duration-0  h-12 
                      ${isActive ? "bg-primary text-primary-content" : "hover:bg-base-300"} ${collapsed ? "justify-center px-0" : ""}`,
                      title: collapsed ? item.title : "",
                      children: [
                        /* @__PURE__ */ jsx(Icon, {
                          size: 18,
                          className: `shrink-0 ${collapsed && "mr-auto"}`,
                        }),
                        !collapsed &&
                          /* @__PURE__ */ jsx("span", {
                            className:
                              "font-medium transition-all duration-0 whitespace-nowrap",
                            children: item.title,
                          }),
                      ],
                    },
                    item.path,
                  );
                }),
              }),
              /* @__PURE__ */ jsxs("button", {
                onClick: toggleTheme,
                className: `w-full flex items-center gap-3 px-3 py-2.5 md:px-4 text-sm font-semibold transition-all duration-150 text-base-content/60 hover:text-base-content hover:bg-base-300/60 justify-between rounded-none ${collapsed ? "justify-center" : ""}`,
                title: "Toggle Theme",
                children: [
                  !collapsed &&
                    /* @__PURE__ */ jsx("span", {
                      children: theme === "dark" ? "Dark" : "Light",
                    }),
                  /* @__PURE__ */ jsx("span", {
                    className: "btn btn-xs btn-ghost btn-circle ",
                    children:
                      theme === "dark"
                        ? /* @__PURE__ */ jsx(Sun, {
                            size: 16,
                            className: "shrink-0 ",
                          })
                        : /* @__PURE__ */ jsx(Moon, {
                            size: 16,
                            className: "shrink-0",
                          }),
                  }),
                ],
              }),
              /* @__PURE__ */ jsx("div", {
                className:
                  "p-3 border-t border-base-300/50 shrink-0 flex flex-col gap-2",
                children: /* @__PURE__ */ jsxs("button", {
                  onClick: toggleCollapsed,
                  className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-base-content/60 hover:text-base-content hover:bg-base-300/60 ${collapsed ? "justify-center" : ""}`,
                  title: collapsed ? "Expand Sidebar" : "Collapse Sidebar",
                  children: [
                    collapsed
                      ? /* @__PURE__ */ jsx(ChevronRight, {
                          size: 18,
                          className: "shrink-0 mr-auto",
                        })
                      : /* @__PURE__ */ jsx(ChevronLeft, {
                          size: 18,
                          className: "shrink-0",
                        }),
                    !collapsed &&
                      /* @__PURE__ */ jsx("span", {
                        className: "truncate",
                        children: "Collapse",
                      }),
                  ],
                }),
              }),
            ],
          }),
      }),
    ],
  });
};
var sidebar_default = Sidebar;
export { sidebar_default as default };
