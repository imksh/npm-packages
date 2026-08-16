export interface SidebarMenuItem {
  icon: string;
  label: string;
  route: string;
}

export const sidebarConfig: Record<string, SidebarMenuItem[]> = {
  owner: [
    { icon: "home-outline", label: "Dashboard", route: "/(owner)" },
    {
      icon: "business-outline",
      label: "Properties",
      route: "/(owner)/properties",
    },
    { icon: "card-outline", label: "Payments", route: "/(owner)/payments" },
    { icon: "people-outline", label: "Tenants", route: "/(owner)/tenant" },
    {
      icon: "clipboard-outline",
      label: "Requests",
      route: "/(owner)/requests",
    },
    {
      icon: "construct-outline",
      label: "Maintenance",
      route: "/(owner)/maintenance",
    },
    {
      icon: "flask-outline",
      label: "Test Notifications",
      route: "/(owner)/test-notifications",
    },
  ],
  tenant: [
    
    {
      icon: "business-outline",
      label: "My Units",
      route: "/(tenant)/my-units",
    },
    { icon: "search-outline", label: "Explore", route: "/(tenant)/explore" },
    { icon: "card-outline", label: "Payments", route: "/(tenant)/payments" },
    {
      icon: "construct-outline",
      label: "Maintenance",
      route: "/(tenant)/maintenance",
    },
    {
      icon: "document-text-outline",
      label: "Documents",
      route: "/(tenant)/documents",
    },
    {
      icon: "chatbubble-outline",
      label: "Messages",
      route: "/(tenant)/messages",
    },
    {
      icon: "notifications-outline",
      label: "Notifications",
      route: "/(tenant)/notifications",
    },
    {
      icon: "flask-outline",
      label: "Test Notifications",
      route: "/(tenant)/test-notifications",
    },
  ],
  default: [
    { icon: "home-outline", label: "Dashboard", route: "/" },
    { icon: "person-outline", label: "Profile", route: "/profile" },
  ],
};
