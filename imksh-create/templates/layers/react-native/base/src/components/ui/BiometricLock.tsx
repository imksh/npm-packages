import React, { useEffect, useState, useRef } from "react";
import { View, AppState, AppStateStatus, StyleSheet } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { authenticateAsync } from "@/services/biometric.service";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";
import { Txt } from "./common/Typography";
import Button from "./ui/buttons/Button";

export default function BiometricLock({ children }: { children: React.ReactNode }) {
  const { isBiometricEnabled, isAppLocked, setIsAppLocked, lockDuration } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  
  const appState = useRef(AppState.currentState);
  const backgroundTime = useRef<number | null>(null);
  
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (!isBiometricEnabled) return;

    // Trigger initial lock if enabled and locked on startup
    if (isAppLocked) {
      handleAuthentication();
    }

    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      // App went to background
      if (appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
        backgroundTime.current = Date.now();
      }

      // App came to foreground
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        if (isBiometricEnabled && !isAppLocked && backgroundTime.current) {
          const timeInBackground = Date.now() - backgroundTime.current;
          // lockDuration is in minutes, so multiply by 60000. Give a 10s grace period for 'Immediately' (0) to allow for permission/native modals.
          const threshold = lockDuration === 0 ? 10000 : lockDuration * 60000;
          if (timeInBackground > threshold) {
            setIsAppLocked(true);
            handleAuthentication();
          }
        } else if (isAppLocked) {
          handleAuthentication();
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isBiometricEnabled, isAppLocked, lockDuration]);

  const handleAuthentication = async () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);
    
    const success = await authenticateAsync("Unlock HireMe");
    
    if (success) {
      setIsAppLocked(false);
      backgroundTime.current = null;
    }
    
    setIsAuthenticating(false);
  };

  return (
    <>
      {children}
      {isAppLocked && (
        <View style={[styles.container, { backgroundColor: theme.base100 }]}>
          <View className="items-center justify-center mb-10">
            <View className="w-24 h-24 rounded-full items-center justify-center mb-6" style={{ backgroundColor: theme.primary + '15' }}>
              <Ionicons name="lock-closed" size={48} color={theme.primary} />
            </View>
            <Txt variant="3xl" className="font-extrabold tracking-tight mb-2">App Locked</Txt>
            <Txt variant="base" className="opacity-70 text-center px-8">
              Please authenticate to continue using HireMe
            </Txt>
          </View>

          <Button 
            label="Unlock App" 
            variant="primary" 
            leftIcon="finger-print" 
            onPress={handleAuthentication} 
            isLoading={isAuthenticating}
            style={{ width: '80%', maxWidth: 300 }}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999, // Ensure it covers everything
  },
});
