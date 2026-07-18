import { View, TouchableOpacity, Pressable } from "react-native";
import React, { useState } from "react";
import { Txt } from "./Typography";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Sidebar from "../ui/Sidebar";

export default function HomeHeader({
  title,
  icon,
  fun,
}: {
  title?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  fun?: () => void;
}) {
  const { colorScheme } = useColorScheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const colors = Colors[colorScheme ?? "light"];
  return (
    <>
      <View
        className="h-28 pb-4 px-6 flex-row items-end justify-between border-b border-base-300 w-full"
        style={{
          backgroundColor: colors.base200,
          // elevation: 1,
        }}
      >
        <Pressable onPress={() => setIsSidebarOpen(true)}>
          <Txt variant="xl" className="text-primary font-bold">
            {title}
          </Txt>
        </Pressable>
        <TouchableOpacity onPress={fun}>
          <Ionicons name={icon} color={colors.baseContent} size={28} />
        </TouchableOpacity>
      </View>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
