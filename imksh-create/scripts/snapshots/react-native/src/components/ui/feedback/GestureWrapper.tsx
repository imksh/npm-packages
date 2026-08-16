import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Gesture, GestureDetector, GestureType } from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";

interface GestureWrapperProps {
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  
  // Tap Gestures
  onTap?: () => void;
  onDoubleTap?: () => void;
  
  // Pan/Drag Gestures
  onPanStart?: (e: any) => void;
  onPanUpdate?: (e: any) => void;
  onPanEnd?: (e: any) => void;

  // Swipe Gestures
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export const GestureWrapper: React.FC<GestureWrapperProps> = ({
  children,
  containerStyle,
  onTap,
  onDoubleTap,
  onPanStart,
  onPanUpdate,
  onPanEnd,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}) => {
  const gestures: GestureType[] = [];

  // 1. Single Tap
  if (onTap) {
    const tap = Gesture.Tap().onEnd(() => {
      runOnJS(onTap)();
    });
    gestures.push(tap);
  }

  // 2. Double Tap
  if (onDoubleTap) {
    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .onEnd(() => {
        runOnJS(onDoubleTap)();
      });
    gestures.push(doubleTap);
  }

  // 3. Generic Pan / Drag
  if (onPanStart || onPanUpdate || onPanEnd) {
    const pan = Gesture.Pan()
      .onStart((e) => {
        if (onPanStart) runOnJS(onPanStart)(e);
      })
      .onUpdate((e) => {
        if (onPanUpdate) runOnJS(onPanUpdate)(e);
      })
      .onEnd((e) => {
        if (onPanEnd) runOnJS(onPanEnd)(e);
      });
    gestures.push(pan);
  }

  // 4. Directional Swipes (Fling)
  const SWIPE_VELOCITY_THRESHOLD = 500;
  
  if (onSwipeLeft || onSwipeRight || onSwipeUp || onSwipeDown) {
    const swipe = Gesture.Pan()
      .onEnd((e) => {
        // Horizontal Swipes
        if (Math.abs(e.velocityX) > Math.abs(e.velocityY)) {
          if (e.velocityX > SWIPE_VELOCITY_THRESHOLD && onSwipeRight) {
            runOnJS(onSwipeRight)();
          } else if (e.velocityX < -SWIPE_VELOCITY_THRESHOLD && onSwipeLeft) {
            runOnJS(onSwipeLeft)();
          }
        } 
        // Vertical Swipes
        else {
          if (e.velocityY > SWIPE_VELOCITY_THRESHOLD && onSwipeDown) {
            runOnJS(onSwipeDown)();
          } else if (e.velocityY < -SWIPE_VELOCITY_THRESHOLD && onSwipeUp) {
            runOnJS(onSwipeUp)();
          }
        }
      });
    gestures.push(swipe);
  }

  // If no gestures are provided, just return the children wrapped in a view
  if (gestures.length === 0) {
    return <Animated.View style={containerStyle}>{children}</Animated.View>;
  }

  // Combine all active gestures (Exclusive makes sure they don't fight each other if configured properly, 
  // but for generic wrapping, Simultaneous is safer so Pan and Swipe can co-exist).
  const composedGesture = Gesture.Simultaneous(...gestures);

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={containerStyle}>{children}</Animated.View>
    </GestureDetector>
  );
};
