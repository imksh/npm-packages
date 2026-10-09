import React, { useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useUiStore } from "../../store/useUiStore";

export type SidebarModalSide = "left" | "right";

export interface SidebarModalProps {
  isOpen: boolean;
  onClose: () => void;
  side?: SidebarModalSide;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  width?: string;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  bodyClassName?: string;
  hasBackdrop?: boolean;
}

export const SidebarModal: React.FC<SidebarModalProps> = ({
  isOpen,
  onClose,
  side = "right",
  title,
  description,
  children,
  width = "w-full sm:w-[420px]",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEsc = true,
  className = "",
  header,
  footer,
  bodyClassName = "p-4 space-y-4",
  hasBackdrop = true,
}) => {
  const setModalOpen = useUiStore((state) => state.setModalOpen);

  // Sync with global UI store modal state for scroll locking
  useEffect(() => {
    if (isOpen) {
      setModalOpen(true);
      return () => {
        setModalOpen(false);
      };
    }
  }, [isOpen, setModalOpen]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  const slideVariants = {
    hidden: {
      x: side === "right" ? "100%" : "-100%",
      opacity: 0.7,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
        mass: 0.8,
      },
    },
    exit: {
      x: side === "right" ? "100%" : "-100%",
      opacity: 0.5,
      transition: {
        type: "tween",
        duration: 0.22,
        ease: "easeInOut",
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.18 } },
  };

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          {hasBackdrop && (
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => {
                if (closeOnBackdrop) onClose();
              }}
            />
          )}

          {/* Sliding Panel */}
          <div
            className={`fixed inset-y-0 ${
              side === "right" ? "right-0" : "left-0"
            } max-w-full flex`}
          >
            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`
                relative h-full flex flex-col bg-base-100 border-base-300 shadow-2xl overflow-hidden
                ${side === "right" ? "border-l" : "border-r"}
                ${width}
                ${className}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Optional Custom Header or Default Header */}
              {header ? (
                <div className="shrink-0">{header}</div>
              ) : title ? (
                <div className="flex items-center justify-between p-4 border-b border-base-300 bg-base-200/40 shrink-0">
                  <div className="flex-1 min-w-0 pr-2">
                    <h2 className="text-base font-bold text-base-content truncate">
                      {title}
                    </h2>
                    {description && (
                      <p className="text-xs text-base-content/60 truncate mt-0.5">
                        {description}
                      </p>
                    )}
                  </div>
                  {showCloseButton && (
                    <button
                      type="button"
                      className="btn btn-circle btn-sm btn-error btn-soft text-error/70 hover:text-error hover:bg-error/20 hover:shadow-sm hover:rotate-180 transition-transform duration-200"
                      onClick={onClose}
                      title="Close"
                    >
                      <IoClose size={18} />
                    </button>
                  )}
                </div>
              ) : showCloseButton ? (
                <button
                  type="button"
                  className="btn btn-circle btn-sm btn-error btn-soft text-error/70 hover:text-error hover:bg-error/20 hover:shadow-sm hover:rotate-180 transition-transform duration-200"
                  onClick={onClose}
                  title="Close"
                >
                  <IoClose size={18} />
                </button>
              ) : null}

              {/* Scrollable Body */}
              <div className={`flex-1 overflow-y-auto ${bodyClassName}`}>
                {children}
              </div>

              {/* Optional Footer */}
              {footer && (
                <div className="p-4 border-t border-base-300 bg-base-200/30 shrink-0">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== "undefined"
    ? createPortal(content, document.body)
    : null;
};

export default SidebarModal;
