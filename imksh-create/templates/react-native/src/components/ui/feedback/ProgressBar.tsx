import React, { useEffect } from "react";
import { View, StyleProp, ViewStyle, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";

export interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: number;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export default function ProgressBar({ progress, color, height = 8, label, style }: ProgressBarProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const widthVal = useSharedValue(0);

  useEffect(() => {
    widthVal.value = withTiming(progress, { duration: 500 });
  }, [progress, widthVal]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${widthVal.value}%`,
  }));

  return (
    <View style={[{ width: "100%", marginBottom: label ? 16 : 0 }, style]}>
      {label && (
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
          <Text style={{ color: theme.baseContent, fontSize: 13, fontWeight: "500" }}>{label}</Text>
          <Text style={{ color: theme.secondary, fontSize: 13 }}>{Math.round(progress)}%</Text>
        </View>
      )}
      <View style={{ width: "100%", height, backgroundColor: theme.base300, borderRadius: height / 2, overflow: "hidden" }}>
        <Animated.View
          style={[
            { height: "100%", backgroundColor: color || theme.primary, borderRadius: height / 2 },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
}
