import React, { useState } from "react";
import Input, { InputProps } from "./Input";

export default function PasswordInput(props: Omit<InputProps, "rightIcon" | "onRightIconPress" | "secureTextEntry">) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      {...props}
      secureTextEntry={!isVisible}
      rightIcon={isVisible ? "eye-off" : "eye"}
      onRightIconPress={() => setIsVisible(!isVisible)}
    />
  );
}
