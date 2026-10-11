import { useEffect, useState } from "react";
import { TouchableOpacity, View, ActivityIndicator } from "react-native";
import Constants from "expo-constants";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Txt } from "./Typography";
import { useAuthStore } from "../../../store/useAuthStore";
import { toast } from "../../../utils/toast";
import { Ionicons } from "@expo/vector-icons";

const isExpoGo = Constants.appOwnership === "expo";

interface GoogleSigninType {
  configure: (options: Record<string, unknown>) => void;
  hasPlayServices: (options: { showPlayServicesUpdateDialog: boolean }) => Promise<boolean>;
  signIn: () => Promise<{ data?: { idToken?: string }; idToken?: string }>;
}

interface StatusCodesType {
  SIGN_IN_CANCELLED: string;
  IN_PROGRESS: string;
  PLAY_SERVICES_NOT_AVAILABLE: string;
}

let GoogleSignin: GoogleSigninType | undefined;
let statusCodes: StatusCodesType | undefined;

if (!isExpoGo) {
  try {
    const googleModule = require("@react-native-google-signin/google-signin");
    GoogleSignin = googleModule.GoogleSignin;
    statusCodes = googleModule.statusCodes;
  } catch {
    // Module not found or not supported in current environment
  }
}

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

  useEffect(() => {
    if (!isExpoGo && GoogleSignin) {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "",
      });
    }
  }, []);

  const handlePress = async () => {
    if (isExpoGo) {
      toast.info(
        "Expo Go",
        "Google Sign-In is not supported in Expo Go. Please use a custom dev client."
      );
      return;
    }

    if (!GoogleSignin) {
      toast.error("Error", "Google Sign-In module is not loaded.");
      return;
    }

    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();

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
      const err = error as { code?: string; message?: string };
      if (err.code === statusCodes?.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (err.code === statusCodes?.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (err.code === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        toast.error("Error", "Google Play Services not available");
      } else {
        // some other error happened
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
