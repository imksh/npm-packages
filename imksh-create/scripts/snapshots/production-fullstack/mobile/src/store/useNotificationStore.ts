import { create } from 'zustand';
import { getSocket } from '../lib/socket';
import * as Notifications from 'expo-notifications';

export interface NotificationState {
  notifications: any[];
  pushToken: string | null;
  listenForSocketEvents: () => void;
  registerForPushNotificationsAsync: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  pushToken: null,

  listenForSocketEvents: () => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('new_notification', (data) => {
      set((state) => ({ notifications: [data, ...state.notifications] }));
    });
  },

  registerForPushNotificationsAsync: async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      // Note: projectId is required for Expo Go and EAS.
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      set({ pushToken: token });
      
      // Here you would typically send the pushToken to your backend
    } catch (e) {
      console.warn("Failed to register for push notifications", e);
    }
  },

  fetchNotifications: async () => {
    // API call to fetch notifications could go here
    // e.g., const data = await api.get('/notifications');
    set({ notifications: [] });
  }
}));
