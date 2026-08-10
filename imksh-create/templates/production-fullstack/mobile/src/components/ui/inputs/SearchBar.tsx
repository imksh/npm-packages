import React from "react";
import Input, { InputProps } from "./Input";

export type SearchBarSize = "xs" | "sm" | "base" | "md" | "lg";

export interface SearchBarProps extends Omit<InputProps, "leftIcon"> {
  size?: SearchBarSize;
}

export default function SearchBar({
  size = "base",
  style,
  containerStyle,
  ...props
}: SearchBarProps) {
  const getSizeStyles = () => {
    switch (size) {
      case "xs":
        return { height: 32, px: 10, fontSize: 12 };
      case "sm":
        return { height: 38, px: 12, fontSize: 13 };
      case "base":
        return { height: 44, px: 14, fontSize: 14 };
      case "md":
        return { height: 50, px: 16, fontSize: 15 };
      case "lg":
        return { height: 56, px: 18, fontSize: 16 };
      default:
        return { height: 44, px: 14, fontSize: 14 };
    }
  };

  const s = getSizeStyles();

  return (
    <Input
      leftIcon="search"
      placeholder="Search..."
      style={[{ fontSize: s.fontSize }, style]}
      containerStyle={[
        {
          borderRadius: 9999,
          height: s.height,
          paddingHorizontal: s.px,
          backgroundColor: "rgba(0,0,0,0.05)",
          borderWidth: 0,
        },
        containerStyle,
      ]}
      {...props}
    />
  );
}
