import React from "react";
import Input, { InputProps } from "./Input";

export default function TextArea(props: InputProps) {
  return (
    <Input
      multiline
      numberOfLines={4}
      containerStyle={[{ height: 120, alignItems: "flex-start", paddingTop: 12 }, props.containerStyle]}
      textAlignVertical="top"
      {...props}
    />
  );
}
