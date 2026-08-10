import React, { useEffect } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Txt } from "../../common/Typography";

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
          <Txt color={theme.baseContent} variant="sm" weight="semibold">{label}</Txt>
          <Txt color={theme.secondary} variant="sm">{Math.round(progress)}%</Txt>
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
