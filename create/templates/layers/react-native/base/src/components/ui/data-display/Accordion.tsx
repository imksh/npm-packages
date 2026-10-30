import React, { useState, useEffect } from "react";
import {
  View,
  Pressable,
  LayoutAnimation,
  StyleProp,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Txt } from "../../common/Typography";

export interface AccordionProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  badge?: string;
  badgeVariant?: "primary" | "success" | "warning" | "neutral";
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  containerClassName?: string;
}

export default function Accordion({
  title,
  subtitle,
  icon,
  badge,
  badgeVariant = "primary",
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  children,
  containerStyle,
  headerStyle,
  contentStyle,
  containerClassName = "",
}: AccordionProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const isControlled = controlledIsOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? controlledIsOpen : internalOpen;

  const progress = useSharedValue(open ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, { duration: 250 });
  }, [open]);

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (!isControlled) {
      setInternalOpen(!open);
    }
    onToggle?.(!open);
  };

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }));

  const getBadgeColors = () => {
    switch (badgeVariant) {
      case "success":
        return { bg: theme.success + "20", text: theme.success };
      case "warning":
        return { bg: theme.warning + "25", text: theme.warning };
      case "neutral":
        return { bg: theme.baseContent + "15", text: theme.baseContent };
      case "primary":
      default:
        return { bg: theme.primary + "20", text: theme.primary };
    }
  };

  const badgeColors = getBadgeColors();

  return (
    <View
      className={`rounded-2xl border mb-3 overflow-hidden ${containerClassName}`}
      style={[
        {
          backgroundColor: theme.base200,
          borderColor: theme.base300,
        },
        containerStyle,
      ]}
    >
      <Pressable
        onPress={handleToggle}
        android_ripple={{ color: theme.base300 }}
        style={[
          {
            paddingVertical: 14,
            paddingHorizontal: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
          headerStyle,
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            marginRight: 8,
          }}
        >
          {icon && (
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: theme.primary + "15",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name={icon} size={20} color={theme.primary} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Txt color={theme.baseContent} weight="bold" variant="md">
              {title}
            </Txt>
            {subtitle ? (
              <Txt
                color={theme.baseContent}
                variant="xs"
                style={{ opacity: 0.6, marginTop: 2 }}
              >
                {subtitle}
              </Txt>
            ) : null}
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          {badge ? (
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 9999,
                backgroundColor: badgeColors.bg,
              }}
            >
              <Txt color={badgeColors.text} variant="xs" weight="medium">
                {badge}
              </Txt>
            </View>
          ) : null}
          <Animated.View style={iconStyle}>
            <Ionicons
              name="chevron-down"
              size={20}
              color={theme.baseContent}
              style={{ opacity: 0.7 }}
            />
          </Animated.View>
        </View>
      </Pressable>

      {open && (
        <View
          style={[
            {
              borderTopWidth: 1,
              borderTopColor: theme.base300,
              padding: 16,
            },
            contentStyle,
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
}
