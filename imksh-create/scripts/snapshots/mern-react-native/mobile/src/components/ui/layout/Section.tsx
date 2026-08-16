import React from "react";
import { View, ViewProps } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Txt } from "../../common/Typography";

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
            <Txt
              color={theme.baseContent}
              weight="bold"
              variant="lg"
              className={titleClass}
            >
              {title}
            </Txt>
          )}
          {action}
        </View>
      )}
      {children}
    </View>
  );
}
