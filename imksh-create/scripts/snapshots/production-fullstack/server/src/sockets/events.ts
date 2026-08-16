export const SocketEvents = {
  // Connection Events
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  // Room Events
  SUBSCRIBE: "room:subscribe",
  UNSUBSCRIBE: "room:unsubscribe",

  // Notification Events
  NOTIFICATION_NEW: "notification:new",
  NOTIFICATION_MARK_AS_READ: "notification:markAsRead",

  // Chat Events
  CHAT_NEW_MESSAGE: "chat:newMessage",
  CHAT_TYPING: "chat:typing",
  CHAT_STOP_TYPING: "chat:stopTyping",

  // LMS Events
  LMS_ASSIGNMENT_CREATED: "lms:assignmentCreated",
  LMS_GRADE_PUBLISHED: "lms:gradePublished",

  // Attendance Events
  ATTENDANCE_MARKED: "attendance:marked",
} as const;

export type SocketEvent = (typeof SocketEvents)[keyof typeof SocketEvents];
