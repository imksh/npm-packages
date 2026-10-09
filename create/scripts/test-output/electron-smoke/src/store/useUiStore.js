import { create } from "zustand";

const useUiStore = create((set, get) => ({
  open: false,
  isModalOpen: false,
  collapsed: false,
  isMobileMenuOpened: false,
  headerTitle: "Dashboard",
  headerActions: null,
  breadcrumbs: null,
  layoutClass: "",

  // ── Layout helpers ──────────────────────────────────────────────────────────
  setLayoutClass: (layoutClass) => set({ layoutClass }),
  setHeaderTitle: (title) => set({ headerTitle: title }),
  setHeaderActions: (actions) => set({ headerActions: actions }),
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

  // ── Sidebar ─────────────────────────────────────────────────────────────────
  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
  setMobileMenuOpened: (open) => set({ isMobileMenuOpened: open }),
  toggleMobileMenuOpened: () =>
    set((state) => ({ isMobileMenuOpened: !state.isMobileMenuOpened })),
  toggleSidebar: () => set((state) => ({ open: !state.open })),
  openSidebar: () => set({ open: true }),
  close: () => set({ open: false }),

  // ── Modal ───────────────────────────────────────────────────────────────────
  setModalOpen: (open) => set({ isModalOpen: open }),

  // ── Theme ───────────────────────────────────────────────────────────────────
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

  // ── Electron window state ───────────────────────────────────────────────────
  windowMaximized: false,
  setWindowMaximized: (value) => set({ windowMaximized: value }),

  /** Minimize the Electron window (no-op in browser) */
  minimizeWindow: () => window.electronAPI?.minimize(),

  /** Toggle maximize / restore the Electron window (no-op in browser) */
  maximizeWindow: () => window.electronAPI?.maximize(),

  /** Close the Electron window (no-op in browser) */
  closeWindow: () => window.electronAPI?.close(),
}));

export { useUiStore };
