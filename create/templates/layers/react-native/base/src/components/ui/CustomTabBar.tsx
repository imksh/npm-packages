import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";
import { getTabConfig } from "../../config/tabNavigation";
import { LinearGradient } from "expo-linear-gradient";
import type {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from "expo-router/tabs";

interface TabItemProps {
  isFocused: boolean;
  isCenterButton?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  label?: string;
  colors: (typeof Colors)[keyof typeof Colors];
}

const TabItem = React.memo(({
  isFocused,
  onPress,
  onLongPress,
  iconName,
  colors,
}: TabItemProps) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabButton}
      activeOpacity={0.8}
    >
      <View style={styles.tabItem}>
        <View
          style={[
            styles.iconWrapper,
            isFocused && {
              backgroundColor: colors.primary,
              width: 50,
              height: 50,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Ionicons
            name={iconName}
            size={isFocused ? 20 : 24}
            color={isFocused ? colors.primaryContent : colors.secondary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
});
TabItem.displayName = "TabItem";

export type CustomTabBarProps = BottomTabBarProps & {
  navigation?: {
    emit?: (event: Parameters<BottomTabBarProps["emitter"]["emit"]>[0]) => { defaultPrevented?: boolean };
    navigate?: (name: string, params?: unknown) => void;
  };
  showCenterButton?: boolean;
  centerIcon?: keyof typeof Ionicons.glyphMap;
  onCenterButtonPress?: () => void;
};

export default function CustomTabBar(props: CustomTabBarProps) {
  const {
    state,
    descriptors,
    navigation,
    emitter,
    navigateToTab,
    showCenterButton = true,
    onCenterButtonPress,
    centerIcon = "add",
  } = props;
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const currentRoute = state.routes[state.index];
  const currentOptions = descriptors[currentRoute.key]?.options as
    | (BottomTabNavigationOptions & { href?: string | null })
    | undefined;
  const flatTabBarStyle = currentOptions?.tabBarStyle
    ? (StyleSheet.flatten(
        currentOptions.tabBarStyle as StyleProp<ViewStyle>,
      ) as ViewStyle | undefined)
    : undefined;
  if (flatTabBarStyle?.display === "none") {
    return null;
  }

  // Small spacing above the bottom
  const bottomOffset = insets.bottom > 0 ? 5 : 20;
  const totalTabBarHeight = bottomOffset + 70;

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[`${colors.base100}00`, colors.base100, colors.base100]}
        locations={[0, 0.5, 1]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: totalTabBarHeight,
        }}
        pointerEvents="none"
      />
      <View
        style={[
          styles.container,
          {
            bottom: bottomOffset,
            backgroundColor: colors.base100,
            borderColor: colors.base300,
          },
        ]}
      >
        {(() => {
          const children: React.ReactNode[] = [];

          // Filter out hidden routes (e.g. href === null or display: none)
          const visibleRoutes = state.routes.filter((route) => {
            const options = descriptors[route.key]?.options as
              | (BottomTabNavigationOptions & { href?: string | null })
              | undefined;
            const flatItemStyle = options?.tabBarItemStyle
              ? (StyleSheet.flatten(
                  options.tabBarItemStyle as StyleProp<ViewStyle>,
                ) as ViewStyle | undefined)
              : undefined;
            return (
              options?.href !== null &&
              flatItemStyle?.display !== "none"
            );
          });

          visibleRoutes.forEach((route, visibleIndex: number) => {
            const options = descriptors[route.key]?.options as
              | (BottomTabNavigationOptions & { href?: string | null })
              | undefined;
            const tabConfig = getTabConfig(route.name);
            const label =
              typeof options?.tabBarLabel === "string"
                ? options.tabBarLabel
                : typeof options?.title === "string"
                  ? options.title
                  : tabConfig?.title || route.name;

            const isFocused = currentRoute?.key === route.key;

            const onPress = () => {
              const emitFn = navigation?.emit || emitter?.emit;
              const event = emitFn
                ? emitFn({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  })
                : { defaultPrevented: false };

              if (!isFocused && !event?.defaultPrevented) {
                if (navigateToTab) {
                  navigateToTab(route.key);
                } else if (navigation?.navigate) {
                  navigation.navigate(route.name, route.params);
                }
              }
            };

            const onLongPress = () => {
              const emitFn = navigation?.emit || emitter?.emit;
              if (emitFn) {
                emitFn({
                  type: "tabLongPress",
                  target: route.key,
                });
              }
            };

            const baseIcon = tabConfig?.baseIcon || "home";
            const iconName = (
              isFocused ? baseIcon : `${baseIcon}-outline`
            ) as keyof typeof Ionicons.glyphMap;

            // Insert center button in the middle of visible tabs
            if (
              showCenterButton &&
              visibleIndex === Math.floor(visibleRoutes.length / 2)
            ) {
              children.push(
                <TabItem
                  key="center-btn"
                  isCenterButton={true}
                  isFocused={false}
                  onPress={onCenterButtonPress}
                  iconName={centerIcon}
                  colors={colors}
                />,
              );
            }

            children.push(
              <TabItem
                key={route.key}
                isFocused={isFocused}
                onPress={onPress}
                onLongPress={onLongPress}
                iconName={iconName}
                label={label as string}
                colors={colors}
              />,
            );
          });

          return children;
        })()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 40,
    borderWidth: 1,
    elevation: 0.5,
    left: 0,
    right: 0,
    height: 70,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
