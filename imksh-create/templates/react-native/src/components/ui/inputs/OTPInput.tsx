import React from "react";
import { View, Text } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";

export interface OTPProps {
  length?: number;
  onTextChange?: (text: string) => void;
  onFilled?: (text: string) => void;
  label?: string;
  error?: string;
}

export default function OTPInput({
  length = 4,
  onTextChange,
  onFilled,
  label,
  error,
}: OTPProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View className="mb-4">
      {label && (
        <Text style={{ color: theme.baseContent, marginBottom: 8, fontWeight: "500" }}>
          {label}
        </Text>
      )}
      
      <OtpInput
        numberOfDigits={length}
        onTextChange={onTextChange}
        onFilled={onFilled}
        focusColor={error ? theme.error : theme.primary}
        focusStickBlinkingDuration={500}
        theme={{
          containerStyle: { width: "100%" },
          pinCodeContainerStyle: {
            backgroundColor: theme.base100,
            borderColor: error ? theme.error : theme.base300,
            borderWidth: 1,
            borderRadius: 12,
            width: 56,
            height: 64,
          },
          pinCodeTextStyle: { color: theme.baseContent, fontSize: 24, fontWeight: "700" },
        }}
      />

      {error && (
        <Text style={{ color: theme.error, fontSize: 12, marginTop: 8, marginLeft: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
}
