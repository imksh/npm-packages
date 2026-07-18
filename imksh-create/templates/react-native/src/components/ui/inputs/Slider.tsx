import React from "react";
import { View, Text } from "react-native";
import CommunitySlider from "@react-native-community/slider";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";

export interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  label?: string;
}

export default function Slider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  label,
}: SliderProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View className="mb-4 w-full">
      {label && (
        <View className="flex-row justify-between mb-2">
          <Text style={{ color: theme.baseContent, fontWeight: "500" }}>{label}</Text>
          <Text style={{ color: theme.secondary }}>{value}</Text>
        </View>
      )}
      <CommunitySlider
        style={{ width: "100%", height: 40 }}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={theme.primary}
        maximumTrackTintColor={theme.base300}
        thumbTintColor={theme.primary}
      />
    </View>
  );
}
