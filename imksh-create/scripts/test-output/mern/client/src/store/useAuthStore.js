import { create } from "zustand";
import { authService } from "../services/authService";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  isCheckingAuth: true,
  error: null,

  sendOtp: async (email) => {
    set({ loading: true, error: null });
    try {
      await authService.sendOtp(email);
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  signup: async (name, email, password, otp, role = "user") => {
    set({ loading: true, error: null });
    try {
      const { data } = await authService.signup(name, email, password, otp, role);
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      set({
        user: data.data,
        loading: false,
      });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authService.login(email, password);
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      set({
        user: data.data,
        loading: false,
      });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getMe: async () => {
    set({ isCheckingAuth: true });
    try {
      const { data } = await authService.getMe();
      set({ user: data.data, isCheckingAuth: false });
    } catch (err) {
      set({ isCheckingAuth: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  updateProfile: async (updates) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authService.updateMe(updates);
      set({ user: data.data, loading: false });
      return true;
    } catch (err) {
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
    } catch (_) {
      // ignore errors — cookie may already be expired
    } finally {
      localStorage.removeItem("token");
      set({ loading: false });
    }
    set({
      user: null,
      error: null,
    });
  },
}));
