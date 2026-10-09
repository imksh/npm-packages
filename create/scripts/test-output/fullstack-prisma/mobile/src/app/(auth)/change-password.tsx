import React, { useState , useCallback } from "react";
import { View } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { Txt } from "../../components/common/Typography";
import { router, useFocusEffect } from "expo-router";
import ScrollContainer from "../../components/ui/layout/ScrollContainer";
import Input from "../../components/ui/inputs/Input";
import Button from "../../components/ui/buttons/Button";
import ScreenHeader from "@/components/common/ScreenHeader";

export default function ChangePasswordScreen() {
  const { changePassword, loading, error, clearError } = useAuthStore();

  useFocusEffect(
    useCallback(() => {
      return () => clearError();
    }, [clearError])
  );

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [validationError, setValidationError] = useState("");

  const handleSave = async () => {
    setValidationError("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setValidationError("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("New passwords do not match");
      return;
    }

    const success = await changePassword(oldPassword, newPassword);
    if (success) {
      router.back();
    }
  };

  return (
    <>
      <ScreenHeader title="Change Password" />
      <ScrollContainer
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
        }}
        className="bg-base-100"
      >
        {error || validationError ? (
          <View className="bg-error/10 border border-error/20 rounded-2xl p-3 mb-4">
            <Txt variant="md" className="text-error text-xs text-center">
              ⚠️ {validationError || error}
            </Txt>
          </View>
        ) : null}

        <View className="gap-4">
          <Input
            leftIcon="lock-closed"
            rightIcon={showOldPassword ? "eye-off" : "eye"}
            onRightIconPress={() => setShowOldPassword(!showOldPassword)}
            placeholder="Current Password"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry={!showOldPassword}
          />

          <Input
            leftIcon="key"
            rightIcon={showNewPassword ? "eye-off" : "eye"}
            onRightIconPress={() => setShowNewPassword(!showNewPassword)}
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
          />

          <Input
            leftIcon="checkmark-circle"
            rightIcon={showConfirmPassword ? "eye-off" : "eye"}
            onRightIconPress={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />

          <View className="mt-4">
            <Button
              label="Update Password"
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
