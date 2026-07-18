import React from "react";
import { Image as ExpoImage, ImageProps as ExpoImageProps } from "expo-image";
import { View, ActivityIndicator, DimensionValue } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";

export interface ImageProps extends Omit<ExpoImageProps, "source"> {
  fallbackIcon?: React.ReactNode;
  src?: string | number | any;
  source?: any;
  width?: DimensionValue;
  height?: DimensionValue;
}

export default function Image({ style, src, source, width, height, ...props }: ImageProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  return (
    <View style={[{ overflow: "hidden", backgroundColor: "transparent", width: width, height: height }, style]}>
      <ExpoImage
        source={src ? (typeof src === "string" ? { uri: src } : src) : source}
        style={{ width: "100%", height: "100%" }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        transition={300}
        {...props}
      />
      {(isLoading || hasError) && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
          {isLoading ? (
            <ActivityIndicator color={theme.primary} />
          ) : (
             props.fallbackIcon
          )}
        </View>
      )}
    </View>
  );
}
