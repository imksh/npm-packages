import { Platform, Alert, Linking } from "react-native";
import { isExpoGo, hasNativeModule } from "@/utils/env";
import type { Permission as RNPPermission } from "react-native-permissions";

export const RESULTS = {
  UNAVAILABLE: "unavailable",
  DENIED: "denied",
  BLOCKED: "blocked",
  GRANTED: "granted",
  LIMITED: "limited",
} as const;

export type PermissionStatus = (typeof RESULTS)[keyof typeof RESULTS];
export type Permission = RNPPermission;

export const openSettings = async (): Promise<void> => {
  try {
    await Linking.openSettings();
  } catch (e) {
    console.warn("Failed to open device settings", e);
  }
};

const getRNPModule = () => {
  if (isExpoGo() || !hasNativeModule("RNPermissions")) {
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("react-native-permissions");
  } catch {
    return null;
  }
};

export type AppPermissionType =
  | "camera"
  | "audio" // Microphone
  | "notification" // Notifications (Push)
  | "image" // Photo Library / Read External Storage
  | "file" // Write External Storage
  | "location" // Location When In Use
  | "locationAlways" // Location Always
  | "contacts" // Contacts
  | "phone" // Call Phone
  | "nearbydevice" // Bluetooth
  | "calendar"; // Calendar

class PermissionService {
  /**
   * Helper to determine the correct native Permission object based on platform
   */
  private getNativePermission(type: AppPermissionType): RNPPermission | null {
    const rnp = getRNPModule();
    if (!rnp?.PERMISSIONS) {
      return null;
    }
    const { PERMISSIONS } = rnp;

    if (Platform.OS === "ios") {
      switch (type) {
        case "camera":
          return PERMISSIONS.IOS.CAMERA;
        case "audio":
          return PERMISSIONS.IOS.MICROPHONE;
        case "image":
        case "file":
          return PERMISSIONS.IOS.PHOTO_LIBRARY;
        case "location":
          return PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
        case "locationAlways":
          return PERMISSIONS.IOS.LOCATION_ALWAYS;
        case "contacts":
          return PERMISSIONS.IOS.CONTACTS;
        case "calendar":
          return PERMISSIONS.IOS.CALENDARS;
        case "nearbydevice":
          return PERMISSIONS.IOS.BLUETOOTH;
        case "notification":
        case "phone":
        default:
          return null;
      }
    } else if (Platform.OS === "android") {
      switch (type) {
        case "camera":
          return PERMISSIONS.ANDROID.CAMERA;
        case "audio":
          return PERMISSIONS.ANDROID.RECORD_AUDIO;
        case "image":
          return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        case "file":
          return PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
        case "location":
          return PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        case "locationAlways":
          return PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;
        case "contacts":
          return PERMISSIONS.ANDROID.READ_CONTACTS;
        case "calendar":
          return PERMISSIONS.ANDROID.READ_CALENDAR;
        case "nearbydevice":
          return PERMISSIONS.ANDROID.BLUETOOTH_CONNECT;
        case "phone":
          return PERMISSIONS.ANDROID.CALL_PHONE;
        case "notification":
        default:
          return null;
      }
    }
    return null;
  }

  /**
   * Fallback for checking permissions in Expo Go using Expo APIs
   */
  private async checkExpoPermission(type: AppPermissionType): Promise<PermissionStatus> {
    try {
      if (type === "notification") {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const Notifications = require("expo-notifications");
        const { status } = await Notifications.getPermissionsAsync();
        return status === "granted" ? RESULTS.GRANTED : RESULTS.DENIED;
      }

      if (type === "location" || type === "locationAlways") {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const Location = require("expo-location");
        const { status } = await Location.getForegroundPermissionsAsync();
        return status === "granted" ? RESULTS.GRANTED : RESULTS.DENIED;
      }

      if (type === "camera" || type === "image") {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const ImagePicker = require("expo-image-picker");
        const { status } =
          type === "camera"
            ? await ImagePicker.getCameraPermissionsAsync()
            : await ImagePicker.getMediaLibraryPermissionsAsync();
        return status === "granted" ? RESULTS.GRANTED : RESULTS.DENIED;
      }
    } catch {
      return RESULTS.GRANTED;
    }

    return RESULTS.GRANTED;
  }

