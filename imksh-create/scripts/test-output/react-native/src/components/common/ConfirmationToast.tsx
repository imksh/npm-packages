import { View, TouchableOpacity } from "react-native";
import React from "react";
import { Txt } from "./Typography";

import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";

export default function ConfirmationToast({
  name,
  message,
  fun,
  icon,
  setShow,
}) {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const ok = () => {
    fun();
    setShow(false);
  };

  return (
    <View className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[90%]">
      <View
        className="my-4 pt-8 bg-base-100"
        style={{
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View className="justify-center items-center px-8">
          <Txt variant="h1">{name}</Txt>
          <Txt variant="body" className="mt-4" style={{ textAlign: "center" }}>
            {message}
          </Txt>
        </View>
        <View
          className="flex-row mt-8"
          style={{ borderTopWidth: 1, borderTopColor: colors.base300 }}
        >
          <TouchableOpacity
            className="w-[50%] justify-center items-center h-20"
            style={{ borderRightWidth: 1, borderRightColor: colors.base300 }}
            onPress={() => setShow(false)}
          >
            <Txt variant="mid">Cancle</Txt>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[50%] justify-center items-center"
            style={{ borderLeftWidth: 1, borderLeftColor: colors.base300 }}
            onPress={ok}
          >
            <Txt variant="mid">Ok</Txt>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
