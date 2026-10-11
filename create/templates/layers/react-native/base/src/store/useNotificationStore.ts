import { create } from "zustand";
import { notificationService } from "../services/notification.service";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { getSocket } from "../services/socket.service";
import { toast } from "../utils/toast";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  url: string | null;
  isRead: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  registerForPushNotificationsAsync: () => Promise<string | undefined>;
  listenForSocketEvents: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const response = await notificationService.getNotifications();
      const notifications = response.data.data;
      const unreadCount = notifications.filter((n: AppNotification) => !n.isRead).length;
      
      set({
        notifications,
        unreadCount,
        loading: false,
      });
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to fetch notifications";
      set({
        error: message,
        loading: false,
      });
    }
  },

  markAsRead: async (id: string) => {
    try {
      // Optimistic update
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));

      await notificationService.markAsRead(id);
    } catch {
      // Revert if API fails
      get().fetchNotifications();
    }
  },

  markAllAsRead: async () => {
    try {
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));

      await notificationService.markAllAsRead();
    } catch {
      get().fetchNotifications();
    }
  },

  registerForPushNotificationsAsync: async () => {
    let token: string | undefined;

    const isExpoGo = Constants.appOwnership === "expo";
    if (isExpoGo && Platform.OS === "android") {
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Notifications = require("expo-notifications");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Device = require("expo-device");

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== "granted") {
          return;
        }
        
        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ??
          Constants.easConfig?.projectId ??
          "f9a7053c-bc16-4717-805b-560c5a35e974";

        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        
        if (token) {
          try {
            await notificationService.registerPushToken(token);
          } catch {
            // Token registration failed silently
          }
        }
      }
    } catch {
      // Notification setup failed silently
    }

    return token;
  },

  listenForSocketEvents: () => {
    const socket = getSocket();
    if (!socket) return;

    // Remove any existing listener to prevent duplicates
    socket.off("new_notification");

    socket.on("new_notification", (notification: AppNotification) => {
      const { notifications, unreadCount } = get();
      
      // Ensure we don't duplicate notifications if they were fetched via API around the same time
      const exists = notifications.find((n) => n.id === notification.id);
      if (!exists) {
        set({
          notifications: [notification, ...notifications],
          unreadCount: unreadCount + 1,
        });
        
        // Alert the user visually!
        toast.info(notification.title, notification.message);
      }
    });
  }
}));
