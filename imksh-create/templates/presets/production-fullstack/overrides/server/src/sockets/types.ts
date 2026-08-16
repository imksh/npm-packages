import { SocketEvents } from "./events.js";

// Basic user info injected into socket.data by the auth middleware
export interface SocketUser {
  id: string;
  roles?: { role: { name: string } }[] | unknown;
  institutionId?: string | null;
}

export interface SocketData {
  user: SocketUser;
}

export interface ServerToClientEvents {
  [SocketEvents.NOTIFICATION_NEW]: (payload: unknown) => void;
  [SocketEvents.CHAT_NEW_MESSAGE]: (payload: unknown) => void;
  [SocketEvents.LMS_ASSIGNMENT_CREATED]: (payload: unknown) => void;
  [SocketEvents.ATTENDANCE_MARKED]: (payload: unknown) => void;
}

export interface ClientToServerEvents {
  [SocketEvents.SUBSCRIBE]: (payload: { topic: string }) => void;
  [SocketEvents.UNSUBSCRIBE]: (payload: { topic: string }) => void;
  [SocketEvents.NOTIFICATION_MARK_AS_READ]: (
    payload: { notificationId: string },
    callback: (response: { success: boolean; notificationId?: string; error?: string }) => void
  ) => void;
}

export interface InterServerEvents {
  ping: () => void;
}
