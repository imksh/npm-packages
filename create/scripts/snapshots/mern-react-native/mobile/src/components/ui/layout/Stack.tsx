import React from "react";
import { View, ViewProps, FlexAlignType } from "react-native";

export interface StackProps extends ViewProps {
  direction?: "row" | "column";
  spacing?: number;
  align?: FlexAlignType;
  justify?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
}

export default function Stack({
  direction = "column",
  spacing = 8,
  align = "stretch",
  justify = "flex-start",
  children,
  style,
  ...props
}: StackProps) {
  return (
    <View
      style={[
        { flexDirection: direction, gap: spacing, alignItems: align, justifyContent: justify },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export const HStack = (props: Omit<StackProps, "direction">) => <Stack direction="row" {...props} />;
export const VStack = (props: Omit<StackProps, "direction">) => <Stack direction="column" {...props} />;
