import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FaTriangleExclamation,
  FaCircleInfo,
  FaCircleCheck,
  FaCircleXmark,
} from "react-icons/fa6";

const variants: Record<
  "warning" | "error" | "success" | "info",
  { icon: any; iconBg: string; iconColor: string; button: string }
> = {
  warning: {
    icon: FaTriangleExclamation,
    iconBg: "bg-warning/15",
    iconColor: "text-warning",
    button: "btn-warning",
  },
  error: {
    icon: FaCircleXmark,
    iconBg: "bg-error/15",
    iconColor: "text-error",
    button: "btn-error",
  },
  success: {
    icon: FaCircleCheck,
    iconBg: "bg-success/15",
    iconColor: "text-success",
    button: "btn-success",
  },
  info: {
    icon: FaCircleInfo,
    iconBg: "bg-info/15",
    iconColor: "text-info",
    button: "btn-info",
  },
};

export interface ConfirmModalProps {
  open: boolean;
  variant?: "warning" | "error" | "success" | "info";
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

const ConfirmModal = ({
  open,
  variant = "warning",
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  closeOnBackdrop = true,
  closeOnEsc = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEsc, onCancel]);

  if (!open) return null;

  const style = variants[variant || "warning"];
  const Icon = style.icon;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}

      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onCancel : undefined}
      />

      {/* Modal */}

      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-base-100 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6">

          <div className="flex gap-4">

            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${style.iconBg}`}
            >
              <Icon className={`text-2xl ${style.iconColor}`} />
            </div>

            <div className="flex-1">

              <h2 className="text-xl font-bold">
                {title}
              </h2>

              <p className="mt-2 text-sm text-base-content/70 leading-relaxed">
                {message}
              </p>

            </div>

          </div>

          <div className="mt-8 flex justify-end gap-3">

            <button
              className="btn btn-ghost"
              disabled={loading}
              onClick={onCancel}
            >
              {cancelText}
            </button>

            <button
              className={`btn ${style.button}`}
              disabled={loading}
              onClick={onConfirm}
            >
              {loading && (
                <span className="loading loading-spinner loading-xs" />
              )}

              {confirmText}
            </button>

          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmModal;