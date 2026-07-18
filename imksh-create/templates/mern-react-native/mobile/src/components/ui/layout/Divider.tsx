import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";

export default function Divider({ style, vertical }: { style?: StyleProp<ViewStyle>; vertical?: boolean }) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  return (
    <View
      style={[
        {
          backgroundColor: theme.base300,
          ...(vertical ? { width: 1, height: "100%" } : { height: 1, width: "100%" }),
        },
        style,
      ]}
    />
  );
}
