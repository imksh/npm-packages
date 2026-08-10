import { Socket, Server } from "socket.io";
import logger from "../config/logger.js";
import { registerHandlers } from "./handlers/index.js";
import { getUserRoom, getInstitutionRoom } from "./rooms.js";
import { SocketEvents } from "./events.js";
import { SocketData, ServerToClientEvents, ClientToServerEvents, InterServerEvents } from "./types.js";

type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type AppServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export const onConnection = (io: AppServer, socket: AppSocket) => {
  const user = socket.data.user;

  logger.info(`Socket connected: ${socket.id} (User: ${user.id})`);

  // Auto-join user-specific room
  socket.join(getUserRoom(user.id));

  // Auto-join institution room if applicable
  if (user.institutionId) {
    socket.join(getInstitutionRoom(user.institutionId));
  }

  // Register all event handlers
  registerHandlers(io, socket);

  // Handle disconnect
  socket.on(SocketEvents.DISCONNECT, (reason) => {
    logger.info(`Socket disconnected: ${socket.id} (User: ${user.id}, Reason: ${reason})`);
  });
};
