import { api } from "../config/api";

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

  googleLogin: (idToken: string) => api.post("/auth/google", { idToken }),

  getMe: () => api.get("/auth/me"),

  updateMe: (data: FormData | Record<string, unknown>) => api.put("/auth/me", data),

  logout: () => api.post("/auth/logout"),
  
  genOtp: (email: string) => api.post("/auth/forgot-password-otp", { email }),

  verifyOtp: (email: string, otp: string) =>
    api.post("/auth/verify-otp", { email, otp }),

  resetPassword: (password: string) =>
    api.post("/auth/reset-password", { password }),

  changePassword: (oldPassword: string, newPassword: string) =>
    api.post("/auth/change-password", { oldPassword, newPassword }),

  savePushToken: (token: string) => api.post("/auth/push-token", { token }),
};
