import React from "react";
import { View, ViewProps } from "react-native";

export interface GridProps extends ViewProps {
  cols?: number;
  gap?: number;
  children: React.ReactNode;
}

export interface GridItemProps extends ViewProps {
  colSpan?: number;
  children: React.ReactNode;
}

export function GridItem({
  children,
  ...props
}: GridItemProps) {
  return <View {...props}>{children}</View>;
}

export default function Grid({
  cols = 2,
  gap = 12,
  children,
  style,
  ...props
}: GridProps) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          flexWrap: "wrap",
          margin: -gap / 2,
        },
        style,
      ]}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;

        const colSpan = Math.min(
          (child as React.ReactElement<GridItemProps>).props.colSpan ?? 1,
          cols
        );

        return (
          <View
            style={{
              width: `${(100 / cols) * colSpan}%`,
              padding: gap / 2,
            }}
          >
            {child}
          </View>
        );
      })}
    </View>
  );
}