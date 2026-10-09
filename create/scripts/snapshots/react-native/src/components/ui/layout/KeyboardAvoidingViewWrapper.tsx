import React from "react";
import { KeyboardAvoidingView, Platform, KeyboardAvoidingViewProps, TouchableWithoutFeedback, Keyboard } from "react-native";

export default function KeyboardAvoidingViewWrapper({ children, ...props }: KeyboardAvoidingViewProps) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      {...props}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
