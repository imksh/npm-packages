import { View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Txt } from "../common/Typography";
import { Ionicons } from "@expo/vector-icons";
import ConfirmationToast from "../common/ConfirmationToast";
import { Portal } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";

export default function SettingsOptins({ check, icon, fun, name, message }) {
  const [show, setShow] = useState(false);
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  return (
    <>
      <TouchableOpacity
        className="flex-row justify-between items-center my-4"
        onPress={() => setShow(!show)}
      >
        <View className="flex-row justify-center items-center">
          <View className="p-4 bg-blue-600 rounded-2xl mr-5 justify-center items-center">
            <Ionicons name={icon} size={18} color="#fff" />
          </View>
          <Txt variant="mid">{name}</Txt>
        </View>
        <TouchableOpacity onPress={() => setShow(!show)}>
          <Ionicons
            name="chevron-forward-outline"
            size={25}
            color={colors.baseContent}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <Portal>
        {show && (
          <ConfirmationToast
            fun={fun}
            icon={icon}
            setShow={setShow}
            name={name}
            message={message}
          />
        )}
      </Portal>
    </>
  );
}
