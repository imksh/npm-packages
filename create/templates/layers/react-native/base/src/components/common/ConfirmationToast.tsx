import { View, TouchableOpacity } from "react-native";

import { Txt } from "./Typography";

import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";
import { useTranslation } from "react-i18next";

import { Portal } from "react-native-paper";

export interface ConfirmationToastProps {
  name?: string;
  message: string;
  fun: () => void;
  setShow: (show: boolean) => void;
  cancleText?: string;
  confirmText?: string;
}

export default function ConfirmationToast({
  name,
  message,
  fun,
  setShow,
  cancleText,
  confirmText,
}: ConfirmationToastProps) {
  const { t } = useTranslation();
  const cText = cancleText ?? t("common.cancel");
  const confText = confirmText ?? t("common.confirm");
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const ok = () => {
    fun();
    setShow(false);
  };

  return (
    <Portal>
      <View className="absolute inset-0 justify-center items-center bg-black/40 z-50">
        <View
          className="w-[90%] pt-8 bg-base-100"
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
            <Txt variant="xl">{name}</Txt>
            <Txt variant="sm" className="mt-4" style={{ textAlign: "center" }}>
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
              <Txt variant="sm">{cText}</Txt>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-[50%] justify-center items-center"
              style={{ borderLeftWidth: 1, borderLeftColor: colors.base300 }}
              onPress={ok}
            >
              <Txt variant="sm">{confText}</Txt>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Portal>
  );
}
