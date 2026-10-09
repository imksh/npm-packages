import * as LocalAuthentication from 'expo-local-authentication';

export const isBiometricSupported = async () => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) return false;
  
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return enrolled;
};

export const authenticateAsync = async (promptMessage = "Authenticate to continue") => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: "Use Passcode",
      disableDeviceFallback: false,
      cancelLabel: "Cancel"
    });
    return result.success;
  } catch (error) {
    console.error("Biometric authentication error:", error);
    return false;
  }
};
