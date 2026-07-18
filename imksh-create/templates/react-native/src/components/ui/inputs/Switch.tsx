import React, { useEffect } from "react";
import { TouchableOpacity, StyleProp, ViewStyle, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";

export interface SwitchProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function Switch({
  checked,
  onChange,
  label,
  disabled,
  style,
}: SwitchProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  
  const progress = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: 250 });
  }, [checked, progress]);

  const trackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [theme.base300, theme.primary]
    );
    return { backgroundColor };
  });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: progress.value * 20 }],
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => onChange && onChange(!checked)}
      style={[{ flexDirection: "row", alignItems: "center", opacity: disabled ? 0.5 : 1 }, style]}
    >
      <Animated.View
        style={[
          { width: 44, height: 24, borderRadius: 12, padding: 2, justifyContent: "center" },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            { width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 },
            thumbStyle,
          ]}
        />
      </Animated.View>
      {label && <Text style={{ color: theme.baseContent, marginLeft: 10, fontSize: 15 }}>{label}</Text>}
    </TouchableOpacity>
  );
}
