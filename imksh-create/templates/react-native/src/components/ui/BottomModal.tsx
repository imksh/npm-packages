import React, { useEffect, useState } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Portal } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

interface BottomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  heightPercent?: number; // e.g. 0.5 for 50% of the screen height
}

export default function BottomModal({
  isOpen,
  onClose,
  children,
  heightPercent = 0.5,
}: BottomModalProps) {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const MODAL_HEIGHT = height * heightPercent;
  const translateY = useSharedValue(MODAL_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const [isRendered, setIsRendered] = useState(false);

  if (isOpen && !isRendered) {
    setIsRendered(true);
  }

  useEffect(() => {
    if (isOpen) {
      translateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      backdropOpacity.value = withTiming(0.4, { duration: 300 });
    } else {
      translateY.value = withTiming(MODAL_HEIGHT, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
      backdropOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished) {
          runOnJS(setIsRendered)(false);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        // eslint-disable-next-line react-hooks/immutability
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > MODAL_HEIGHT * 0.3 || event.velocityY > 500) {
        runOnJS(onClose)();
      } else {
        // eslint-disable-next-line react-hooks/immutability
        translateY.value = withTiming(0, {
          duration: 300,
          easing: Easing.out(Easing.ease),
        });
      }
    });

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!isRendered && !isOpen) return null;

  return (
    <Portal>
      <View style={[StyleSheet.absoluteFill, { zIndex: 999 }]}>
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

        {/* Sliding Bottom Modal Panel */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              {
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: MODAL_HEIGHT,
                backgroundColor: colors.base100,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                elevation: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -5 },
                shadowOpacity: 0.15,
                shadowRadius: 15,
                paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
              },
              modalAnimatedStyle,
            ]}
          >
            {/* Drag Handle Indicator */}
            <View className="items-center py-4">
              <View className="w-12 h-1.5 rounded-full bg-base-300" />
            </View>

            {/* Modal Content */}
            <View className="flex-1 px-6">{children}</View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Portal>
  );
}
