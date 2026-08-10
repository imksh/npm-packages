import { create } from "zustand";

export const useUiStore = create((set, get) => ({
  open: false,
  collapsed: false,
  isMobileMenuOpened: false,
  headerTitle: "Dashboard",
  headerActions: null,
  setHeaderTitle: (title) => set({ headerTitle: title }),
  setHeaderActions: (actions) => set({ headerActions: actions }),
  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),

  setMobileMenuOpened: (open) => {
    set({ isMobileMenuOpened: open });
  },
  toggleMobileMenuOpened: () => {
    set((state) => ({ isMobileMenuOpened: !state.isMobileMenuOpened }));
  },

  theme: typeof window !== "undefined" ? localStorage.getItem("theme") || "light" : "light",

  setTheme: (theme) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }

    set({ theme });
  },

  toggleTheme: () => {
    const nextTheme = get().theme === "light" ? "dark" : "light";

    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", nextTheme);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", nextTheme);
    }

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
