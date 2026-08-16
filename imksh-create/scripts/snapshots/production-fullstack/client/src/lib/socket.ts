import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5001", {
  autoConnect: false,
  withCredentials: true,
});
