import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Colors } from '../../constants/Colors';
import { getTabConfig } from '../../config/tabNavigation';

const TabItem = ({ isFocused, onPress, onLongPress, iconName, label, colors }: any) => {
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
            color: isFocused ? colors.primary : colors.secondary, 
            fontWeight: isFocused ? '600' : '500', 
            fontSize: 11 
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function ClassicTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.base100, 
        borderTopColor: colors.base300,
        height: 60 + insets.bottom,
        paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
      }
    ]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const tabConfig = getTabConfig(route.name);
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : tabConfig?.title || route.name;

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

        let iconName: any = tabConfig?.baseIcon || "home";
        iconName = isFocused ? iconName : `${iconName}-outline`;

        return (
          <TabItem
            key={route.key}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            iconName={iconName}
            label={label as string}
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
    paddingVertical: 8,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
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
    height: 50,
  },
});
