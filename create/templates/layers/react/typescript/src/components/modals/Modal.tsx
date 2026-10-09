import { useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { useUiStore } from "../../store/useUiStore";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "full";
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  hideHeader?: boolean;
  className?: string;
  bodyClass?: string;
  footer?: ReactNode;
  height?: string | number;
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-7xl",
};

const Modal = ({
  open,
  onClose,
  title,
  children,
  size = "4xl",
  closeOnBackdrop = true,
  closeOnEsc = true,
  showCloseButton = true,
  hideHeader = false,
  className = "",
  bodyClass = "p-2 sm:p-4",
  footer,
  height,
}: ModalProps) => {
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

    const handleKeyDown = (e: KeyboardEvent) => {
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
          flex flex-col overflow-hidden max-h-[90vh]
          w-full
          ${sizes[size]}
          rounded-2xl
          bg-base-100
          shadow-md
          border border-base-300
          animate-in zoom-in-95 fade-in duration-200
          ${className}
        `}
        style={height ? { height } : undefined}
      >
        {/* Header */}
        {!hideHeader && (title || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-base-300 px-6 py-4 shrink-0">
            {title && <h2 className="text-lg font-bold">{title}</h2>}

            {showCloseButton && (
              <button
                className="btn btn-circle btn-sm btn-error btn-soft text-error/70 hover:text-error hover:bg-error/20 hover:shadow-sm hover:rotate-180 transition-transform duration-200"
                onClick={onClose}
              >
                <IoClose size={20} className="" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div
          className={`flex-1 min-h-0 overflow-y-auto ${bodyClass}`}
          data-lenis-prevent="true"
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-base-300 px-6 py-4 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
