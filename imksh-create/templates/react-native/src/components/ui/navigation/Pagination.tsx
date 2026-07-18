import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => onPageChange(currentPage - 1)}
        style={{ padding: 8, opacity: currentPage === 1 ? 0.5 : 1 }}
      >
        <Ionicons name="chevron-back" size={20} color={theme.baseContent} />
      </TouchableOpacity>
      
      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <TouchableOpacity
            key={p}
            onPress={() => onPageChange(p)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: isActive ? theme.primary : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: isActive ? theme.primaryContent : theme.baseContent, fontWeight: isActive ? "700" : "500" }}>
              {p}
            </Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        disabled={currentPage === totalPages}
        onPress={() => onPageChange(currentPage + 1)}
        style={{ padding: 8, opacity: currentPage === totalPages ? 0.5 : 1 }}
      >
        <Ionicons name="chevron-forward" size={20} color={theme.baseContent} />
      </TouchableOpacity>
    </View>
  );
}
