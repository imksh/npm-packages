import React, { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { EvilIcons } from "@expo/vector-icons";

export interface SpinnerProps {
  size?: number | "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export default function Spinner({ size = 24, color, style }: SpinnerProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const rotation = useSharedValue(0);

  const numericSize = typeof size === "number" ? size : {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  }[size] || 24;

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[animatedStyle, style, { width: numericSize, height: numericSize, alignItems: "center", justifyContent: "center" }]}>
      <EvilIcons name="spinner" size={numericSize} color={color || theme.primary} />
    </Animated.View>
  );
}
