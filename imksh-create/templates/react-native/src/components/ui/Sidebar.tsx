import React, { useEffect, useState } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Portal } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";
import { Txt } from "../common/Typography";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/useAuthStore";

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = width * 0.75;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const MenuItem = ({
  icon,
  label,
  onPress,
  colors,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
  colors: any;
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    className="flex-row items-center py-4 px-4 rounded-2xl"
  >
    <View className="w-10 h-10 rounded-full items-center justify-center bg-primary/10 mr-4">
      <Ionicons name={icon} size={20} color={colors.primary} />
    </View>
    <Txt variant="h3" className="text-base-content font-medium">
      {label}
    </Txt>
  </TouchableOpacity>
);

export default function Sidebar({ isOpen, onClose, children }: SidebarProps) {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();

  const translateX = useSharedValue(-SIDEBAR_WIDTH);
  const backdropOpacity = useSharedValue(0);
  const [isRendered, setIsRendered] = useState(false);

  if (isOpen && !isRendered) {
    setIsRendered(true);
  }

  useEffect(() => {
    if (isOpen) {
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      backdropOpacity.value = withTiming(0.4, { duration: 300 });
    } else {
      translateX.value = withTiming(-SIDEBAR_WIDTH, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
      backdropOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished) {
          runOnJS(setIsRendered)(false);
        }
      });
    }
  }, [isOpen, backdropOpacity, translateX]);

  const sidebarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!isRendered && !isOpen) return null;

  return (
    <Portal>
      <View style={[StyleSheet.absoluteFill, { zIndex: 999 }]}>
        {/* Backdrop Overlay */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "#000" },
              backdropAnimatedStyle,
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Sliding Sidebar Panel */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: SIDEBAR_WIDTH,
              backgroundColor: colors.base100,
              elevation: 24,
              shadowColor: "#000",
              shadowOffset: { width: 5, height: 0 },
              shadowOpacity: 0.2,
              shadowRadius: 15,
              overflow: "hidden",
            },
            sidebarAnimatedStyle,
          ]}
        >
          {children || (
            <View className="flex-1">
              {/* Sidebar Header */}
              <View
                className="px-6 bg-base-200 border-b border-base-300 items-center  flex flex-row gap-4"
                style={{
                  paddingTop: insets.top > 0 ? insets.top + 12 : 30,
                  paddingBottom: 8,
                }}
              >
                <View
                  className="w-12 h-12 rounded-full bg-primary items-center justify-center"
                  style={{
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 10,
                    elevation: 8,
                  }}
                >
                  <Txt variant="h3">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </Txt>
                </View>
                <View>
                  <Txt variant="h2" className="text-xl mb-1">
                    {user?.name || "User Name"}
                  </Txt>
                  <Txt variant="caption" className="text-base-content/60">
                    {user?.email || "user@example.com"}
                  </Txt>
                </View>
              </View>

              {/* Menu Items */}
              <View className="flex-1 pt-4">
                <MenuItem
                  icon="home-outline"
                  label="Dashboard"
                  onPress={onClose}
                  colors={colors}
                />
                <MenuItem
                  icon="person-outline"
                  label="Profile"
                  onPress={onClose}
                  colors={colors}
                />
                <MenuItem
                  icon="settings-outline"
                  label="Settings"
                  onPress={onClose}
                  colors={colors}
                />
                <MenuItem
                  icon="help-buoy-outline"
                  label="Help & Support"
                  onPress={onClose}
                  colors={colors}
                />
              </View>

              {/* Footer */}
              <View
                className="p-6"
                style={{
                  paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 20,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="flex-row items-center justify-center p-3 rounded-xl bg-error/10"
                  onPress={() => {
                    onClose();
                    logout();
                  }}
                >
                  <Ionicons
                    name="log-out-outline"
                    size={20}
                    color={colors.error}
                  />
                  <Txt
                    variant="mid"
                    className="ml-2 font-bold"
                    style={{ color: colors.error }}
                  >
                    Log Out
                  </Txt>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </Portal>
  );
}
