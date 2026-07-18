import React from "react";
import { TouchableOpacity, ActivityIndicator, TouchableOpacityProps } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { ButtonVariant, ButtonSize } from "./Button";

export interface IconButtonProps extends TouchableOpacityProps {
  icon: keyof typeof Ionicons.glyphMap;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export default function IconButton({
  icon,
  variant = "ghost",
  size = "md",
  isLoading = false,
  style,
  disabled,
  ...props
}: IconButtonProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const getVariantStyles = (): { bg: string; iconColor: string; border?: string } => {
    switch (variant) {
      case "primary": return { bg: theme.primary, iconColor: theme.primaryContent };
      case "secondary": return { bg: theme.secondary, iconColor: theme.secondaryContent };
      case "accent": return { bg: theme.accent, iconColor: theme.accentContent };
      case "info": return { bg: theme.info, iconColor: "#fff" };
      case "success": return { bg: theme.success, iconColor: "#fff" };
      case "warning": return { bg: theme.warning, iconColor: "#fff" };
      case "error": return { bg: theme.error, iconColor: "#fff" };
      case "ghost": return { bg: "transparent", iconColor: theme.baseContent };
      case "outline": return { bg: "transparent", iconColor: theme.baseContent, border: theme.base300 };
      default: return { bg: theme.primary, iconColor: theme.primaryContent };
    }
  };

  const getSizeStyles = (): { size: number; iconSize: number } => {
    switch (size) {
      case "sm": return { size: 36, iconSize: 18 };
      case "md": return { size: 48, iconSize: 24 };
      case "lg": return { size: 56, iconSize: 28 };
      default: return { size: 48, iconSize: 24 };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      style={[
        {
          backgroundColor: vStyles.bg,
          width: sStyles.size,
          height: sStyles.size,
          borderRadius: sStyles.size / 2,
          alignItems: "center",
          justifyContent: "center",
          opacity: isDisabled ? 0.6 : 1,
          borderWidth: variant === "outline" ? 1 : 0,
          borderColor: vStyles.border,
        },
        style,
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={vStyles.iconColor} size="small" />
      ) : (
        <Ionicons name={icon} size={sStyles.iconSize} color={vStyles.iconColor} />
      )}
    </TouchableOpacity>
  );
}
