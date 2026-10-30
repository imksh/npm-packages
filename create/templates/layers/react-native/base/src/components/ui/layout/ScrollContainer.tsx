import React from "react";
import { ScrollViewProps } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type KeyboardAwareProps = ScrollViewProps & {
  enableOnAndroid?: boolean;
  extraScrollHeight?: number;
};

const KeyboardAware =
  KeyboardAwareScrollView as unknown as React.ComponentType<KeyboardAwareProps>;

export default function ScrollContainer({
  contentContainerStyle,
  children,
  ...props
}: ScrollViewProps) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAware
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={20}
      removeClippedSubviews={true}
      contentContainerStyle={[
        { paddingBottom: insets.bottom + 20 },
        contentContainerStyle,
      ]}
      {...props}
    >
      {children}
    </KeyboardAware>
  );
}
