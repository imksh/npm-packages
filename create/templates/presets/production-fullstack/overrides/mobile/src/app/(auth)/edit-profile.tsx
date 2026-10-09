import React, { useState , useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { Txt } from "../../components/common/Typography";
import { router, useFocusEffect } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../../components/ui/data-display/Avatar";

import ScrollContainer from "../../components/ui/layout/ScrollContainer";
import Input from "../../components/ui/inputs/Input";
import Button from "../../components/ui/buttons/Button";
import ScreenHeader from "@/components/common/ScreenHeader";
import { toast } from "@/utils/toast";
import { authService } from "@/features/auth/api/auth.service";

export default function EditProfileScreen() {
  const { user, error, setUser, clearError } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => clearError();
    }, [clearError])
  );

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    try {
      setLoading(true);
      if (name !== user?.name) formData.append("name", name);
      if (phone !== user?.phone) formData.append("phone", phone);

      if (avatarUri) {
        const filename = avatarUri.split("/").pop() || "avatar.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("file", {
          uri: avatarUri,
          name: filename,
          type,
        } as any);
      }

      // Only update if something changed
      if (
        (formData as any).getParts &&
        (formData as any).getParts().length === 0
      ) {
        router.back();
        return;
      }

      const res = await authService.updateMe(formData);
      if (res.data.success) {
        setUser(res.data.data);
        toast.success("Profile updated successfully");
        router.back();
      } else {
        toast.error(res.data.message || "An error occurred");
      }

      console.log(res.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScreenHeader title="Edit Profile" />
      <ScrollContainer
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
        }}
        className="bg-base-100"
      >
        <View className="items-center mb-8">
          <View className="relative">
            <View className="w-28 h-28 rounded-full items-center justify-center border-4 border-base-100 shadow-sm shadow-base-content/20 overflow-hidden">
              {avatarUri ? (
                <Avatar url={avatarUri} size={104} />
              ) : (
                <Avatar
                  url={
                    user?.avatar?.url ||
                    `https://placehold.co/600x400?text=${user?.name?.charAt(0).toUpperCase() || "U"}`
                  }
                  size={104}
                />
              )}
            </View>
            <TouchableOpacity
              onPress={pickImage}
              className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-base-100"
            >
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {error ? (
          <View className="bg-error/10 border border-error/20 rounded-2xl p-3 mb-4">
            <Txt variant="md" className="text-error text-xs text-center">
              ⚠️ {error}
            </Txt>
          </View>
        ) : null}

        <View className="gap-4">
          <Input
            leftIcon="person"
            placeholder="Full name"
            value={name}
            onChangeText={setName}
          />

          <Input
            leftIcon="call"
            placeholder="Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <View className="mt-4">
            <Button
              label="Save Changes"
              onPress={handleSave}
              isLoading={loading}
              variant="primary"
              isFullWidth
            />
          </View>
        </View>
      </ScrollContainer>
    </>
  );
}
