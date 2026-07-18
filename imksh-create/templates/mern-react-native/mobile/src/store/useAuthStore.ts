import { create } from "zustand";
import { authService } from "../services/auth.service";
import { save, remove } from "../utils/storage";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: {
    url?: string;
    publicId?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

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
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  isCheckingAuth: true,
  error: null,

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
      if (data.token) {
        save("token", data.token);
      }
      set({
        user: data.data,
        loading: false,
      });
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
      if (data.token) {
        save("token", data.token);
      }
      set({
        user: data.data,
        loading: false,
      });
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
        _id: "demo_user_123",
        name: "Demo User",
        email: "demo@imksh.com",
        role: "admin",
      },
      loading: false,
    });
  },

  getMe: async () => {
    set({ isCheckingAuth: true });
    try {
      const { data } = await authService.getMe();
      set({ user: data.data, isCheckingAuth: false });
    } catch {
      set({ isCheckingAuth: false });
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
      remove("token");
      set({ loading: false });
    }
    set({
      user: null,
      error: null,
    });
  },
}));
