import Constants, { ExecutionEnvironment } from "expo-constants";
import { TurboModuleRegistry, NativeModules } from "react-native";

/**
 * Checks whether a specific native module or TurboModule is linked in the native binary.
 * Uses non-throwing lookups on both TurboModuleRegistry and NativeModules.
 */
export const hasNativeModule = (name: string): boolean => {
  try {
    if (TurboModuleRegistry?.get && TurboModuleRegistry.get(name) != null) {
      return true;
    }
    if (NativeModules && NativeModules[name] != null) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};

/**
 * Returns true if the app is currently running inside Expo Go.
 * Robust against early bundle evaluation where Constants.appOwnership may be null/undefined.
 */
export const isExpoGo = (): boolean => {
  try {
    // Legacy appOwnership check (SDK < 50 or when populated)
    if (Constants.appOwnership === "expo") {
      return true;
    }
    // Modern execution environment check (SDK 50+)
    if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
      return true;
    }
    // Fallback: Check if custom third-party native modules absent in Expo Go are missing
    const hasRNPermissions = hasNativeModule("RNPermissions");
    const hasRNGoogleSignin = hasNativeModule("RNGoogleSignin");

    if (!hasRNPermissions && !hasRNGoogleSignin) {
      return true;
    }
  } catch {
    return true;
  }
  return false;
};
