import React, { useState, useEffect , useCallback } from "react";
import { View } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { Txt } from "../../components/common/Typography";
import { router, useFocusEffect } from "expo-router";
import ScrollContainer from "../../components/ui/layout/ScrollContainer";
import Input from "../../components/ui/inputs/Input";
import Button from "../../components/ui/buttons/Button";

export default function ForgotPasswordScreen() {
  const { genOtp, verifyOtp, resetPassword, loading, error, clearError } = useAuthStore();
  const [step, setStep] = useState<"email" | "otp" | "password">("email");

  useFocusEffect(
    useCallback(() => {
      return () => clearError();
    }, [clearError])
  );

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    if (!email) return;
    const success = await genOtp(email);
    if (success) {
      setStep("otp");
      setTimer(60);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    const success = await verifyOtp(email, otp);
    if (success) {
      setStep("password");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) return;
    const success = await resetPassword(newPassword);
    if (success) {
      router.replace("/(auth)/login");
    }
  };

  return (
    <ScrollContainer
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: 16,
      }}
      className="bg-base-100"
    >
      <View className="w-full p-6">
        <View className="items-center mb-8 w-full">
          <Txt variant="xl" className="text-2xl mb-1 text-center">
            {step === "email" && "Forgot Password"}
            {step === "otp" && "Verify Email"}
            {step === "password" && "Reset Password"}
          </Txt>
          <Txt
            variant="sm"
            className="text-xs text-base-content/50 text-center px-2"
          >
            {step === "email" && "Enter your email to receive an OTP"}
            {step === "otp" && `Enter the OTP sent to ${email}`}
            {step === "password" && "Enter your new password"}
          </Txt>
        </View>

        {error ? (
          <View className="bg-error/10 border border-error/20 rounded-2xl p-3 mb-4">
            <Txt variant="md" className="text-error text-xs text-center">
              ⚠️ {error}
            </Txt>
          </View>
        ) : null}

        <View className="gap-2">
          {step === "email" && (
            <>
              <Input
                leftIcon="mail"
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <View className="mt-2">
                <Button
                  label="Send OTP →"
                  onPress={handleSendOtp}
                  isLoading={loading}
                  variant="primary"
                  isFullWidth
                />
              </View>
            </>
          )}

          {step === "otp" && (
            <>
              <Input
                leftIcon="key"
                placeholder="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
              />
              <View className="mt-2">
                <Button
                  label="Verify OTP →"
                  onPress={handleVerifyOtp}
                  isLoading={loading}
                  variant="primary"
                  isFullWidth
                />
              </View>
              <View className="mt-4">
                <Button
                  label={timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                  onPress={handleSendOtp}
                  disabled={timer > 0 || loading}
                  variant="outline"
                  isFullWidth
                />
              </View>
            </>
          )}

          {step === "password" && (
            <>
              <Input
                leftIcon="lock-closed"
                rightIcon={showPassword ? "eye-off" : "eye"}
                onRightIconPress={() => setShowPassword(!showPassword)}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
              />
              <View className="mt-2">
                <Button
                  label="Reset Password →"
                  onPress={handleResetPassword}
                  isLoading={loading}
                  variant="primary"
                  isFullWidth
                />
              </View>
            </>
          )}
        </View>

        <View className="mt-8">
          <Txt
            variant="sm"
            className="text-sm text-base-content/50 text-center"
          >
            Remember your password?{" "}
            <Txt
              variant="md"
              className="text-primary text-sm"
              onPress={() => router.push("/(auth)/login")}
            >
              Sign in
            </Txt>
          </Txt>
        </View>
      </View>
    </ScrollContainer>
  );
}
