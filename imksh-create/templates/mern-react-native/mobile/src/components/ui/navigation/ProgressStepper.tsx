import React from "react";
import { View, Text } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", paddingHorizontal: 16 }}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        
        return (
          <React.Fragment key={index}>
            <View style={{ alignItems: "center", width: 40 }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: isCompleted ? theme.success : isActive ? theme.primary : theme.base300,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                ) : (
                  <Text style={{ color: isActive ? theme.primaryContent : theme.secondary, fontWeight: "700" }}>
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text style={{ color: isActive ? theme.primary : theme.secondary, fontSize: 10, textAlign: "center" }}>
                {step}
              </Text>
            </View>
            
            {index < steps.length - 1 && (
              <View
                style={{
                  flex: 1,
                  height: 2,
                  backgroundColor: index < currentStep ? theme.success : theme.base300,
                  marginHorizontal: 4,
                  marginTop: -20,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}
