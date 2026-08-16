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
    name: "explore",
    title: "Explore",
    baseIcon: "compass",
  },
  {
    name: "payments",
    title: "Payments",
    baseIcon: "wallet",
  },
  {
    name: "notifications",
    title: "Notifications",
    baseIcon: "notifications",
  },
  {
    name: "profile",
    title: "Profile",
    baseIcon: "person-circle",
  },
  {
    name: "properties",
    title: "Properties",
    baseIcon: "business",
  },
  {
    name: "tenant",
    title: "Tenant",
    baseIcon: "people",
  },
  {
    name: "users",
    title: "Users",
    baseIcon: "people",
  },
  {
    name: "requests",
    title: "Requests",
    baseIcon: "clipboard",
  },
  {
    name: "more",
    title: "More",
    baseIcon: "ellipsis-horizontal",
  },
];

export const getTabConfig = (routeName: string) => {
  return tabNavigationConfig.find((tab) => tab.name === routeName);
};
