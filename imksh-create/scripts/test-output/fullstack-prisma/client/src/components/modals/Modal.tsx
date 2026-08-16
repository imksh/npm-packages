import { useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
}

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
  footer,
}: ModalProps) => {
  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () =>
      document.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEsc, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className={`
          relative
          w-full
          ${sizes[size]}
          rounded-2xl
          bg-base-100
          shadow-2xl
          border border-base-300
          animate-in zoom-in-95 fade-in duration-200
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-300 px-6 py-4">
          <h2 className="text-lg font-bold">{title}</h2>

          {showCloseButton && (
            <button
              className="btn btn-circle btn-sm btn-ghost"
              onClick={onClose}
            >
              <IoClose size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-base-300 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;