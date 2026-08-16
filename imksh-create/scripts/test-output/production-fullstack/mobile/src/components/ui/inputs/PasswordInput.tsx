import React, { useState } from "react";
import Input, { InputProps } from "./Input";

export default function PasswordInput({ labelOnBorder, ...props }: Omit<InputProps, "rightIcon" | "onRightIconPress" | "secureTextEntry">) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      labelOnBorder={labelOnBorder}
      {...props}
      secureTextEntry={!isVisible}
      rightIcon={isVisible ? "eye-off" : "eye"}
      onRightIconPress={() => setIsVisible(!isVisible)}
    />
  );
}
