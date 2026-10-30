import { useState } from "react";
import { TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "./../../constants/Colors";
import { Txt } from "./Typography";
import { useAuthStore } from "./../../store/useAuthStore";
import { toast } from "./../../utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { isExpoGo, hasNativeModule } from "../../utils/env";

interface GoogleAuthButtonProps {
  onSuccess?: () => void;
  label?: string;
  isLogin?: boolean;
}

export default function GoogleAuthButton({
  onSuccess,
  label,
  isLogin = true,
}: GoogleAuthButtonProps) {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { googleLogin } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (isExpoGo() || !hasNativeModule("RNGoogleSignin")) {
      toast.info(
        "Development Build Required",
        "Google Sign-In requires a custom development build (expo-dev-client)."
      );
      return;
    }

    try {
      setLoading(true);

      // Lazily require Google Sign-In only when running in a native custom development build
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const googleModule = require("@react-native-google-signin/google-signin");
      const { GoogleSignin, statusCodes } = googleModule;

      if (!GoogleSignin) {
        toast.error("Error", "Google Sign-In module is not available.");
        return;
      }

      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "",
      });

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Force account selection every time
      try {
        await GoogleSignin.signOut();
      } catch {
        // Ignore if already signed out
      }

      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error("No ID token returned from Google");
      }

      const ok = await googleLogin(idToken);
      if (ok) {
        const currentUser = useAuthStore.getState().user;
        toast.success("Success", `Welcome back, ${currentUser?.name || "User"}`);
        onSuccess?.();
      } else {
        toast.error("Error", "Google authentication failed");
      }
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const statusCodes = hasNativeModule("RNGoogleSignin")
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        ? require("@react-native-google-signin/google-signin").statusCodes
        : undefined;

      const err = error as { code?: string; message?: string };
      if (err.code === statusCodes?.SIGN_IN_CANCELLED) {
        // User cancelled the login flow
      } else if (err.code === statusCodes?.IN_PROGRESS) {
        // Operation is in progress already
      } else if (err.code === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
        toast.error("Error", "Google Play Services not available");
      } else {
        toast.error("Error", err.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={loading}
      className="w-full flex-row items-center justify-center py-4 rounded-xl mt-4 border"
      style={{
        backgroundColor: colors.base100,
        borderColor: colors.base300,
      }}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          <Ionicons name="logo-google" size={20} color={colors.baseContent} />
          <Txt className="font-semibold text-base text-base-content">
            {label || (isLogin ? "Continue with Google" : "Sign up with Google")}
          </Txt>
        </View>
      )}
    </TouchableOpacity>
  );
}
