import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export default function Checkbox({
  checked,
  onChange,
  label,
  disabled,
}: CheckboxProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={() => onChange(!checked)}
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
          borderRadius: 6,
          borderWidth: checked ? 0 : 2,
          borderColor: theme.base300,
          backgroundColor: checked ? theme.primary : "transparent",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
        }}
      >
        {checked && <Ionicons name="checkmark" size={16} color={theme.primaryContent} />}
      </View>
      {label && <Text style={{ color: theme.baseContent, fontSize: 15 }}>{label}</Text>}
    </TouchableOpacity>
  );
}
