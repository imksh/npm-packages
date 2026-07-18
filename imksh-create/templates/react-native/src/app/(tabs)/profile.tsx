import { View, ScrollView, TouchableOpacity } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { Txt } from "../../components/common/Typography";
import SettingsOptions from "../../components/settings/SettingsOptions";
import SettingToggle from "../../components/settings/SettingToggle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Avatar from "@/components/ui/data-display/Avatar";

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

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
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
      <ScrollView className="flex-1 bg-base-100">
        {/* Settings Section */}
        <View className="px-6 py-8 pb-20">
          <Txt
            variant="h3"
            className="mb-6 text-base-content/80 uppercase tracking-widest text-xs"
          >
            Account Settings
          </Txt>

          <SettingsOptions
            name="Edit Profile"
            icon="person-outline"
            message="Are you sure you want to edit your profile?"
            fun={handleEditProfile}
            check={false}
          />

          <SettingsOptions
            name="Change Password"
            icon="lock-closed-outline"
            message="Do you want to update your password?"
            fun={() => {}}
            check={false}
          />

          <Txt
            variant="h3"
            className="mt-6 mb-6 text-base-content/80 uppercase tracking-widest text-xs"
          >
            Preferences
          </Txt>

          <SettingToggle
            name="Dark Theme"
            icon="moon-outline"
            check={colorScheme === "dark"}
            fun={handleToggleTheme}
          />

          <SettingToggle
            name="Push Notifications"
            icon="notifications-outline"
            check={true}
            fun={() => {}}
          />

          <View className="mt-8 mb-12">
            <SettingsOptions
              name="Log Out"
              icon="log-out-outline"
              message="Are you sure you want to log out from this device?"
              fun={handleLogout}
              check={false}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
