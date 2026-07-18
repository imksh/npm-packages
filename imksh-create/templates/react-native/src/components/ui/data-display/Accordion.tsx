import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  measure,
  useAnimatedRef,
  runOnUI,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";

export interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export default function Accordion({ title, children }: AccordionProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [isOpen, setIsOpen] = useState(false);
  const heightValue = useSharedValue(0);
  const progress = useSharedValue(0);
  const aref = useAnimatedRef<View>();

  const toggleAccordion = () => {
    if (isOpen) {
      heightValue.value = withTiming(0, { duration: 300 });
      progress.value = withTiming(0, { duration: 300 });
      setIsOpen(false);
    } else {
      runOnUI(() => {
        "worklet";
        const measurement = measure(aref);
        if (measurement) {
          heightValue.value = withTiming(measurement.height, { duration: 300 });
          progress.value = withTiming(1, { duration: 300 });
        }
      })();
      setIsOpen(true);
    }
  };

  const bodyStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
    opacity: progress.value,
    overflow: "hidden",
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }));

  return (
    <View style={{ backgroundColor: theme.base200, borderRadius: 12, marginBottom: 8, overflow: "hidden" }}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleAccordion}
        style={{ padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
      >
        <Text style={{ color: theme.baseContent, fontWeight: "600", fontSize: 16 }}>{title}</Text>
        <Animated.View style={iconStyle}>
          <Ionicons name="chevron-down" size={24} color={theme.baseContent} />
        </Animated.View>
      </TouchableOpacity>
      
      <Animated.View style={bodyStyle}>
        <View
          style={{ position: "absolute", width: "100%", paddingHorizontal: 16, paddingBottom: 16 }}
        >
          {/* This inner view is measured */}
          <View ref={aref as any}>
            {children}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
