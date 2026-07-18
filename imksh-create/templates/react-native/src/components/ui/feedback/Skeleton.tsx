import React, { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  variant?: "circular" | "rectangular" | "text";
}

export default function Skeleton({
  width,
  height,
  borderRadius,
  style,
  variant = "rectangular",
}: SkeletonProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case "circular":
        return {
          width: (width as import('react-native').DimensionValue) ?? 40,
          height: (height as import('react-native').DimensionValue) ?? ((width as import('react-native').DimensionValue) ?? 40),
          borderRadius: 9999,
        };
      case "text":
        return {
          width: (width as import('react-native').DimensionValue) ?? "100%",
          height: (height as import('react-native').DimensionValue) ?? 20,
          borderRadius: borderRadius ?? 4,
        };
      case "rectangular":
      default:
        return {
          width: (width as import('react-native').DimensionValue) ?? "100%",
          height: (height as import('react-native').DimensionValue) ?? 100,
          borderRadius: borderRadius ?? 12,
        };
    }
  };

  return (
    <Animated.View
      style={[
        { backgroundColor: theme.base300 },
        getVariantStyles(),
        animatedStyle,
        style,
      ]}
    />
  );
}
