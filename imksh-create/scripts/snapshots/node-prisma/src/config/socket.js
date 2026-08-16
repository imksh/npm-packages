import { Server } from "socket.io";
import logger from "../utils/logger.js";

let io;

const userSocketMap = {};

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;

    if (!userId) {
      logger.warn("No userId, disconnecting socket");
      socket.disconnect();
      return;
    }

    logger.info(`Socket connected: ${socket.id} (User: ${userId})`);

    if (!userSocketMap[userId]) {
      userSocketMap[userId] = new Set();
    }
    userSocketMap[userId].add(socket.id);

    socket.on("disconnect", (reason) => {
      if (!userId) return;
      userSocketMap[userId].delete(socket.id);
      logger.info(`Socket disconnected: ${socket.id} (Reason: ${reason})`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized yet");
  }
  return io;
};

const getReceiverSocketIds = (userId) =>
  userSocketMap[userId] ? Array.from(userSocketMap[userId]) : [];

export { io, getReceiverSocketIds, userSocketMap };

export default initializeSocket;
