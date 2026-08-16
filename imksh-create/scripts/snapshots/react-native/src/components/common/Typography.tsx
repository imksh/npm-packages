import React from "react";
import { Text, TextProps } from "react-native";
export const FontFamily = {
  regular: "InterRegular",
  medium: "InterMedium",
  semibold: "InterSemiBold",
  bold: "InterBold",
  extrabold: "InterExtraBold",
} as const;

export type TxtVariant =
  | "caption"
  | "xxs"
  | "xs"
  | "sm"
  | "base"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl";

export interface TxtProps extends TextProps {
  variant?: TxtVariant;
  color?: string;
  align?: "auto" | "left" | "right" | "center" | "justify";
  weight?: "normal" | "medium" | "bold" | "semibold" | "black";
}

export const Txt = ({
  variant = "base",
  color,
  align,
  weight,
  style,
  className = "",
  children,
  ...props
}: TxtProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "caption":
        return { fontFamily: FontFamily.regular, fontSize: 10 };
      case "xxs":
        return { fontFamily: FontFamily.regular, fontSize: 8 };
      case "xs":
        return { fontFamily: FontFamily.regular, fontSize: 10 };
      case "sm":
        return { fontFamily: FontFamily.regular, fontSize: 12 };
      case "base":
        return { fontFamily: FontFamily.regular, fontSize: 14 };
      case "md":
        return { fontFamily: FontFamily.medium, fontSize: 16 };
      case "lg":
        return { fontFamily: FontFamily.semibold, fontSize: 18 };
      case "xl":
        return { fontFamily: FontFamily.bold, fontSize: 20 };
      case "2xl":
        return { fontFamily: FontFamily.bold, fontSize: 24 };
      case "3xl":
        return { fontFamily: FontFamily.extrabold, fontSize: 30 };
      case "4xl":
        return { fontFamily: FontFamily.extrabold, fontSize: 36 };
      case "5xl":
        return { fontFamily: FontFamily.extrabold, fontSize: 48 };
      case "6xl":
        return { fontFamily: FontFamily.extrabold, fontSize: 60 };
      case "7xl":
        return { fontFamily: FontFamily.extrabold, fontSize: 72 };
      default:
        return { fontFamily: FontFamily.regular, fontSize: 14 };
    }
  };

  const baseStyle = getVariantStyles();
  const hasColorClass = className.split(" ").some((c) => {
    if (!c.startsWith("text-")) return false;
    const val = c.substring(5).split("/")[0]; // handle potential opacity suffix like text-white/80
    const isSize = ["xxs", "xs", "sm", "base", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "caption"].includes(val);
    return !isSize;
  });
  const defaultColorClass = hasColorClass
    ? ""
    : variant === "xs"
      ? "text-secondary"
      : "text-base-content";

  // Override specific properties if provided
  const customStyles: any = {};
  if (color) customStyles.color = color;
  if (align) customStyles.textAlign = align;
  if (weight) {
    if (weight === "bold" || weight === "black")
      customStyles.fontFamily = FontFamily.bold;
    if (weight === "semibold") customStyles.fontFamily = FontFamily.semibold;
    if (weight === "medium") customStyles.fontFamily = FontFamily.medium;
    if (weight === "normal") customStyles.fontFamily = FontFamily.regular;
  }

  return (
    <Text
      className={`${defaultColorClass} ${className}`}
      style={[baseStyle, customStyles, style]}
      {...props}
    >
      {children}
    </Text>
  );
};
