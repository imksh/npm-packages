import React from "react";
import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface ContainerProps extends ViewProps {
  safeArea?: boolean;
}

export default function Container({ children, style, safeArea = true, ...props }: ContainerProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        { flex: 1, paddingHorizontal: 20 },
        safeArea && { paddingTop: insets.top, paddingBottom: insets.bottom },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
