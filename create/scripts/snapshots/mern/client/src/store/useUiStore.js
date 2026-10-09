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
