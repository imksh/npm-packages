import { View, ScrollView, TouchableOpacity } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { Txt } from "../../components/common/Typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Avatar from "@/components/ui/data-display/Avatar";
import Button from "@/components/ui/buttons/Button";
import Switch from "@/components/ui/inputs/Switch";

const Profile = () => {
  const { user, logout } = useAuthStore();
  const { colorScheme, setColorScheme } = useColorScheme();

  const handleToggleTheme = () => {
    const newTheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(newTheme);
    AsyncStorage.setItem("theme", newTheme);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View className="flex-1 bg-base-100">
      <View className="pt-16 pb-8 px-6 bg-primary/10 rounded-b-[40px] items-center border-b border-primary/20">
        <View className="relative">
          <View className="w-28 h-28 rounded-full bg-primary items-center justify-center border-4 border-base-100 shadow-lg shadow-primary/40">
            <Avatar
              url="https://res.cloudinary.com/ddwijawuc/image/upload/v1784397422/Screenshot_2026-07-18_at_11.26.53_PM_mubmqa.png"
              size={100}
            />
          </View>
          <TouchableOpacity className="absolute bottom-0 right-0 bg-secondary p-2 rounded-full border-2 border-base-100">
            <Ionicons name="camera" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <View className="items-center mt-4">
          <Txt variant="h2" className="text-2xl mb-1">
            {user?.name || "User Name"}
          </Txt>
          <Txt variant="regular" className="text-base-content/60">
            {user?.email || "user@example.com"}
          </Txt>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <View className="bg-base-200 rounded-2xl p-4 mb-6">
          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center">
              <Ionicons 
                name={colorScheme === "dark" ? "moon" : "sunny"} 
                size={22} 
                color={colorScheme === "dark" ? "#fff" : "#000"} 
              />
              <Txt variant="base" className="ml-3 font-semibold">Dark Mode</Txt>
            </View>
            <Switch checked={colorScheme === "dark"} onChange={handleToggleTheme} />
          </View>
        </View>

        <Button
          label="Logout"
          variant="error"
          isFullWidth
          leftIcon="log-out-outline"
          onPress={handleLogout}
          style={{ marginTop: 20, marginBottom: 40 }}
        />
      </ScrollView>
    </View>
  );
};

export default Profile;
