import React from "react";
import { TouchableOpacity, ActivityIndicator, TouchableOpacityProps } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Txt } from "../../common/Typography";
import { Ionicons } from "@expo/vector-icons";

export type ButtonVariant = "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "error" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  isFullWidth?: boolean;
  soft?: boolean;
}

export default function Button({
  label,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  isFullWidth = false,
  soft = false,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const getVariantStyles = (): { bg: string; text: string; border?: string } => {
    switch (variant) {
      case "primary": return { bg: theme.primary, text: theme.primaryContent };
      case "secondary": return { bg: theme.secondary, text: theme.secondaryContent };
      case "accent": return { bg: theme.accent, text: theme.accentContent };
      case "info": return { bg: theme.info, text: "#fff" };
      case "success": return { bg: theme.success, text: "#fff" };
      case "warning": return { bg: theme.warning, text: "#fff" };
      case "error": return { bg: theme.error, text: "#fff" };
      case "ghost": return { bg: "transparent", text: theme.baseContent };
      case "outline": return { bg: "transparent", text: theme.baseContent, border: theme.base300 };
      default: return { bg: theme.primary, text: theme.primaryContent };
    }
  };

  const getSizeStyles = (): { height: number; px: number; fontSize: number; iconSize: number } => {
    switch (size) {
      case "sm": return { height: 36, px: 12, fontSize: 13, iconSize: 16 };
      case "md": return { height: 48, px: 16, fontSize: 15, iconSize: 20 };
      case "lg": return { height: 56, px: 24, fontSize: 17, iconSize: 24 };
      default: return { height: 48, px: 16, fontSize: 15, iconSize: 20 };
    }
  };

  const vStyles = getVariantStyles();
  if (soft && variant !== "ghost" && variant !== "outline") {
    vStyles.text = vStyles.bg;
    vStyles.bg = vStyles.bg + "26"; // ~15% opacity
  }

  const sStyles = getSizeStyles();
  
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      style={[
        {
          backgroundColor: vStyles.bg as any,
          height: sStyles.height,
          paddingHorizontal: sStyles.px,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          opacity: isDisabled ? 0.6 : 1,
          borderWidth: variant === "outline" ? 1 : 0,
          borderColor: vStyles.border,
          width: isFullWidth ? "100%" : undefined,
        },
        style,
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={vStyles.text} size="small" />
      ) : (
        <>
          {leftIcon && (
            <Ionicons name={leftIcon} size={sStyles.iconSize} color={vStyles.text} style={{ marginRight: 8 }} />
          )}
          <Txt style={{ color: vStyles.text, fontSize: sStyles.fontSize, fontWeight: "600" }}>
            {label}
          </Txt>
          {rightIcon && (
            <Ionicons name={rightIcon} size={sStyles.iconSize} color={vStyles.text} style={{ marginLeft: 8 }} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
