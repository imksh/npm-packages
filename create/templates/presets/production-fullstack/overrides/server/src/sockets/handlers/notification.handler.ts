import { Socket, Server } from "socket.io";
import logger from "../../config/logger.js";
import { SocketEvents } from "../events.js";
import { SocketData, ServerToClientEvents, ClientToServerEvents, InterServerEvents } from "../types.js";

type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type AppServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export const registerNotificationHandlers = (_io: AppServer, socket: AppSocket) => {
  socket.on(SocketEvents.NOTIFICATION_MARK_AS_READ, (payload, callback) => {
    try {
      const { notificationId } = payload;
      logger.info(`Notification marked as read: ${notificationId} by user ${socket.data.user.id}`);
      
      if (typeof callback === "function") {
        callback({ success: true, notificationId });
      }
    } catch (error) {
      logger.error("Error in notification:markAsRead handler", error);
      if (typeof callback === "function") {
        callback({ success: false, error: "Failed to mark as read" });
      }
    }
  });

  socket.on(SocketEvents.SUBSCRIBE, (payload) => {
    if (payload?.topic) {
      socket.join(`topic:${payload.topic}`);
      logger.info(`User ${socket.data.user.id} subscribed to topic: ${payload.topic}`);
    }
  });

  socket.on(SocketEvents.UNSUBSCRIBE, (payload) => {
    if (payload?.topic) {
      socket.leave(`topic:${payload.topic}`);
      logger.info(`User ${socket.data.user.id} unsubscribed from topic: ${payload.topic}`);
    }
  });
};
