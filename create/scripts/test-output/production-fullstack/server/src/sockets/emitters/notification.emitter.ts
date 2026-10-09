import { getIO } from "../index.js";
import { getUserRoom } from "../rooms.js";
import { SocketEvents } from "../events.js";
import logger from "../../config/logger.js";

/**
 * Emits a new notification to a specific user.
 * This is meant to be called from business logic services.
 */
export const emitNewNotification = (userId: string, payload: unknown) => {
  try {
    const io = getIO();
    io.to(getUserRoom(userId)).emit(SocketEvents.NOTIFICATION_NEW, payload);
  } catch (error) {
    logger.error(`Failed to emit notification to user ${userId}`, error);
  }
};
