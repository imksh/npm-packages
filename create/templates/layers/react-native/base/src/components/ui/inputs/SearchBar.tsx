import { useState, useEffect, useRef } from "react";
import Input, { InputProps } from "./Input";

export type SearchBarSize = "xs" | "sm" | "base" | "md" | "lg";

export interface SearchBarProps extends Omit<
  InputProps,
  "leftIcon" | "value" | "onChangeText" | "size"
> {
  size?: SearchBarSize;
  value?: string;
  onChangeText?: (text: string) => void;
  debounceMs?: number;
  showClearButton?: boolean;
}

export default function SearchBar({
  size = "base",
  debounceMs = 300,
  showClearButton = true,
  style,
  containerStyle,
  value,
  onChangeText,
  ...props
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(value || "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleTextChange = (text: string) => {
    setInternalValue(text);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const isScan = Math.abs(text.length - (value?.length || 0)) > 3;
    const isClear = text === "";

    if (debounceMs > 0 && !isClear && !isScan) {
      timerRef.current = setTimeout(() => {
        onChangeText?.(text);
      }, debounceMs);
    } else {
      onChangeText?.(text);
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "xs":
        return { height: 32, px: 10, fontSize: 12 };
      case "sm":
        return { height: 38, px: 12, fontSize: 13 };
      case "base":
        return { height: 44, px: 14, fontSize: 14 };
      case "md":
        return { height: 50, px: 16, fontSize: 15 };
      case "lg":
        return { height: 56, px: 18, fontSize: 16 };
      default:
        return { height: 44, px: 14, fontSize: 14 };
    }
  };

  const s = getSizeStyles();

  return (
    <Input
      {...props}
      leftIcon="search"
      placeholder={props.placeholder || "Search..."}
      style={[{ fontSize: s.fontSize }, style]}
      containerStyle={[
        {
          borderRadius: 9999,
          height: s.height,
          paddingHorizontal: s.px,
          backgroundColor: "rgba(0,0,0,0.05)",
          borderWidth: 0,
        },
        containerStyle,
      ]}
      value={internalValue}
      onChangeText={handleTextChange}
      rightIcon={
        showClearButton && internalValue ? "close-circle" : props.rightIcon
      }
      onRightIconPress={
        showClearButton && internalValue
          ? () => handleTextChange("")
          : props.onRightIconPress
      }
    />
  );
}
