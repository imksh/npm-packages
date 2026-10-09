import React from "react";
import { View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";

export type SwipeAction = {
  icon: React.ReactNode;
  backgroundColor: string;
  onPress: () => void;
  width?: number;
};

interface SwipeableRowProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  containerStyle?: StyleProp<ViewStyle>;
  onSwipeOpen?: () => void;
  onSwipeClose?: () => void;
}

export const SwipeableRow: React.FC<SwipeableRowProps> = ({
  children,
  leftActions = [],
  rightActions = [],
  containerStyle,
  onSwipeOpen,
  onSwipeClose,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const renderActions = (actions: SwipeAction[], progress: any, dragX: any, isRight: boolean) => {
    if (actions.length === 0) return null;

    return (
      <View style={[styles.actionsContainer, isRight ? styles.rightActions : styles.leftActions]}>
        {actions.map((action, index) => {
          const actionWidth = action.width || 75;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionButton,
                { backgroundColor: action.backgroundColor, width: actionWidth },
              ]}
              onPress={action.onPress}
              activeOpacity={0.8}
            >
              {action.icon}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <Swipeable
      friction={2}
      leftThreshold={40}
      rightThreshold={40}
      renderLeftActions={(progress, dragX) => renderActions(leftActions, progress, dragX, false)}
      renderRightActions={(progress, dragX) => renderActions(rightActions, progress, dragX, true)}
      onSwipeableOpen={onSwipeOpen}
      onSwipeableClose={onSwipeClose}
      containerStyle={containerStyle}
    >
      <View style={{ backgroundColor: colors.base100 }}>
        {children}
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftActions: {
    justifyContent: "flex-start",
  },
  rightActions: {
    justifyContent: "flex-end",
  },
  actionButton: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
