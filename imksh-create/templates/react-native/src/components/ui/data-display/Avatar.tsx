import React from "react";
import { View, Text, ViewProps } from "react-native";
import { Image } from "expo-image";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";

export interface AvatarProps extends ViewProps {
  url?: string;
  initials?: string;
  size?: number;
}

export default function Avatar({ url, initials, size = 48, style, ...props }: AvatarProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.base300,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      {...props}
    >
      {url ? (
        <Image
          source={{ uri: url }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      ) : (
        <Text style={{ color: theme.baseContent, fontSize: size * 0.4, fontWeight: "600" }}>
          {initials?.substring(0, 2).toUpperCase()}
        </Text>
      )}
    </View>
  );
}
