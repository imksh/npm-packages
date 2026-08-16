import { Server } from "socket.io";
import { socketAuthMiddleware } from "./middleware.js";
import { onConnection } from "./connection.js";
import { SocketData, ServerToClientEvents, ClientToServerEvents, InterServerEvents } from "./types.js";

type AppServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

let io: AppServer;

const initializeSocket = (server: import("http").Server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    },
    // To support Redis in the future, you would add the adapter here:
    // adapter: createAdapter(pubClient, subClient)
  });

  // Apply Authentication Middleware
  io.use(socketAuthMiddleware);

  // Handle Connections
  io.on("connection", (socket) => {
    onConnection(io, socket);
  });

  return io;
};

export const getIO = (): AppServer => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized yet");
  }
  return io;
};

export { io };
export default initializeSocket;
