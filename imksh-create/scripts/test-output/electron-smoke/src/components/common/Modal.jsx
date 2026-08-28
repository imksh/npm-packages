import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { useUiStore } from "../../store/useUiStore";
const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  "2xl": "max-w-4xl",
  full: "max-w-7xl",
};
const Modal = ({
  open,
  onClose,
  title,
  children,
  size = "md",
  closeOnBackdrop = true,
  closeOnEsc = true,
  showCloseButton = true,
  hideHeader = false,
  className = "",
  footer,
}) => {
  const setModalOpen = useUiStore((state) => state.setModalOpen);
  useEffect(() => {
    if (open) {
      setModalOpen(true);
      return () => {
        setModalOpen(false);
      };
    }
  }, [open, setModalOpen]);
  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeOnEsc, onClose]);
  if (!open) return null;
  return createPortal(
    /* @__PURE__ */ jsxs("div", {
      className: "fixed inset-0 z-[9999] flex items-center justify-center p-4",
      children: [
        /* @__PURE__ */ jsx("div", {
          className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
          onClick: closeOnBackdrop ? onClose : void 0,
        }),
        /* @__PURE__ */ jsxs("div", {
          className: `
          relative
          flex flex-col overflow-hidden max-h-[90vh]
          w-full
          ${sizes[size]}
          rounded-2xl
          bg-base-100
          shadow-2xl
          border border-base-300
          animate-in zoom-in-95 fade-in duration-200
          ${className}
        `,
          children: [
            !hideHeader &&
              (title || showCloseButton) &&
              /* @__PURE__ */ jsxs("div", {
                className:
                  "flex items-center justify-between border-b border-base-300 px-6 py-4 shrink-0",
                children: [
                  title &&
                    /* @__PURE__ */ jsx("h2", {
                      className: "text-lg font-bold",
                      children: title,
                    }),
                  showCloseButton &&
                    /* @__PURE__ */ jsx("button", {
                      className: "btn btn-circle btn-sm btn-ghost",
                      onClick: onClose,
                      children: /* @__PURE__ */ jsx(IoClose, { size: 20 }),
                    }),
                ],
              }),
            /* @__PURE__ */ jsx("div", {
              className: "flex-1 min-h-0 overflow-y-auto p-6",
              "data-lenis-prevent": "true",
              children,
            }),
            footer &&
              /* @__PURE__ */ jsx("div", {
                className: "border-t border-base-300 px-6 py-4 shrink-0",
                children: footer,
              }),
          ],
        }),
      ],
    }),
    document.body,
  );
};
var Modal_default = Modal;
export { Modal_default as default };
