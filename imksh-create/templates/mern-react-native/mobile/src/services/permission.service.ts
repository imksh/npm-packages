import { Platform, Alert } from "react-native";
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
  PermissionStatus,
  openSettings,
} from "react-native-permissions";

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
  private getNativePermission(type: AppPermissionType): Permission | null {
    if (Platform.OS === "ios") {
      switch (type) {
        case "camera":
          return PERMISSIONS.IOS.CAMERA;
        case "audio":
          return PERMISSIONS.IOS.MICROPHONE;
        case "image":
          return PERMISSIONS.IOS.PHOTO_LIBRARY;
        case "file":
          // iOS doesn't have a broad "file system" permission for the app sandbox
          // Usually handled via DocumentPicker or PhotoLibrary depending on use case.
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
          // handled uniquely by react-native-permissions using requestNotifications
          return null;
        case "phone":
          // iOS doesn't require explicit permission to use Linking.openURL('tel:...')
          return null;
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
          // Required for Android 12+
          return PERMISSIONS.ANDROID.BLUETOOTH_CONNECT;
        case "phone":
          return PERMISSIONS.ANDROID.CALL_PHONE;
        case "notification":
          // handled uniquely by checkNotifications/requestNotifications
          return null;
        default:
          return null;
      }
    }
    return null;
  }

  /**
   * Check the current status of a permission without asking the user
   */
  async checkPermission(type: AppPermissionType): Promise<PermissionStatus> {
    if (type === "notification") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { checkNotifications } = require("react-native-permissions");
      const { status } = await checkNotifications();
      return status;
    }
    
    const nativePerm = this.getNativePermission(type);
    if (!nativePerm) {
      // If the permission doesn't exist on this platform (e.g. Phone on iOS), we consider it granted
      return RESULTS.GRANTED;
    }
    try {
      return await check(nativePerm);
    } catch (error) {
      console.error(`Error checking permission ${type}:`, error);
      return RESULTS.UNAVAILABLE;
    }
  }

  /**
   * Request a permission from the user
   */
  async requestPermission(type: AppPermissionType): Promise<PermissionStatus> {
    if (type === "notification") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { requestNotifications } = require("react-native-permissions");
      const { status } = await requestNotifications(["alert", "sound", "badge"]);
      return status;
    }

    const nativePerm = this.getNativePermission(type);
    if (!nativePerm) {
      return RESULTS.GRANTED;
    }
    try {
      return await request(nativePerm);
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
   * Helper to open the OS Settings screen for the app if permission is blocked
   */
  async openSettingsForApp(
    title = "Permission Required",
    message = "Please enable this permission in your device settings."
  ) {
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      { text: "Open Settings", onPress: () => openSettings() },
    ]);
  }
  /**
   * Utility to register and fetch the Expo Push Token for this device.
   * This uses the unified PermissionService to request the notification permission.
   * NOTE: This will only return a token on physical devices.
   */
  async registerForPushNotificationsAsync(): Promise<string | null> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Device = require("expo-device");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Notifications = require("expo-notifications");

    if (!Device.isDevice) {
      console.log("Must use physical device for Push Notifications");
      return null;
    }

    const hasPermission = await this.requirePermission("notification");
    if (!hasPermission) {
      console.log("User denied push notification permissions");
      return null;
    }

    // Set channel for Android
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    try {
      const projectId =
        require("../../app.json")?.expo?.extra?.eas?.projectId;
      
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      return tokenData.data;
    } catch (e) {
      console.error("Failed to get push token", e);
      return null;
    }
  }
}

export const permissionService = new PermissionService();
