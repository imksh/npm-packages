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
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "regular"
  | "caption"
  | "mid"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";

export interface TxtProps extends TextProps {
  variant?: TxtVariant;
  color?: string;
  align?: "auto" | "left" | "right" | "center" | "justify";
  weight?: "normal" | "bold" | "semibold" | "black";
}

export const Txt = ({
  variant = "regular",
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
      case "h1":
        return { fontFamily: FontFamily.bold, fontSize: 22 };
      case "h2":
        return { fontFamily: FontFamily.semibold, fontSize: 18 };
      case "h3":
        return { fontFamily: FontFamily.semibold, fontSize: 16 };
      case "mid":
        return { fontFamily: FontFamily.medium, fontSize: 15 };
      case "body":
        return { fontFamily: FontFamily.medium, fontSize: 14 };
      case "regular":
        return { fontFamily: FontFamily.regular, fontSize: 13 };
      case "caption":
        return { fontFamily: FontFamily.regular, fontSize: 12 };
      case "xl":
        return { fontFamily: FontFamily.extrabold, fontSize: 30 };
      case "2xl":
        return { fontFamily: FontFamily.extrabold, fontSize: 36 };
      case "3xl":
        return { fontFamily: FontFamily.extrabold, fontSize: 48 };
      case "4xl":
        return { fontFamily: FontFamily.extrabold, fontSize: 60 };
      default:
        return { fontFamily: FontFamily.regular, fontSize: 13 };
    }
  };

  const baseStyle = getVariantStyles();
  const defaultColorClass =
    variant === "caption" ? "text-secondary" : "text-base-content";

  // Override specific properties if provided
  const customStyles: any = {};
  if (color) customStyles.color = color;
  if (align) customStyles.textAlign = align;
  if (weight) {
    if (weight === "bold" || weight === "black")
      customStyles.fontFamily = "MontserratBold";
    if (weight === "semibold") customStyles.fontFamily = "MontserratSemiBold";
    if (weight === "normal") customStyles.fontFamily = "MontserratRegular";
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
