import React, { useState } from "react";
import { View } from "react-native";
import { useAuthStore } from "../store/useAuthStore";
import { Txt } from "../components/common/Typography";
import { Redirect } from "expo-router";

import ScrollContainer from "../components/ui/layout/ScrollContainer";
import Input from "../components/ui/inputs/Input";
import Button from "../components/ui/buttons/Button";
import Tabs from "../components/ui/navigation/Tabs";
import Image from "@/components/ui/data-display/Image";
import logo from "../../assets/images/logo/logo.png";

export default function LoginScreen() {
  const {
    login,
    demoLogin,
    signup,
    sendOtp,
    loading,
    error,
    user,
    isCheckingAuth,
  } = useAuthStore();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    let ok;
    if (mode === "login") {
      ok = await login(form.email, form.password);
    } else {
      if (!otpSent) {
        ok = await sendOtp(form.email);
        if (ok) setOtpSent(true);
      } else {
        ok = await signup(form.name, form.email, form.password, form.otp);
      }
    }
  };

  if (!isCheckingAuth && user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <ScrollContainer
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: 16,
      }}
    >
      <View className="w-full p-6">
        {/* Header */}
        <View className="items-center mb-8 w-full">
          <View className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center mb-4">
            <Image src={logo} height={40} width={40} />
          </View>
          <Txt
            variant="h1"
            className="text-2xl mb-1 text-center"
            numberOfLines={1}
          >
            {mode === "login" ? "Welcome back" : "Create account"}
          </Txt>
          <Txt
            variant="regular"
            className="text-xs text-base-content/50 text-center px-2"
          >
            {mode === "login"
              ? "Sign in to continue your journey"
              : "Enter your information to create a new account"}
          </Txt>
        </View>

        {/* Tab Switcher */}
        <View className="mb-6">
          <Tabs
            variant="button"
            activeTab={mode}
            onChange={(id) => {
              setMode(id);
              setOtpSent(false);
            }}
            tabs={[
              { id: "login", label: "Sign in" },
              { id: "signup", label: "Sign Up" },
            ]}
          />
        </View>

        {/* Error */}
        {error ? (
          <View className="bg-error/10 border border-error/20 rounded-2xl p-3 mb-4">
            <Txt variant="mid" className="text-error text-xs text-center">
              ⚠️ {error}
            </Txt>
          </View>
        ) : null}

        {/* Form */}
        <View className="gap-2">
          {mode === "signup" && (
            <Input
              leftIcon="person"
              placeholder="Full name"
              value={form.name}
              onChangeText={(val) => handleChange("name", val)}
            />
          )}

          <Input
            leftIcon="mail"
            placeholder="Email address"
            value={form.email}
            onChangeText={(val) => handleChange("email", val)}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            leftIcon="lock-closed"
            rightIcon={showPassword ? "eye-off" : "eye"}
            onRightIconPress={() => setShowPassword(!showPassword)}
            placeholder="Password"
            value={form.password}
            onChangeText={(val) => handleChange("password", val)}
            secureTextEntry={!showPassword}
          />

          {mode === "signup" && otpSent && (
            <Input
              leftIcon="key"
              placeholder="Enter OTP"
              value={form.otp}
              onChangeText={(val) => handleChange("otp", val)}
              keyboardType="numeric"
            />
          )}

          <View className="mt-2">
            <Button
              label={
                mode === "login"
                  ? "Sign In →"
                  : otpSent
                    ? "Verify & Create Account →"
                    : "Send OTP →"
              }
              onPress={handleSubmit}
              isLoading={loading}
              variant="primary"
              isFullWidth
            />
          </View>

          {mode === "login" && (
            <View className="mt-2">
              <Button
                label="Use Demo Account"
                onPress={demoLogin}
                disabled={loading}
                variant="outline"
                isFullWidth
              />
            </View>
          )}
        </View>

        {/* Footer */}
        <View className="mt-8">
          <Txt
            variant="regular"
            className="text-sm text-base-content/50 text-center"
          >
            {mode === "login" ? "New here? " : "Already have an account? "}
            <Txt
              variant="mid"
              className="text-primary text-sm"
              onPress={() => {
                setMode(mode === "login" ? "signup" : "login");
                setOtpSent(false);
              }}
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </Txt>
          </Txt>
        </View>
      </View>
    </ScrollContainer>
  );
}
