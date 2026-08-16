import React, { useState } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Txt } from "../../common/Typography";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  helperText?: string;
  containerStyle?: import("react-native").StyleProp<
    import("react-native").ViewStyle
  >;
  labelOnBorder?: boolean;
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  helperText,
  style,
  containerStyle,
  labelOnBorder = false,
  ...props
}: InputProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? theme.error
    : isFocused
      ? theme.primary
      : theme.base300;

  return (
    <View className="mb-4 relative">
      {!labelOnBorder && label && (
        <Txt
          color={theme.baseContent}
          weight="semibold"
          style={{ marginBottom: 6 }}
        >
          {label} {error ? "*" : ""}{" "}
        </Txt>
      )}

      {labelOnBorder && label && (
        <View
          style={{
            position: "absolute",
            top: -6,
            left: 12,
            backgroundColor: theme.base100,
            paddingHorizontal: 6,
            zIndex: 10,
          }}
        >
          <Txt
            color={
              error ? theme.error : isFocused ? theme.primary : theme.secondary
            }
            variant="xs"
            weight="semibold"
          >
            {label} {error ? "*" : ""}
          </Txt>
        </View>
      )}

      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.base100,
            borderWidth: 1,
            borderColor,
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 52,
          },
          containerStyle,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isFocused ? theme.primary : theme.secondary}
            style={{ marginRight: 8 }}
          />
        )}

        <TextInput
          style={[
            {
              flex: 1,
              color: theme.baseContent,
              fontSize: 16,
              height: "100%",
            },
            style,
          ]}
          placeholderTextColor={theme.secondary}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={theme.secondary}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        )}
      </View>

      {(error || helperText) && (
        <Txt
          style={{
            color: error ? theme.error : theme.secondary,
            fontSize: 12,
            marginTop: 4,
            marginLeft: 4,
          }}
        >
          {error || helperText}
        </Txt>
      )}
    </View>
  );
}
