import { api } from "../../../lib/axios";

export const authService = {
  sendOtp: (email: string) => api.post("/auth/send-signup-otp", { email }),

  signup: (
    name: string,
    email: string,
    password: string,
    otp: string,
    role = "user",
  ) => api.post("/auth/signup", { name, email, password, otp, role }),

  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  getMe: () => api.get("/auth/me"),

  updateMe: (data: any) => api.put("/auth/me", data),

  logout: () => api.post("/auth/logout"),

  savePushToken: (token: string) => api.post("/auth/push-token", { token }),

  genOtp: (email: string) => api.post("/auth/forgot-password/otp", { email }),

  verifyOtp: (email: string, otp: string) =>
    api.post("/auth/forgot-password/verify-otp", { email, otp }),

  resetPassword: (newPassword: string) =>
    api.post("/auth/reset-password", { newPassword }),

  changePassword: (oldPassword: string, newPassword: string) =>
    api.post("/auth/change-password", { oldPassword, newPassword }),
};
