import React, { useState, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Txt } from "../../common/Typography";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import ScreenHeader from "@/components/common/ScreenHeader";
import SearchBar from "./SearchBar";

interface SearchablePickerProps<T> {
  label?: string;
  data: T[];
  value: string;
  onSelect: (item: T) => void;
  labelExtractor: (item: T) => string;
  valueExtractor: (item: T) => string;
  placeholder?: string;
  isLoading?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  weight?: "normal" | "medium" | "bold" | "semibold" | "black";
  renderTrigger?: (
    onPress: () => void,
    selectedItem: T | undefined,
  ) => React.ReactNode;
  onSearchChange?: (text: string) => void;
  onEndReached?: () => void;
  disableLocalFilter?: boolean;
  renderOption?: (item: T, isSelected: boolean) => React.ReactNode;
}
export default function SearchablePicker<T>({
  label,
  data,
  value,
  onSelect,
  labelExtractor,
  valueExtractor,
  placeholder = "Select an option",
  isLoading = false,
  size = "md",
  className = "mb-4",
  weight = "normal",
  renderTrigger,
  onSearchChange,
  onEndReached,
  disableLocalFilter = false,
  renderOption,
}: SearchablePickerProps<T>) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedItem = useMemo(
    () => data.find((item) => valueExtractor(item) === value),
    [data, value, valueExtractor],
  );

  const filteredData = useMemo(() => {
    if (disableLocalFilter) return data;
    if (!searchQuery) return data;
    return data.filter((item) =>
      labelExtractor(item).toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery, labelExtractor, disableLocalFilter]);

  return (
    <View className={className}>
      {label && (
        <Txt
          color={theme.baseContent}
          weight={weight}
          style={{ marginBottom: 6 }}
        >
          {label}
        </Txt>
      )}
      {renderTrigger ? (
        renderTrigger(() => setModalVisible(true), selectedItem)
      ) : (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-base-100 border border-base-300 rounded-xl px-4 flex-row items-center justify-between"
          style={{
            height:
              size === "xs" ? 30 : size === "sm" ? 40 : size === "lg" ? 64 : 52,
          }}
        >
          <Txt
            className={
              selectedItem ? "text-base-content" : "text-base-content/50"
            }
            style={{
              fontSize:
                size === "xs"
                  ? 12
                  : size === "sm"
                    ? 14
                    : size === "lg"
                      ? 18
                      : 16,
            }}
          >
            {selectedItem ? labelExtractor(selectedItem) : placeholder}
          </Txt>
          <Ionicons
            name="chevron-down"
            size={size === "xs" ? 14 : size === "sm" ? 16 : 20}
            color={theme.secondary}
          />
        </TouchableOpacity>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-base-100">
          <ScreenHeader
            title={label || "Select"}
            icon="close"
            onBack={() => setModalVisible(false)}
          />

          <View className="px-4 pt-4">
            <SearchBar
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                if (onSearchChange) onSearchChange(text);
              }}
              debounceMs={0}
            />
          </View>

          {isLoading ? (
            <ActivityIndicator
              style={{ marginTop: 20 }}
              color={theme.primary}
            />
          ) : (
            <FlatList
              data={filteredData}
              keyExtractor={(item, idx) =>
                valueExtractor(item) || idx.toString()
              }
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 40,
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item);
                    setModalVisible(false);
                    setSearchQuery("");
                  }}
                  className="py-4 border-b border-base-200 flex-row justify-between items-center"
                >
                  {renderOption ? (
                    renderOption(item, valueExtractor(item) === value)
                  ) : (
                    <>
                      <Txt>{labelExtractor(item)}</Txt>
                      {valueExtractor(item) === value && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={theme.primary}
                        />
                      )}
                    </>
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View className="items-center py-8">
                  <Txt className="text-base-content/50">
                    No data found
                  </Txt>
                </View>
              )}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.5}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}
