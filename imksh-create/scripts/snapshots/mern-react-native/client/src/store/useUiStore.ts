import { create } from "zustand";
import { ReactNode } from "react";

export interface UiState {
  open: boolean;
  collapsed: boolean;
  isMobileMenuOpened: boolean;
  headerTitle: string;
  headerActions: ReactNode;
  setHeaderTitle: (title: string) => void;
  setHeaderActions: (actions: ReactNode) => void;
  toggleCollapsed: () => void;
  setMobileMenuOpened: (open: boolean) => void;
  toggleMobileMenuOpened: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  openSidebar: () => void;
  close: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  open: false,
  collapsed: false,
  isMobileMenuOpened: false,
  headerTitle: "Dashboard",
  headerActions: null,
  setHeaderTitle: (title: string) => set({ headerTitle: title }),
  setHeaderActions: (actions: ReactNode) => set({ headerActions: actions }),
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
}));
