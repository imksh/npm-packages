import React, { useEffect, useState } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Portal } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export type DrawerPosition = "top" | "bottom" | "left" | "right";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: DrawerPosition;
  sizePercent?: number; // e.g. 0.5 for 50% of the screen height (top/bottom) or width (left/right)
  heightPercent?: number; // backwards compatibility alias for top/bottom
  widthPercent?: number; // backwards compatibility alias for left/right
  showHandle?: boolean;
  zIndex?: number;
}

export default function Drawer({
  isOpen,
  onClose,
  children,
  position = "bottom",
  sizePercent,
  heightPercent,
  widthPercent,
  showHandle = true,
  zIndex = 50,
}: DrawerProps) {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const isVertical = position === "top" || position === "bottom";
  const defaultPercent = isVertical ? 0.5 : 0.75;
  const resolvedPercent =
    sizePercent ??
    (isVertical ? heightPercent : widthPercent) ??
    defaultPercent;

  const DRAWER_SIZE = isVertical
    ? SCREEN_HEIGHT * resolvedPercent
    : SCREEN_WIDTH * resolvedPercent;

  const getClosedOffset = () => {
    switch (position) {
      case "top":
      case "left":
        return -DRAWER_SIZE;
      case "bottom":
      case "right":
        return DRAWER_SIZE;
    }
  };

  const translate = useSharedValue(getClosedOffset());
  const backdropOpacity = useSharedValue(0);
  const [isRendered, setIsRendered] = useState(false);

  if (isOpen && !isRendered) {
    setIsRendered(true);
  }

  useEffect(() => {
    const closedOffset = getClosedOffset();
    if (isOpen) {
      translate.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      backdropOpacity.value = withTiming(0.4, { duration: 300 });
    } else {
      translate.value = withTiming(closedOffset, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
      backdropOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished) {
          runOnJS(setIsRendered)(false);
        }
      });
    }
  }, [isOpen, DRAWER_SIZE, position]);

  useEffect(() => {
    if (!isOpen) return;

    const backAction = () => {
      onClose();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isOpen, onClose]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (position === "bottom") {
        if (event.translationY > 0) {
          translate.value = event.translationY;
        }
      } else if (position === "top") {
        if (event.translationY < 0) {
          translate.value = event.translationY;
        }
      } else if (position === "left") {
        if (event.translationX < 0) {
          translate.value = event.translationX;
        }
      } else if (position === "right") {
        if (event.translationX > 0) {
          translate.value = event.translationX;
        }
      }
    })
    .onEnd((event) => {
      let shouldClose = false;
      if (position === "bottom") {
        shouldClose =
          event.translationY > DRAWER_SIZE * 0.3 || event.velocityY > 500;
      } else if (position === "top") {
        shouldClose =
          event.translationY < -DRAWER_SIZE * 0.3 || event.velocityY < -500;
      } else if (position === "left") {
        shouldClose =
          event.translationX < -DRAWER_SIZE * 0.3 || event.velocityX < -500;
      } else if (position === "right") {
        shouldClose =
          event.translationX > DRAWER_SIZE * 0.3 || event.velocityX > 500;
      }

      if (shouldClose) {
        runOnJS(onClose)();
      } else {
        translate.value = withTiming(0, {
          duration: 300,
          easing: Easing.out(Easing.ease),
        });
      }
    });

  const drawerAnimatedStyle = useAnimatedStyle(() => {
    if (position === "left" || position === "right") {
      return {
        transform: [{ translateX: translate.value }],
      };
    }
    return {
      transform: [{ translateY: translate.value }],
    };
  });

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const getContainerStyle = (): ViewStyle => {
    const baseShadow: ViewStyle = {
      backgroundColor: colors.base100,
      elevation: 24,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 15,
    };

    switch (position) {
      case "top":
        return {
          ...baseShadow,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: DRAWER_SIZE,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          shadowOffset: { width: 0, height: 5 },
          paddingTop: insets.top > 0 ? insets.top : 20,
        };
      case "bottom":
        return {
          ...baseShadow,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: DRAWER_SIZE,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          shadowOffset: { width: 0, height: -5 },
          paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
        };
      case "left":
        return {
          ...baseShadow,
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: DRAWER_SIZE,
          borderTopRightRadius: 30,
          borderBottomRightRadius: 30,
          shadowOffset: { width: 5, height: 0 },
          paddingTop: insets.top > 0 ? insets.top : 20,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
          paddingLeft: insets.left > 0 ? insets.left : 0,
        };
      case "right":
        return {
          ...baseShadow,
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: DRAWER_SIZE,
          borderTopLeftRadius: 30,
          borderBottomLeftRadius: 30,
          shadowOffset: { width: -5, height: 0 },
          paddingTop: insets.top > 0 ? insets.top : 20,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
          paddingRight: insets.right > 0 ? insets.right : 0,
        };
    }
  };

  if (!isRendered && !isOpen) return null;

  return (
    <Portal>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none"
      >
        <View style={[StyleSheet.absoluteFill, { zIndex }]}>
          {/* Backdrop Overlay */}
          <TouchableWithoutFeedback onPress={onClose}>
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "#000" },
                backdropAnimatedStyle,
              ]}
            />
          </TouchableWithoutFeedback>

          {/* Sliding Drawer Panel */}
          <Animated.View style={[getContainerStyle(), drawerAnimatedStyle]}>
            {position === "bottom" && (
              <View className="flex-1">
                {showHandle && (
                  <GestureDetector gesture={panGesture}>
                    <View
                      className="items-center pt-4 pb-6 bg-base-100 rounded-t-[30px]"
                      style={{ zIndex: 10 }}
                    >
                      <View className="w-16 h-1.5 rounded-full bg-base-300" />
                    </View>
                  </GestureDetector>
                )}
                <View className="flex-1 px-6">{children}</View>
              </View>
            )}

            {position === "top" && (
              <View className="flex-1">
                <View className="flex-1 px-6">{children}</View>
                {showHandle && (
                  <GestureDetector gesture={panGesture}>
                    <View
                      className="items-center pt-4 pb-6 bg-base-100 rounded-b-[30px]"
                      style={{ zIndex: 10 }}
                    >
                      <View className="w-16 h-1.5 rounded-full bg-base-300" />
                    </View>
                  </GestureDetector>
                )}
              </View>
            )}

            {position === "left" && (
              <View className="flex-1 flex-row">
                <View className="flex-1 px-6">{children}</View>
                {showHandle && (
                  <GestureDetector gesture={panGesture}>
                    <View
                      className="justify-center items-center px-3 bg-base-100 rounded-r-[30px]"
                      style={{ zIndex: 10 }}
                    >
                      <View className="w-1.5 h-16 rounded-full bg-base-300" />
                    </View>
                  </GestureDetector>
                )}
              </View>
            )}

            {position === "right" && (
              <View className="flex-1 flex-row">
                {showHandle && (
                  <GestureDetector gesture={panGesture}>
                    <View
                      className="justify-center items-center px-3 bg-base-100 rounded-l-[30px]"
                      style={{ zIndex: 10 }}
                    >
                      <View className="w-1.5 h-16 rounded-full bg-base-300" />
                    </View>
                  </GestureDetector>
                )}
                <View className="flex-1 px-6">{children}</View>
              </View>
            )}
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Portal>
  );
}
