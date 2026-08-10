import { View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Txt } from "./Typography";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface IProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onBack?: () => void;
}

export default function ScreenHeader({
  title,
  subtitle,
  actions,
  onBack,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  return (
    <View
      className="px-6 flex-row items-center justify-between border-b border-base-200 w-full"
      style={{
        backgroundColor: colors.base200,
        height: insets.top + 56,
        paddingTop: insets.top,
      }}
    >
      <View className="flex-row items-center flex-1 mr-4">
        <TouchableOpacity
          onPress={() => (onBack ? onBack() : router.back())}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full bg-base-200/80 items-center justify-center mr-3 border border-base-300/10 shadow-sm"
        >
          <Ionicons
            name="arrow-back"
            color={colors.baseContent}
            size={20}
          />
        </TouchableOpacity>
        <View className="flex-1">
          <Txt variant="md" className="text-base-content" numberOfLines={1}>
            {title}
          </Txt>
          {subtitle && (
            <Txt
              variant="xs"
              className="text-base-content/50 mt-0.5"
              numberOfLines={1}
            >
              {subtitle}
            </Txt>
          )}
        </View>
      </View>
      {actions && (
        <View className="flex-row items-center gap-2">{actions}</View>
      )}
    </View>
  );
}
