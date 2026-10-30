import { View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Txt, TxtVariant } from "./Typography";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface IProps {
  title: string;
  subtitle?: string | React.ReactNode;
  actions?: React.ReactNode;
  onBack?: () => void;
  icon?: "arrow-back" | "close";
  textVarient?: TxtVariant;
  onSubtitlePress?: () => void;
}

export default function ScreenHeader({
  title,
  subtitle,
  actions,
  onBack,
  icon = "arrow-back",
  textVarient = "md",
  onSubtitlePress,
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
      <View className="flex-row items-center flex-1 mr-2">
        <TouchableOpacity
          onPress={() => (onBack ? onBack() : router.back())}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full bg-base-200/80 items-center justify-center mr-2 border border-base-300/10 shadow-sm"
        >
          <Ionicons name={icon} color={colors.baseContent} size={20} />
        </TouchableOpacity>
        <View className="flex-1">
          <Txt
            variant={textVarient}
            className="text-base-content"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {title}
          </Txt>
          {subtitle && (
            <TouchableOpacity
              activeOpacity={onSubtitlePress ? 0.7 : 1}
              onPress={onSubtitlePress}
              disabled={!onSubtitlePress}
              className="flex-row items-center"
            >
              {typeof subtitle === "string" ? (
                <Txt
                  variant="xs"
                  className="text-base-content/50 mt-0.5"
                  numberOfLines={1}
                >
                  {subtitle}
                </Txt>
              ) : (
                subtitle
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
      {actions && (
        <View className="flex-row items-center gap-2">{actions}</View>
      )}
    </View>
  );
}
