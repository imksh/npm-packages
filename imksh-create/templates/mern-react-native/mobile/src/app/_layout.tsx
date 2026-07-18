import { useEffect } from "react";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../store/useAuthStore";
import { useColorScheme } from "nativewind";
import { Colors } from "../constants/Colors";
import "./global.css";
import Loading from "@/components/common/Loading";

import { PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    InterRegular: require("../../assets/fonts/Inter_Regular.ttf"),
    InterMedium: require("../../assets/fonts/Inter_Medium.ttf"),
    InterSemiBold: require("../../assets/fonts/Inter_SemiBold.ttf"),
    InterBold: require("../../assets/fonts/Inter_Bold.ttf"),
    InterExtraBold: require("../../assets/fonts/Inter_ExtraBold.ttf"),
  });

  const { getMe, isCheckingAuth } = useAuthStore();
  const { colorScheme, setColorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    getMe();

    // Load saved theme
    AsyncStorage.getItem("theme").then((savedTheme) => {
      if (savedTheme === "light" || savedTheme === "dark") {
        setColorScheme(savedTheme);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (isCheckingAuth) {
    return <Loading />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.base100 },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="login"
            options={{ headerShown: false, animation: "fade" }}
          />
        </Stack>
        <Toast />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
