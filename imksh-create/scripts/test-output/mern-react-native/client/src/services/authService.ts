import { api } from "../config/api";

export const authService = {
  sendOtp: (email: string) =>
    api.post("/auth/send-signup-otp", { email }),

  signup: (name: string, email: string, password: string, otp: string, role = "user") =>
    api.post("/auth/signup", { name, email, password, otp, role }),

  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  getMe: () => api.get("/auth/me"),

  updateMe: (data: any) => api.put("/auth/me", data),

  logout: () =>
    api.post("/auth/logout"),
};
