import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Txt } from "../../common/Typography";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import BottomModal from "../BottomModal";
import Button from "../buttons/Button";
import dayjs from "dayjs";

interface DatePickerProps {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  minimumDate?: string; // YYYY-MM-DD
}

export default function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Select Date",
  minimumDate,
}: DatePickerProps) {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [isOpen, setIsOpen] = useState(false);

  // Parse initial selected date or default to today
  const selectedDate = value ? dayjs(value) : dayjs();
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentMonth((prev) => prev.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => prev.add(1, "month"));
  };

  // Generate days in current month grid
  const daysInMonth = currentMonth.daysInMonth();
  const startDayOfWeek = currentMonth.startOf("month").day(); // 0 (Sun) - 6 (Sat)

  const daysArray: { dayNum: number; dateString: string; isCurrentMonth: boolean }[] = [];

  // Padding days from previous month
  const prevMonth = currentMonth.subtract(1, "month");
  const prevMonthDays = prevMonth.daysInMonth();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    daysArray.push({
      dayNum,
      dateString: prevMonth.date(dayNum).format("YYYY-MM-DD"),
      isCurrentMonth: false,
    });
  }

  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push({
      dayNum: i,
      dateString: currentMonth.date(i).format("YYYY-MM-DD"),
      isCurrentMonth: true,
    });
  }

  // Padding days for next month to complete the row
  const remainingDays = 42 - daysArray.length; // 6 rows * 7 days = 42 total slots
  const nextMonth = currentMonth.add(1, "month");
  for (let i = 1; i <= remainingDays; i++) {
    daysArray.push({
      dayNum: i,
      dateString: nextMonth.date(i).format("YYYY-MM-DD"),
      isCurrentMonth: false,
    });
  }

  const handleDateSelect = (dateStr: string) => {
    if (minimumDate && dayjs(dateStr).isBefore(dayjs(minimumDate), "day")) {
      return; // Date is disabled
    }
    onChange(dateStr);
    setIsOpen(false);
  };

  const formattedDisplay = value ? dayjs(value).format("MMM DD, YYYY") : "";

  return (
    <View className="flex-1">
      <Txt className="text-xs text-base-content/60 uppercase mb-2 font-medium">
        {label}
      </Txt>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
        className="bg-base-100 rounded-2xl px-4 py-3 border border-base-300 flex-row justify-between items-center h-12"
      >
        <Txt className={formattedDisplay ? "text-base-content font-medium" : "text-base-content/40 font-medium"}>
          {formattedDisplay || placeholder}
        </Txt>
        <Ionicons name="calendar-outline" size={18} color={colors.primary} />
      </TouchableOpacity>

      <BottomModal isOpen={isOpen} onClose={() => setIsOpen(false)} heightPercent={0.65}>
        <View className="p-4 flex-1">
          <Txt variant="lg" className="font-bold text-center mb-4">
            {label}
          </Txt>

          {/* Month & Year Navigation Header */}
          <View className="flex-row justify-between items-center px-2 mb-4">
            <TouchableOpacity onPress={handlePrevMonth} className="p-2 bg-base-200 rounded-full">
              <Ionicons name="chevron-back" size={20} color={colors.primary} />
            </TouchableOpacity>
            <Txt className="font-bold text-base-content text-base">
              {currentMonth.format("MMMM YYYY")}
            </Txt>
            <TouchableOpacity onPress={handleNextMonth} className="p-2 bg-base-200 rounded-full">
              <Ionicons name="chevron-forward" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Day Names Header */}
          <View className="flex-row justify-between mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <View key={day} className="flex-1 items-center">
                <Txt variant="xs" className="text-base-content/40 font-bold">
                  {day}
                </Txt>
              </View>
            ))}
          </View>

          {/* Days Grid */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap">
              {daysArray.map((item, idx) => {
                const isSelected = value === item.dateString;
                const isToday = dayjs().format("YYYY-MM-DD") === item.dateString;
                const isDisabled = !!(minimumDate && dayjs(item.dateString).isBefore(dayjs(minimumDate), "day"));

                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleDateSelect(item.dateString)}
                    disabled={isDisabled}
                    style={{ width: "14.28%", aspectRatio: 1 }}
                    className={`items-center justify-center rounded-2xl my-1 relative ${
                      isSelected
                        ? "bg-primary"
                        : isToday
                        ? "bg-primary/10 border border-primary/30"
                        : ""
                    } ${isDisabled ? "opacity-25" : ""}`}
                  >
                    <Txt
                      className={`font-semibold ${
                        isSelected
                          ? "text-white"
                          : item.isCurrentMonth
                          ? "text-base-content"
                          : "text-base-content/30"
                      }`}
                    >
                      {item.dayNum}
                    </Txt>
                    {isToday && !isSelected && (
                      <View className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View className="pt-4 border-t border-base-200">
            <Button label="Close" variant="outline" onPress={() => setIsOpen(false)} className="w-full" />
          </View>
        </View>
      </BottomModal>
    </View>
  );
}
