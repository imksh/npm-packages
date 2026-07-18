import React from "react";
import { View, Text, ViewProps } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";

export interface SectionProps extends ViewProps {
  title?: string;
  titleClass?: string;
  action?: React.ReactNode;
}

export default function Section({
  title,
  titleClass = "",
  action,
  children,
  style,
  ...props
}: SectionProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View style={[{ marginBottom: 24 }, style]} {...props}>
      {(title || action) && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          {title && (
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: theme.baseContent,
              }}
              className={titleClass}
            >
              {title}
            </Text>
          )}
          {action}
        </View>
      )}
      {children}
    </View>
  );
}
