import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Txt } from "../../common/Typography";

export interface RadioProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  disabled?: boolean;
}

export default function Radio({
  checked,
  onChange,
  label,
  disabled,
}: RadioProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onChange}
      style={{
        flexDirection: "row",
        alignItems: "center",
        opacity: disabled ? 0.5 : 1,
        marginBottom: 8,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: checked ? theme.primary : theme.base300,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
        }}
      >
        {checked && (
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: theme.primary }} />
        )}
      </View>
      {label && <Txt color={theme.baseContent} variant="base">{label}</Txt>}
    </TouchableOpacity>
  );
}
