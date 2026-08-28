import React, { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export interface TabItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "underline" | "box";
  className?: string;
  dropdown?: boolean;
}

export const Tabs = ({
  tabs,
  activeTab,
  onChange,
  variant = "underline",
  className = "",
  dropdown = false,
}: TabsProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Close dropdown if user clicks outside
  React.useEffect(() => {
    if (!dropdown || !isOpen) return;
    const closeMenu = () => setIsOpen(false);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [dropdown, isOpen]);

  const renderDropdown = () => {
    if (!dropdown) return null;
    const activeItem = tabs.find((t) => t.id === activeTab);
    return (
      <div className="relative md:hidden w-full max-w-xs z-[50]" onClick={(e) => e.stopPropagation()}>
        {/* Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-sm bg-base-200 border-base-300 border flex w-full items-center justify-between px-3 text-base-content "
        >
          <div className="flex items-center gap-1.5">
            {activeItem?.icon}
            <span className="font-semibold">{activeItem?.label}</span>
          </div>
          <ChevronDown size={14} className={`opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-base-100 border border-base-200 shadow rounded-lg py-1 animate-in fade-in slide-in-from-top-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onChange(tab.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-base-200 text-base-content/80"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (variant === "box") {
    return (
      <>
        {renderDropdown()}
        <div
          className={`tabs tabs-boxed bg-base-200 p-1 flex-nowrap overflow-x-auto hide-scrollbar shrink-0 rounded-lg ${dropdown ? "hidden md:flex" : "flex"} ${className}`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`tab whitespace-nowrap flex items-center rounded-lg gap-2 relative z-0 ${
                activeTab === tab.id
                  ? "text-primary-content"
                  : "text-base-content/70 hover:text-base-content"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabBox"
                  className="absolute inset-0 bg-primary rounded-lg -z-10"
                  transition={{ type: "spring", duration: 0, bounce: 0.2 }}
                />
              )}
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </>
    );
  }

  // default: underline
  return (
    <>
      {renderDropdown()}
      <div
        className={`tabs tabs-bordered ${dropdown ? "hidden md:flex" : "flex"} ${className}`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`tab whitespace-nowrap relative !border-transparent ${
              activeTab === tab.id
                ? "font-semibold text-primary"
                : "text-base-content/70 hover:text-base-content"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              />
            )}
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    </>
  );
};
