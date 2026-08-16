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
import { sidebarConfig } from "../../config/sidebar.config";
import { router } from "expo-router";
import Image from "./data-display/Image";

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = width * 0.75;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  side?: "left" | "right";
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
    className="flex-row items-center py-4 px-6 rounded-2xl mx-2"
  >
    <View className="w-10 h-10 rounded-full items-center justify-center bg-primary/10 mr-4">
      <Ionicons name={icon} size={20} color={colors.primary} />
    </View>
    <Txt variant="md" className="text-base-content font-semibold">
      {label}
    </Txt>
  </TouchableOpacity>
);

export default function Sidebar({
  isOpen,
  onClose,
  side = "left",
  children,
}: SidebarProps) {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();

  const startValue = side === "left" ? -SIDEBAR_WIDTH : SIDEBAR_WIDTH;
  const translateX = useSharedValue(isOpen ? 0 : startValue);
  const backdropOpacity = useSharedValue(0);
  const [isRendered, setIsRendered] = useState(false);

  if (isOpen && !isRendered) {
    setIsRendered(true);
  }

  useEffect(() => {
    const targetValue = isOpen
      ? 0
      : side === "left"
        ? -SIDEBAR_WIDTH
        : SIDEBAR_WIDTH;
    translateX.value = withTiming(targetValue, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });

    if (isOpen) {
      backdropOpacity.value = withTiming(0.4, { duration: 300 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished) {
          runOnJS(setIsRendered)(false);
        }
      });
    }
  }, [isOpen, side, backdropOpacity, translateX, startValue]);

  const sidebarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!isRendered && !isOpen) return null;

  const role = user?.role?.toLowerCase() || "default";
  const menuItems = sidebarConfig[role] || sidebarConfig.default;

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
              left: side === "left" ? 0 : undefined,
              right: side === "right" ? 0 : undefined,
              width: SIDEBAR_WIDTH,
              backgroundColor: colors.base100,
              elevation: 24,
              shadowColor: "#000",
              shadowOffset: { width: side === "left" ? 5 : -5, height: 0 },
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
                className="px-6 bg-base-200 border-b border-base-300 items-center flex flex-row gap-4"
                style={{
                  paddingTop: insets.top > 0 ? insets.top + 12 : 30,
                  paddingBottom: 16,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    router.push("/(tenant)/profile");
                  }}
                  className="w-12 h-12 rounded-full bg-primary items-center justify-center"
                  style={{
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 10,
                    elevation: 8,
                  }}
                >
                  {user?.avatar?.url ? (
                    <View className="w-11 h-11 rounded-full border border-base-300 overflow-hidden">
                      <Image
                        src={user.avatar.url}
                        style={{ width: 44, height: 44 }}
                      />
                    </View>
                  ) : (
                    <View className="w-11 h-11 rounded-full bg-primary/15 items-center justify-center border border-primary/10">
                      <Ionicons
                        name="person"
                        size={22}
                        color={colors.primary}
                      />
                    </View>
                  )}
                </TouchableOpacity>
                <View className="flex-1">
                  <Txt
                    variant="md"
                    className="font-bold text-base-content"
                    numberOfLines={1}
                  >
                    {user?.name || "User Name"}
                  </Txt>
                  <Txt
                    variant="xs"
                    className="text-base-content/50"
                    numberOfLines={1}
                  >
                    {user?.email || "user@example.com"}
                  </Txt>
                </View>
              </View>

              {/* Menu Items */}
              <View className="flex-1 pt-4">
                {menuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    onPress={() => {
                      onClose();
                      router.push(item.route as any);
                    }}
                    colors={colors}
                  />
                ))}
              </View>

              {/* Footer */}
              <View
                className="p-6 border-t border-base-300"
                style={{
                  paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 20,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="flex-row items-center justify-center p-3 rounded-xl bg-error/10 border border-error/20"
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
                  <Txt variant="md" className="ml-2 font-bold text-error">
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
