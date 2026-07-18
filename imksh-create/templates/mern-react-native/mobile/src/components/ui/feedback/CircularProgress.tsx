import React from "react";
import { View, Text } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";

export interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

export default function CircularProgress({ progress, size = 60, strokeWidth = 6 }: CircularProgressProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: theme.primary,
        borderTopColor: theme.base300,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ rotate: "45deg" }], 
      }}
    >
      <View style={{ transform: [{ rotate: "-45deg" }] }}>
         <Text style={{ color: theme.baseContent, fontWeight: "700", fontSize: size * 0.25 }}>
           {progress}%
         </Text>
      </View>
    </View>
  );
}
