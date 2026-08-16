import { api } from "../config/api";

export const authService = {
  sendOtp: (email) =>
    api.post("/auth/send-signup-otp", { email }),

  signup: (name, email, password, otp, role = "user") =>
    api.post("/auth/signup", { name, email, password, otp, role }),

  login: (email, password) =>
    api.post("/auth/login", { email, password }),

  getMe: () => api.get("/auth/me"),

  updateMe: (data) => api.put("/auth/me", data),

  logout: () =>
    api.post("/auth/logout"),
};
