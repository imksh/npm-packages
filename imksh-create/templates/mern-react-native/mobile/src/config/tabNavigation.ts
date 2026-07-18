import { Ionicons } from "@expo/vector-icons";

export interface TabConfig {
  name: string;
  title: string;
  baseIcon: keyof typeof Ionicons.glyphMap;
}

export const tabNavigationConfig: TabConfig[] = [
  {
    name: "index",
    title: "Home",
    baseIcon: "home",
  },
  {
    name: "search",
    title: "Search",
    baseIcon: "search",
  },
  {
    name: "dashboard",
    title: "Dashboard",
    baseIcon: "cube",
  },
  {
    name: "profile",
    title: "Profile",
    baseIcon: "person",
  },
];

export const getTabConfig = (routeName: string) => {
  return tabNavigationConfig.find((tab) => tab.name === routeName);
};
