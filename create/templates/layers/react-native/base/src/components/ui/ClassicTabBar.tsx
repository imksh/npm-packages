import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Colors } from '../../constants/Colors';
import { getTabConfig } from '../../config/tabNavigation';
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

interface TabItemProps {
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  colors: (typeof Colors)[keyof typeof Colors];
}

const TabItem = ({ isFocused, onPress, onLongPress, iconName, colors }: TabItemProps) => {
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
          name={iconName} 
          size={28} 
          color={isFocused ? colors.primary : colors.baseContent + '60'} 
        />
      </View>
    </TouchableOpacity>
  );
};

export default function ClassicTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.base100,
        borderTopColor: colors.base300 + '80',
        height: 72 + insets.bottom,
        paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
        elevation:1
      }
    ]}>
      {state.routes.map((route, index: number) => {
        const { options } = descriptors[route.key];
        const tabConfig = getTabConfig(route.name);
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const baseIcon = tabConfig?.baseIcon || "home";
        const iconName = (isFocused ? baseIcon : `${baseIcon}-outline`) as keyof typeof Ionicons.glyphMap;

        return (
          <TabItem
            key={route.key}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            iconName={iconName}
            colors={colors}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
