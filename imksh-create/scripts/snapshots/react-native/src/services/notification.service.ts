import {api} from "../config/api";

export const notificationService = {
  getNotifications: () => {
    return api.get("/notifications");
  },

  markAsRead: (id: string) => {
    return api.put(`/notifications/${id}/read`);
  },

  markAllAsRead: () => {
    return api.put("/notifications/read-all");
  },

  registerPushToken: (token: string) => {
    return api.post("/notifications/push-token", { token });
  },
  sendCustomNotification: (tenantId: string, title: string, message: string) => {
    return api.post("/notifications/send-custom", { tenantId, title, message });
  },
};
