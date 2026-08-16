import { Socket, Server } from "socket.io";
import { registerNotificationHandlers } from "./notification.handler.js";
import { SocketData, ServerToClientEvents, ClientToServerEvents, InterServerEvents } from "../types.js";

type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type AppServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export const registerHandlers = (io: AppServer, socket: AppSocket) => {
  // Register domain specific handlers
  registerNotificationHandlers(io, socket);
  
  // Future handlers:
  // registerChatHandlers(io, socket);
  // registerLmsHandlers(io, socket);
};
