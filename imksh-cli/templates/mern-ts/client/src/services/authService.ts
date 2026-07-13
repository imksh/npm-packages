import { api } from "../config/api";

export const authService = {
  signup: (name, email, password, role = "user") =>
    api.post("/auth/signup", { name, email, password, role }),

  login: (email, password) =>
    api.post("/auth/login", { email, password }),

  getMe: () => api.get("/auth/me"),

  updateMe: (data) => api.put("/auth/me", data),

  logout: () =>
    api.post("/auth/logout"),
};
