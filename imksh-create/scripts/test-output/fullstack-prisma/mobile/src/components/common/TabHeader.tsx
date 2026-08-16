import { View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Txt } from "./Typography";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";
import Sidebar from "../ui/Sidebar";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabHeader({
  title,
  actions,
  showMenuButton = false,
}: {
  title?: string;
  actions?: React.ReactNode;
  showMenuButton?: boolean;
}) {
  const { colorScheme } = useColorScheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  return (
    <>
      <View
        className="px-6 flex-row items-center justify-between border-b border-base-200 w-full"
        style={{
          backgroundColor: colors.base200,
          height: insets.top + 56,
          paddingTop: insets.top,
        }}
      >
        <View className="flex-row items-center flex-1 mr-4">
          {showMenuButton && (
            <TouchableOpacity
              onPress={() => setIsSidebarOpen(true)}
              activeOpacity={0.7}
              className="w-10 h-10 rounded-full bg-base-200/80 items-center justify-center mr-3 border border-base-300/10 shadow-sm"
            >
              <Ionicons
                name="menu-outline"
                color={colors.baseContent}
                size={22}
              />
            </TouchableOpacity>
          )}
          <Txt variant="xl" className="text-primary">
            {title}
          </Txt>
        </View>
        <View className="flex-row items-center gap-2">{actions}</View>
      </View>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
