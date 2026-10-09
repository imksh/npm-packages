import React from "react";
import { View, ViewProps } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Txt } from "../../common/Typography";

export interface BadgeProps extends ViewProps {
  label: string;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "neutral";
  size?: "xs" | "sm" | "base" | "md" | "lg";
  soft?: boolean;
}

export default function Badge({
  label,
  variant = "primary",
  size = "base",
  soft = false,
  style,
  ...props
}: BadgeProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const getVariantStyles = (): { bg: string; text: string } => {
    switch (variant) {
      case "secondary":
        return { bg: theme.secondary, text: theme.secondaryContent };
      case "accent":
        return { bg: theme.accent, text: theme.accentContent };
      case "info":
        return { bg: theme.info, text: "#fff" };
      case "success":
        return { bg: theme.success, text: "#fff" };
      case "warning":
        return { bg: theme.warning, text: "#fff" };
      case "error":
        return { bg: theme.error, text: "#fff" };
      case "neutral":
        return { bg: theme.neutral, text: theme.neutralContent };
      case "primary":
      default:
        return { bg: theme.primary, text: theme.primaryContent };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "xs":
        return { height: 16, px: 4, fontSize: 6 };
      case "sm":
        return { height: 18, px: 6, fontSize: 8 };
      case "base":
        return { height: 22, px: 8, fontSize: 10 };
      case "lg":
        return { height: 28, px: 12, fontSize: 14 };
      case "md":
      default:
        return { height: 24, px: 8, fontSize: 12 };
    }
  };

  const vStyles = getVariantStyles();
  if (soft) {
    vStyles.text = vStyles.bg;
    vStyles.bg = vStyles.bg + "26"; // ~15% opacity
  }

  const sStyles = getSizeStyles();

  return (
    <View
      style={[
        {
          backgroundColor: vStyles.bg as any,
          height: sStyles.height,
          paddingHorizontal: sStyles.px,
          borderRadius: 9999,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "flex-start",
        },
        style,
      ]}
      {...props}
    >
      <Txt
        color={vStyles.text}
        weight="semibold"
        style={{ fontSize: sStyles.fontSize }}
      >
        {label}
      </Txt>
    </View>
  );
}
