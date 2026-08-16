import React from "react";
import { View } from "react-native";
import CommunitySlider from "@react-native-community/slider";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Txt } from "../../common/Typography";

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
          <Txt color={theme.baseContent} weight="semibold">{label}</Txt>
          <Txt color={theme.secondary}>{value}</Txt>
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
