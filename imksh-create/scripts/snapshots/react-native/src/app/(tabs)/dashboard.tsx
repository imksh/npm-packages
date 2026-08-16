import { View } from "react-native";
import React from "react";
import TabHeader from "@/components/common/TabHeader";

const dashboard = () => {
  return (
    <View>
      <TabHeader title="Dashboard" showMenuButton={false} />
    </View>
  );
};

export default dashboard;
