import { create } from "zustand";
import { authService } from "../services/auth.service";
import { save, remove, get } from "../utils/storage";
import { User } from "../types/auth.type";
import { initializeSocket, disconnectSocket } from "../services/socket.service";
import { useNotificationStore } from "./useNotificationStore";

// ── Module-level prefetch ──────────────────────────────────────────────────
// Kick off the AsyncStorage read the instant this module is imported
// (before any React component mounts). By the time loadCachedUser() is
// called from a useEffect, the promise is already resolved or very close.
const _prefetchedUser: Promise<User | null> = get("user");

export interface AuthState {
  user: User | null;
  loading: boolean;
  isCheckingAuth: boolean;
  error: string | null;
  sendOtp: (email: string) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
    otp: string,
    role?: string,
  ) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  demoLogin: () => Promise<void>;
  getMe: () => Promise<void>;
  updateProfile: (updates: Partial<User> | FormData) => Promise<boolean>;
  logout: () => Promise<void>;
  genOtp: (email: string) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  resetPassword: (newPassword: string) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  setUser: (user: User) => void;
  clearError: () => void;
  loadCachedUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  isCheckingAuth: true,
  error: null,

  setUser: (user: User) => set({ user }),

  clearError: () => set({ error: null }),

  loadCachedUser: async () => {
    // Await the already-in-flight prefetch — typically resolves in <1ms here
    const cached = await _prefetchedUser;
    if (cached) {
      set({ user: cached, isCheckingAuth: false });
      // Re-establish socket + push on app resume with a cached session
      initializeSocket();
      const notifStore = useNotificationStore.getState();
      notifStore.listenForSocketEvents();
      notifStore.registerForPushNotificationsAsync();
      notifStore.fetchNotifications();
    } else {
      // No cache — mark auth check done so routing doesn't hang
      set({ isCheckingAuth: false });
    }
  },

  sendOtp: async (email: string) => {
    set({ loading: true, error: null });
    try {
      await authService.sendOtp(email);
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  signup: async (
    name: string,
    email: string,
    password: string,
    otp: string,
    role = "user",
  ) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authService.signup(
        name,
        email,
        password,
        otp,
        role,
      );
      if (data.data?.token) {
        save("token", data.data.token);
      }
      const user = data.data?.user;
      if (user) save("user", user);
      set({
        user,
        loading: false,
      });
      // Initialise socket + push after signup
      initializeSocket();
      const notifStore = useNotificationStore.getState();
      notifStore.listenForSocketEvents();
      notifStore.registerForPushNotificationsAsync();
      notifStore.fetchNotifications();
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authService.login(email, password);
      if (data.data?.token) {
        save("token", data.data.token);
      }
      const user = data.data?.user;
      if (user) save("user", user);
      set({
        user,
        loading: false,
      });
      // Initialise socket + push after login
      initializeSocket();
      const notifStore = useNotificationStore.getState();
      notifStore.listenForSocketEvents();
      notifStore.registerForPushNotificationsAsync();
      notifStore.fetchNotifications();
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  demoLogin: async () => {
    set({ loading: true, error: null });
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    save("token", "demo-token-123");
    set({
      user: {
        id: "demo_user_123",
        name: "Demo User",
        email: "demo@imksh.com",
        role: "admin",
      },
      loading: false,
    });
  },

  getMe: async () => {
    try {
      const { data } = await authService.getMe();
      const user = data.data;
      // Always update cache with fresh server data
      if (user) save("user", user);
      set({ user, isCheckingAuth: false });
      // Network failed — cached user (already loaded) stays in place
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  updateProfile: async (updates: Partial<User> | FormData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authService.updateMe(updates);
      set({ user: data.data, loading: false });
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // ignore errors — cookie may already be expired
    } finally {
      await remove("token");
      await remove("user");   // clear cached user on logout
      disconnectSocket();
      set({ loading: false });
    }
    set({
      user: null,
      error: null,
    });
  },

  genOtp: async (email: string) => {
    set({ loading: true, error: null });
    try {
      await authService.genOtp(email);
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  verifyOtp: async (email: string, otp: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authService.verifyOtp(email, otp);
      if (data.token) save("token", data.token);
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (newPassword: string) => {
    set({ loading: true, error: null });
    try {
      await authService.resetPassword(newPassword);
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    set({ loading: true, error: null });
    try {
      await authService.changePassword(oldPassword, newPassword);
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
