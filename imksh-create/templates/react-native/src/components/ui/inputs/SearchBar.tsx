import React from "react";
import Input, { InputProps } from "./Input";

export default function SearchBar(props: Omit<InputProps, "leftIcon">) {
  return (
    <Input
      leftIcon="search"
      placeholder="Search..."
      {...props}
      containerStyle={[
        { borderRadius: 9999, height: 48, backgroundColor: "rgba(0,0,0,0.05)", borderWidth: 0 },
        props.containerStyle,
      ]}
    />
  );
}
