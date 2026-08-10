import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, LayoutChangeEvent } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Txt } from "../../common/Typography";
import Animated, { useAnimatedStyle, withTiming, useSharedValue, Easing } from "react-native-reanimated";

export interface TabItem {
  id: string;
  label: string;
}

export type TabsSize = "xs" | "sm" | "base" | "md" | "lg";

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "button" | "underline";
  scrollable?: boolean;
  size?: TabsSize;
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "underline",
  scrollable = false,
  size = "base",
}: TabsProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const getSizeStyles = (): {
    py: number;
    fontSize: number;
  } => {
    switch (size) {
      case "xs":
        return { py: variant === "button" ? 5 : 6, fontSize: 11 };
      case "sm":
        return { py: variant === "button" ? 7 : 8, fontSize: 12 };
      case "base":
        return { py: variant === "button" ? 9 : 10, fontSize: 14 };
      case "md":
        return { py: variant === "button" ? 11 : 12, fontSize: 15 };
      case "lg":
        return { py: variant === "button" ? 13 : 14, fontSize: 17 };
      default:
        return { py: variant === "button" ? 9 : 10, fontSize: 14 };
    }
  };

  const sStyles = getSizeStyles();

  const [tabWidths, setTabWidths] = useState<{ [key: string]: number }>({});
  const [tabXs, setTabXs] = useState<{ [key: string]: number }>({});

  const indicatorWidth = useSharedValue(0);
  const indicatorPosition = useSharedValue(0);

  React.useEffect(() => {
    if (tabWidths[activeTab] !== undefined && tabXs[activeTab] !== undefined) {
      const config = { duration: 250, easing: Easing.out(Easing.cubic) };
      indicatorWidth.value = withTiming(tabWidths[activeTab], config);
      indicatorPosition.value = withTiming(tabXs[activeTab], config);
    }
     
  }, [activeTab, tabWidths, tabXs]);

  const indicatorStyle = useAnimatedStyle(() => {
    if (variant === "underline") {
      return {
        position: "absolute",
        bottom: 0,
        height: 2,
        backgroundColor: theme.primary,
        width: indicatorWidth.value,
        transform: [{ translateX: indicatorPosition.value }],
      };
    } else {
      return {
        position: "absolute",
        top: 4,
        bottom: 4,
        borderRadius: 12, // matched to rounded-xl in login
        backgroundColor: theme.primary,
        width: indicatorWidth.value,
        transform: [{ translateX: indicatorPosition.value }],
      };
    }
  });

  const handleLayout = (id: string, e: LayoutChangeEvent) => {
    const { width, x } = e.nativeEvent.layout;
    setTabWidths((prev) => ({ ...prev, [id]: width }));
    setTabXs((prev) => ({ ...prev, [id]: x }));
  };

  const content = (
    <View
      style={{
        flexDirection: "row",
        position: "relative",
        ...(variant === "button"
          ? {
              backgroundColor: theme.base300 + "80", // like bg-base-300/50
              borderRadius: 16, // rounded-2xl
              padding: 4, // p-1
              borderWidth: 1,
              borderColor: theme.base300,
            }
          : {
              borderBottomWidth: 1,
              borderBottomColor: theme.base300,
            }),
      }}
    >
      <Animated.View style={indicatorStyle} />

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onChange(tab.id)}
            onLayout={(e) => handleLayout(tab.id, e)}
            style={{
              paddingVertical: sStyles.py,
              paddingHorizontal: 16,
              flex: scrollable ? undefined : 1,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <Txt
              variant="md"
              style={{
                fontSize: sStyles.fontSize,
                fontWeight: isActive ? "600" : "500",
                color:
                  variant === "button" && isActive
                    ? theme.primaryContent
                    : isActive
                    ? theme.primary
                    : theme.baseContent,
                opacity: !isActive && variant === "button" ? 0.7 : 1,
              }}
            >
              {tab.label}
            </Txt>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {content}
      </ScrollView>
    );
  }

  return content;
}
