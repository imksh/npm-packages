import React from "react";
import { View, ViewProps } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  padding?: number;
  elevation?: number;
}

export default function Card({ children, style, padding = 16, elevation = 2, ...props }: CardProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View
      style={[
        {
          backgroundColor: theme.base200,
          borderRadius: 16,
          padding,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: elevation },
          shadowOpacity: elevation * 0.05,
          shadowRadius: elevation * 2,
          elevation,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
