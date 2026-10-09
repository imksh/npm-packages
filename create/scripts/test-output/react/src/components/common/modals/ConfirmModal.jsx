import { jsx, jsxs } from "react/jsx-runtime";
import { AlertCircle, Trash2, Info } from "lucide-react";
import Modal from "../Modal";
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "danger",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: /* @__PURE__ */ jsx(Trash2, {
            size: 24,
            className: "text-error relative z-10",
          }),
          iconBg: "bg-error/10 border-error/20",
          iconGlow: "bg-error/20",
          btn: "bg-gradient-to-r from-error to-error/80 hover:from-error/90 hover:to-error text-error-content border-none shadow-[0_4px_12px_rgba(239,68,68,0.25)] hover:shadow-[0_6px_16px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 transition-all duration-300",
          border: "border-error/20",
        };
      case "warning":
        return {
          icon: /* @__PURE__ */ jsx(AlertCircle, {
            size: 24,
            className: "text-warning relative z-10",
          }),
          iconBg: "bg-warning/10 border-warning/20",
          iconGlow: "bg-warning/20",
          btn: "bg-gradient-to-r from-warning to-warning/80 hover:from-warning/90 hover:to-warning text-warning-content border-none shadow-[0_4px_12px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_16px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 transition-all duration-300",
          border: "border-warning/20",
        };
      default:
        return {
          icon: /* @__PURE__ */ jsx(Info, {
            size: 24,
            className: "text-info relative z-10",
          }),
          iconBg: "bg-info/10 border-info/20",
          iconGlow: "bg-info/20",
          btn: "bg-gradient-to-r from-info to-info/80 hover:from-info/90 hover:to-info text-info-content border-none shadow-[0_4px_12px_rgba(14,165,233,0.25)] hover:shadow-[0_6px_16px_rgba(14,165,233,0.4)] hover:-translate-y-0.5 transition-all duration-300",
          border: "border-info/20",
        };
    }
  };
  const styles = getTypeStyles();
  return /* @__PURE__ */ jsxs(Modal, {
    open: isOpen,
    onClose,
    hideHeader: true,
    size: "sm",
    className: `p-8 !max-w-md ${styles.border}`,
    children: [
      /* @__PURE__ */ jsx("div", {
        className: `absolute top-0 left-0 w-full h-1 ${styles.btn.split(" ")[0]} ${styles.btn.split(" ")[1]}`,
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col items-center text-center",
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "relative mb-5",
            children: [
              /* @__PURE__ */ jsx("div", {
                className: `absolute inset-0 rounded-full blur-xl animate-pulse-glow ${styles.iconGlow}`,
              }),
              /* @__PURE__ */ jsx("div", {
                className: `relative w-14 h-14 rounded-full flex items-center justify-center border ${styles.iconBg} shadow-inner`,
                children: styles.icon,
              }),
            ],
          }),
          /* @__PURE__ */ jsx("h3", {
            className:
              "font-bold text-2xl mb-3 text-base-content tracking-tight",
            children: title,
          }),
          /* @__PURE__ */ jsx("div", {
            className: "text-base-content/70 mb-8 leading-relaxed text-sm px-2",
            children: message,
          }),
        ],
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-center gap-4 w-full",
        children: [
          /* @__PURE__ */ jsx("button", {
            type: "button",
            className:
              "btn btn-ghost rounded-xl px-6 flex-1 hover:-translate-y-0.5 transition-all duration-300",
            onClick: () => {
              if (!isLoading) onClose();
            },
            disabled: isLoading,
            children: cancelText,
          }),
          /* @__PURE__ */ jsx("button", {
            type: "button",
            className: `btn rounded-xl px-6 flex-1 ${styles.btn}`,
            onClick: onConfirm,
            disabled: isLoading,
            children: isLoading
              ? /* @__PURE__ */ jsx("span", {
                  className: "loading loading-spinner loading-sm",
                })
              : confirmText,
          }),
        ],
      }),
    ],
  });
};
var ConfirmModal_default = ConfirmModal;
export { ConfirmModal_default as default };
