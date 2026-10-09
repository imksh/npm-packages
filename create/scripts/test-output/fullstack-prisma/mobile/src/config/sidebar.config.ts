export interface SidebarMenuItem {
  icon: string;
  label: string;
  route: string;
}

export const sidebarConfig: Record<string, SidebarMenuItem[]> = {
  default: [
    { icon: "home-outline", label: "Dashboard", route: "/" },
    { icon: "person-outline", label: "Profile", route: "/profile" },
  ],
};
