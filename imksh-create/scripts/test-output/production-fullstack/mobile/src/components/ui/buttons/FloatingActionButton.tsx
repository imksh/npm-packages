import React from "react";
import { TouchableOpacity, StyleProp, ViewStyle, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";

export interface FABProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function FloatingActionButton({
  icon,
  onPress,
  position = "bottom-right",
  isLoading = false,
  style,
}: FABProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const getPositionStyles = (): ViewStyle => {
    switch (position) {
      case "bottom-left":
        return { bottom: 20, left: 20 };
      case "bottom-center":
        return { bottom: 20, alignSelf: "center" };
      case "bottom-right":
      default:
        return { bottom: 20, right: 20 };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isLoading}
      style={[
        styles.fab,
        { backgroundColor: theme.primary, shadowColor: theme.primary },
        getPositionStyles(),
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={theme.primaryContent} size="small" />
      ) : (
        <Ionicons name={icon} size={28} color={theme.primaryContent} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 999,
  },
});
