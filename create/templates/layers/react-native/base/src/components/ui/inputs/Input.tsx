import { useState } from "react";
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
  placeHolder?: string;
  style?: import("react-native").StyleProp<import("react-native").ViewStyle>;
  helperText?: string;
  containerStyle?: import("react-native").StyleProp<
    import("react-native").ViewStyle
  >;
  labelOnBorder?: boolean;
  className?: string;
  weight?: "normal" | "medium" | "bold" | "semibold" | "black";
  size?: "sm" | "md" | "lg";
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  helperText,
  style,
  placeHolder = "",
  containerStyle,
  labelOnBorder = false,
  className = "mb-2",
  weight = "normal",
  size = "md",
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

  const inputHeight = size === "sm" ? 40 : size === "lg" ? 64 : 52;
  const inputFontSize = size === "sm" ? 14 : size === "lg" ? 18 : 16;
  const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;
  const labelSize = size === "sm" ? "xs" : size === "lg" ? "lg" : "base";
  return (
    <View
      className={`${className} relative ${props.editable === false ? "opacity-50" : ""}`}
    >
      {!labelOnBorder && label && (
        <Txt
          color={theme.baseContent}
          style={{ marginBottom: 6 }}
          weight={weight}
          variant={labelSize}
          adjustsFontSizeToFit
          numberOfLines={1}
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
            backgroundColor: theme.base200,
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
            backgroundColor: theme.base200,
            borderWidth: 1,
            borderColor,
            borderRadius: 12,
            paddingHorizontal: 12,
            height: inputHeight,
          },
          containerStyle,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={iconSize}
            color={isFocused ? theme.primary : theme.secondary}
            style={{ marginRight: 8 }}
          />
        )}

        <TextInput
          style={[
            {
              flex: 1,
              color: theme.baseContent,
              fontSize: inputFontSize,
              height: "100%",
            },
            style,
          ]}
          placeholderTextColor={theme.secondary}
          placeholder={placeHolder}
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
              size={iconSize}
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
