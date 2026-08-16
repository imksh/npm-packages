import { jsx, jsxs } from "react/jsx-runtime";
import { FiMenu } from "react-icons/fi";
import { useUiStore } from "../../store/useUiStore";
import { Breadcrumbs } from "../common/Breadcrumbs";
const SidebarHeader = ({ title = "Dashboard", actions = null }) => {
  const { toggleSidebar, breadcrumbs } = useUiStore();
  return /* @__PURE__ */ jsxs("header", {
    className:
      "sticky top-0 z-30 h-16 bg-base-200 backdrop-blur border-b border-base-200 flex items-center justify-between px-4 lg:px-6",
    children: [
      /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3",
        children: [
          /* @__PURE__ */ jsx("button", {
            onClick: toggleSidebar,
            className:
              "btn btn-square border-none bg-base-200 shadow-none text-base-content lg:hidden",
            children: /* @__PURE__ */ jsx(FiMenu, { size: 22 }),
          }),
          breadcrumbs && breadcrumbs.length > 0
            ? /* @__PURE__ */ jsx(Breadcrumbs, { items: breadcrumbs })
            : /* @__PURE__ */ jsx("h1", {
                className: "text-xl font-bold",
                children: title,
              }),
        ],
      }),
      /* @__PURE__ */ jsx("div", {
        className: "flex items-center gap-2",
        children: actions,
      }),
    ],
  });
};
var SidebarHeader_default = SidebarHeader;
export { SidebarHeader_default as default };
