import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";
import { getTabConfig } from "../../config/tabNavigation";

const TabItem = ({
  isFocused,
  onPress,
  onLongPress,
  iconName,
  label,
  colors,
}: any) => {

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
        <Ionicons
          name={iconName as any}
          size={24}
          color={isFocused ? colors.primary : colors.secondary}
          style={{ marginBottom: 4 }}
        />
        <Text
          style={{
            color: isFocused ? colors.baseContent : colors.secondary,
            fontWeight: isFocused ? "600" : "400",
            fontSize: 11,
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const CenterButton = ({ colors, onPress }: any) => {
  return (
    <View style={styles.centerButtonWrapper}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[
          styles.centerButton,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
          },
        ]}
      >
        <Ionicons name="add" size={32} color={colors.primaryContent} />
      </TouchableOpacity>
    </View>
  );
};

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
  showCenterButton = true,
  onCenterButtonPress,
}: any) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View
      style={[
        styles.container,
        {
          bottom: insets.bottom > 0 ? insets.bottom : 20,
          backgroundColor: colors.base100,
          borderColor: colors.base300,
        },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const tabConfig = getTabConfig(route.name);
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : tabConfig?.title || route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        let iconName: any = tabConfig?.baseIcon || "home";
        iconName = isFocused ? iconName : `${iconName}-outline`;

        return (
          <React.Fragment key={route.key}>
            {showCenterButton &&
              index === Math.floor(state.routes.length / 2) && (
                <CenterButton colors={colors} onPress={onCenterButtonPress} />
              )}
            <TabItem
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              iconName={iconName}
              label={label as string}
              colors={colors}
            />
          </React.Fragment>
        );
      })}
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
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 0.10,
    // shadowRadius: 10,
    elevation: 1,
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
  activeIndicator: {
    width: 20,
    height: 3,
    borderRadius: 2,
    marginTop: 6,
    position: "absolute",
    bottom: -6,
  },
  centerButtonWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 15,
  },
});
