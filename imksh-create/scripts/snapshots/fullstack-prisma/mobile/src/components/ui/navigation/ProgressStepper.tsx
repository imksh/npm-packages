import React from "react";
import { View } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Txt } from "../../common/Typography";

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
                  <Txt color={isActive ? theme.primaryContent : theme.secondary} weight="bold">
                    {index + 1}
                  </Txt>
                )}
              </View>
              <Txt color={isActive ? theme.primary : theme.secondary} variant="xs" align="center">
                {step}
              </Txt>
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
