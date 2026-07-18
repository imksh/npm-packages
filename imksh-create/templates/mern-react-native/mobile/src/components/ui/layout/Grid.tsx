import React from "react";
import { View, ViewProps } from "react-native";

export interface GridProps extends ViewProps {
  columns?: number;
  gap?: number;
  children: React.ReactNode[];
}

export default function Grid({ columns = 2, gap = 12, children, style, ...props }: GridProps) {
  return (
    <View style={[{ flexDirection: "row", flexWrap: "wrap", margin: -gap / 2 }, style]} {...props}>
      {React.Children.map(children, (child) => (
        <View style={{ width: `${100 / columns}%`, padding: gap / 2 }}>
          {child}
        </View>
      ))}
    </View>
  );
}
