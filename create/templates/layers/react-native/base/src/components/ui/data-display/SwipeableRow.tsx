import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
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
  const _colors = Colors[isDark ? "dark" : "light"];

  const renderActions = (
    actions: SwipeAction[],
    isRight: boolean,
  ) => {
    if (actions.length === 0) return null;

    return (
      <View
        style={[
          styles.actionsContainer,
          isRight ? styles.rightActions : styles.leftActions,
          { borderRadius: 16, overflow: "hidden", marginVertical: 1 },
        ]}
      >
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
    <ReanimatedSwipeable
      friction={2}
      leftThreshold={40}
      rightThreshold={40}
      renderLeftActions={() => renderActions(leftActions, false)}
      renderRightActions={() => renderActions(rightActions, true)}
      onSwipeableOpen={onSwipeOpen}
      onSwipeableClose={onSwipeClose}
      containerStyle={containerStyle}
    >
      <View style={{ flex: 1, backgroundColor: "transparent" }}>
        {children}
      </View>
    </ReanimatedSwipeable>
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
