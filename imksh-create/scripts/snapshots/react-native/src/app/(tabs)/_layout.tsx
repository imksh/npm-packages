import { Tabs, Redirect } from "expo-router";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";
import CustomTabBar from "../../components/ui/CustomTabBar";
import { useAuthStore } from "../../store/useAuthStore";

const TabLayout = () => {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { user, isCheckingAuth } = useAuthStore();

  if (!isCheckingAuth && !user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          showCenterButton={false}
          onCenterButtonPress={() => console.log("Create button pressed!")}
        />
      )}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.base100 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
};

export default TabLayout;