  /**
   * Fallback for requesting permissions in Expo Go using Expo APIs
   */
  private async requestExpoPermission(type: AppPermissionType): Promise<PermissionStatus> {
    try {
      if (type === "notification") {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const Notifications = require("expo-notifications");
        const { status } = await Notifications.requestPermissionsAsync();
        return status === "granted" ? RESULTS.GRANTED : RESULTS.DENIED;
      }

      if (type === "location" || type === "locationAlways") {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const Location = require("expo-location");
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === "granted" ? RESULTS.GRANTED : RESULTS.DENIED;
      }

      if (type === "camera" || type === "image") {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const ImagePicker = require("expo-image-picker");
        const { status } =
          type === "camera"
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();
        return status === "granted" ? RESULTS.GRANTED : RESULTS.DENIED;
      }
    } catch {
      return RESULTS.GRANTED;
    }

    return RESULTS.GRANTED;
  }

  /**
   * Check the current status of a permission without asking the user
   */
  async checkPermission(type: AppPermissionType): Promise<PermissionStatus> {
    const rnp = getRNPModule();
    if (isExpoGo() || !rnp) {
      return this.checkExpoPermission(type);
    }

    if (type === "notification") {
      try {
        const { status } = await rnp.checkNotifications();
        return status as PermissionStatus;
      } catch {
        return this.checkExpoPermission(type);
      }
    }

    const nativePerm = this.getNativePermission(type);
    if (!nativePerm) {
      return RESULTS.GRANTED;
    }

    try {
      return (await rnp.check(nativePerm)) as PermissionStatus;
    } catch (error) {
      console.error(`Error checking permission ${type}:`, error);
      return RESULTS.UNAVAILABLE;
    }
  }

  /**
   * Request a permission from the user
   */
  async requestPermission(type: AppPermissionType): Promise<PermissionStatus> {
    const rnp = getRNPModule();
    if (isExpoGo() || !rnp) {
      return this.requestExpoPermission(type);
    }

    if (type === "notification") {
      try {
        const { status } = await rnp.requestNotifications(["alert", "sound", "badge"]);
        return status as PermissionStatus;
      } catch {
        return this.requestExpoPermission(type);
      }
    }

    const nativePerm = this.getNativePermission(type);
    if (!nativePerm) {
      return RESULTS.GRANTED;
    }

    try {
      return (await rnp.request(nativePerm)) as PermissionStatus;
    } catch (error) {
      console.error(`Error requesting permission ${type}:`, error);
      return RESULTS.UNAVAILABLE;
    }
  }

  /**
   * Ensures a permission is granted. If not, requests it.
   */
  async requirePermission(type: AppPermissionType): Promise<boolean> {
    let status = await this.checkPermission(type);

    if (status === RESULTS.DENIED) {
      status = await this.requestPermission(type);
    }

    return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
  }

  /**
   * Opens the OS Settings screen for the app
   */
  async openSettings(): Promise<void> {
    return openSettings();
  }

  /**
   * Helper to show an alert and open the OS Settings screen for the app if permission is blocked
   */
  async openSettingsForApp(
    title = "Permission Required",
    message = "Please enable this permission in your device settings."
  ) {
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Open Settings",
        onPress: () => {
          openSettings();
        },
      },
    ]);
  }

  /**
   * Utility to register and fetch the Expo Push Token for this device.
   * This uses the unified PermissionService to request the notification permission.
   * NOTE: This will only return a token on physical devices.
   */
  async registerForPushNotificationsAsync(): Promise<string | null> {
    // In Expo Go on Android, FCM push notifications are not supported
    if (isExpoGo() && Platform.OS === "android") {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Device = require("expo-device");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Notifications = require("expo-notifications");

    if (!Device.isDevice) {
      return null;
    }

    const hasPermission = await this.requirePermission("notification");
    if (!hasPermission) {
      return null;
    }

    // Set channel for Android
    if (Platform.OS === "android") {
      try {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      } catch {
        // Channel setup may fail in Expo Go
      }
    }

    try {
      const projectId =
        require("../../app.json")?.expo?.extra?.eas?.projectId;

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      return tokenData.data;
    } catch (e) {
      console.warn("Failed to get push token", e);
      return null;
    }
  }
}

export const permissionService = new PermissionService();
