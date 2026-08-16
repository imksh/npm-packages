import React from "react";
import { View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Txt } from "../../common/Typography";

export interface OTPProps {
  length?: number;
  onTextChange?: (text: string) => void;
  onFilled?: (text: string) => void;
  label?: string;
  labelOnBorder?:boolean;
  error?: string;
}

export default function OTPInput({
  length = 4,
  onTextChange,
  onFilled,
  label,
  error,
  labelOnBorder = false,
}: OTPProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View className={`mb-4 ${labelOnBorder ? 'relative' : ''}`}>
      {!labelOnBorder && label && (
        <Txt
          color={theme.baseContent}
          weight="semibold"
          style={{ marginBottom: 8 }}
        >
          {label}
        </Txt>
      )}

      {labelOnBorder && label && (
        <View style={{ position: 'absolute', top: -9, left: 12, backgroundColor: theme.base100, paddingHorizontal: 4, zIndex: 10, elevation: 2 }}>
          <Txt color={error ? theme.error : theme.secondary} variant="xs" weight="semibold">
            {label}
          </Txt>
        </View>
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
          pinCodeTextStyle: {
            color: theme.baseContent,
            fontSize: 24,
            fontWeight: "700",
          },
        }}
      />

      {error && (
        <Txt
          color={theme.error}
          variant="sm"
          style={{ marginTop: 8, marginLeft: 4 }}
        >
          {error}
        </Txt>
      )}
    </View>
  );
}
