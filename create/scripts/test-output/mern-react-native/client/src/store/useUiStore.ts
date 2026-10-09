import { create } from "zustand";
import { ReactNode } from "react";
import { BreadcrumbItem } from "../components/common/Breadcrumbs";

export interface UiState {
  open: boolean;
  collapsed: boolean;
  isMobileMenuOpened: boolean;
  headerTitle: string;
  headerActions: ReactNode;
  breadcrumbs: BreadcrumbItem[] | null;
  layoutClass: string;
  setLayoutClass: (layoutClass: string) => void;
  setHeaderTitle: (title: string) => void;
  setHeaderActions: (actions: ReactNode) => void;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[] | null) => void;
  toggleCollapsed: () => void;
  setMobileMenuOpened: (open: boolean) => void;
  toggleMobileMenuOpened: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  openSidebar: () => void;
  close: () => void;
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  open: false,
  isModalOpen: false,
  collapsed: false,
  isMobileMenuOpened: false,
  headerTitle: "Dashboard",
  headerActions: null,
  breadcrumbs: null,
  layoutClass: "",
  setLayoutClass: (layoutClass: string) => set({ layoutClass }),
  setHeaderTitle: (title: string) => set({ headerTitle: title }),
  setHeaderActions: (actions: ReactNode) => set({ headerActions: actions }),
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[] | null) => set({ breadcrumbs }),
  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),

  setMobileMenuOpened: (open) => {
    set({ isMobileMenuOpened: open });
  },
  toggleMobileMenuOpened: () => {
    set((state) => ({ isMobileMenuOpened: !state.isMobileMenuOpened }));
  },

  theme: localStorage.getItem("theme") || "light",

  setTheme: (theme) => {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("theme", theme);

    set({ theme });
  },

  toggleTheme: () => {
    const nextTheme = get().theme === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", nextTheme);

    localStorage.setItem("theme", nextTheme);

    set({ theme: nextTheme });
  },

  toggleSidebar: () =>
    set((state) => ({
      open: !state.open,
    })),

  openSidebar: () =>
    set({
      open: true,
    }),

  close: () =>
    set({
      open: false,
    }),

  setModalOpen: (open: boolean) =>
    set({
      isModalOpen: open,
    }),
}));
