import { create } from "zustand";

interface UiState {
  // Sidebar
  open: boolean;
  collapsed: boolean;
  isMobileMenuOpened: boolean;

  // Modal
  isModalOpen: boolean;

  // Header
  headerTitle: string;
  headerActions: React.ReactNode | null;
  breadcrumbs: React.ReactNode | null;
  layoutClass: string;

  // Theme
  theme: string;

  // Electron window
  windowMaximized: boolean;

  // Actions
  setLayoutClass: (layoutClass: string) => void;
  setHeaderTitle: (title: string) => void;
  setHeaderActions: (actions: React.ReactNode | null) => void;
  setBreadcrumbs: (breadcrumbs: React.ReactNode | null) => void;
  toggleCollapsed: () => void;
  setMobileMenuOpened: (open: boolean) => void;
  toggleMobileMenuOpened: () => void;
  toggleSidebar: () => void;
  openSidebar: () => void;
  close: () => void;
  setModalOpen: (open: boolean) => void;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;

  // Electron window controls
  setWindowMaximized: (value: boolean) => void;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
}

const useUiStore = create<UiState>((set, get) => ({
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
  minimizeWindow: () => window.electronAPI?.minimize(),
  maximizeWindow: () => window.electronAPI?.maximize(),
  closeWindow:    () => window.electronAPI?.close(),
}));

export { useUiStore };
export type { UiState };
