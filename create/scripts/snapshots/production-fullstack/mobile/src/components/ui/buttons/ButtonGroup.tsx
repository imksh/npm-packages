import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";

export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  spacing?: number;
  style?: StyleProp<ViewStyle>;
}

export default function ButtonGroup({
  children,
  orientation = "horizontal",
  spacing = 8,
  style,
}: ButtonGroupProps) {
  const isHorizontal = orientation === "horizontal";
  
  return (
    <View
      style={[
        {
          flexDirection: isHorizontal ? "row" : "column",
          gap: spacing,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
