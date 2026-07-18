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
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export default function Spinner({ size = 24, color, style }: SpinnerProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const rotation = useSharedValue(0);

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
    <Animated.View style={[animatedStyle, style, { width: size, height: size, alignItems: "center", justifyContent: "center" }]}>
      <EvilIcons name="spinner" size={size} color={color || theme.primary} />
    </Animated.View>
  );
}
