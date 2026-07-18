import { View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Txt } from "./Typography";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";
interface IProps {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  fun?: () => void;
}

export default function ScreenHeader({ title, icon, fun }: IProps) {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();
  return (
    <View
      className="h-28 pb-4 px-6 flex-row items-end justify-between border-b border-base-300 w-full"
      style={{
        backgroundColor: colors.base200,
      }}
    >
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons
            name="arrow-back-outline"
            color={colors.baseContent}
            size={28}
          />
        </TouchableOpacity>
        <Txt variant="h2" className="font-bold">
          {title}
        </Txt>
      </View>
      {icon && (
        <TouchableOpacity onPress={fun}>
          <Ionicons name={icon} color={colors.baseContent} size={28} />
        </TouchableOpacity>
      )}
    </View>
  );
}
