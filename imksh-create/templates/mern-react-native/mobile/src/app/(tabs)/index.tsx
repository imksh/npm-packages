import { View, ScrollView } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Txt } from "@/components/common/Typography";
import { toast } from "@/utils/toast";

// Import our prebuilt UI components
import ScrollContainer from "@/components/ui/layout/ScrollContainer";
import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import { HStack, VStack } from "@/components/ui/layout/Stack";

import Button from "@/components/ui/buttons/Button";
import IconButton from "@/components/ui/buttons/IconButton";
import FloatingActionButton from "@/components/ui/buttons/FloatingActionButton";

import Card from "@/components/ui/data-display/Card";
import Avatar from "@/components/ui/data-display/Avatar";
import Badge from "@/components/ui/data-display/Badge";
import Accordion from "@/components/ui/data-display/Accordion";
import {
  SwipeableRow,
  SwipeAction,
} from "@/components/ui/data-display/SwipeableRow";

import Input from "@/components/ui/inputs/Input";
import Switch from "@/components/ui/inputs/Switch";
import Checkbox from "@/components/ui/inputs/Checkbox";
import Radio from "@/components/ui/inputs/Radio";
import Slider from "@/components/ui/inputs/Slider";
import SearchBar from "@/components/ui/inputs/SearchBar";

import Spinner from "@/components/ui/feedback/Spinner";
import ProgressBar from "@/components/ui/feedback/ProgressBar";
import CircularProgress from "@/components/ui/feedback/CircularProgress";
import Skeleton from "@/components/ui/feedback/Skeleton";
import { GestureWrapper } from "@/components/ui/feedback/GestureWrapper";

import BottomModal from "@/components/ui/BottomModal";
import Tabs from "@/components/ui/navigation/Tabs";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";

const Index = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [radioVal, setRadioVal] = useState("option1");
  const [sliderVal, setSliderVal] = useState(50);
  const [searchQ, setSearchQ] = useState("");
  const [activeTab, setActiveTab] = useState("tab1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const swipeActions: SwipeAction[] = [
    {
      icon: <MaterialIcons name="archive" size={24} color="white" />,
      backgroundColor: colors.info,
      onPress: () => toast.success("Archived!", "Message saved securely"),
    },
    {
      icon: <MaterialIcons name="delete" size={24} color="white" />,
      backgroundColor: colors.error,
      onPress: () => toast.error("Deleted", "Message removed"),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.base100 }}>
      {/* Premium Glass Header */}
      <View className="absolute top-0 w-full z-50 bg-base-200">
        <View
          style={{ paddingTop: insets.top > 0 ? insets.top + 10 : 20 }}
          className="pb-4 px-6 border-b border-base-300/30"
        >
          <HStack justify="space-between" align="center">
            <VStack>
              <Txt variant="h2" className="font-extrabold tracking-tight">
                imksh-create
              </Txt>
              <Txt
                variant="caption"
                className="text-primary font-medium tracking-widest uppercase mt-1"
              >
                React Native Expo
              </Txt>
            </VStack>
            <Avatar
              url="https://res.cloudinary.com/ddwijawuc/image/upload/v1784397422/Screenshot_2026-07-18_at_11.26.53_PM_mubmqa.png"
              size={44}
            />
          </HStack>
        </View>
      </View>

      <ScrollContainer
        contentContainerStyle={{
          paddingTop: insets.top + 90,
          paddingBottom: 100,
        }}
      >
        {/* Top Hero Banner */}
        <Container className="mb-8">
          <Card
            elevation={0}
            className="bg-primary/10 overflow-hidden border border-primary/20 p-6 rounded-3xl"
          >
            <VStack spacing={12}>
              <HStack spacing={12} align="center">
                <Badge label="NEW V2" variant="primary" />
                <Badge label="SOFT" variant="primary" soft={true} />
              </HStack>
              <Txt
                variant="h1"
                className="text-primary font-black leading-tight"
              >
                Stop configuring. Start building.
              </Txt>
              <Txt variant="body" className="text-primary/70 font-medium">
                Skip the setup. Build your product. A complete boilerplate with auth, state management, navigation, and beautiful prebuilt components.
              </Txt>
            </VStack>
          </Card>
        </Container>

        {/* Buttons Showcase (Horizontal Scroll) */}
        <View className="mb-10">
          <Section title="Interactive Elements" titleClass="pl-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingVertical: 8,
                gap: 12,
              }}
            >
              <Button
                label="Primary"
                variant="primary"
                className="min-w-[120px]"
                onPress={() => toast.success("Action triggered")}
              />
              <Button
                label="Secondary"
                variant="secondary"
                className="min-w-[120px]"
              />
              <Button
                label="Accent"
                variant="accent"
                className="min-w-[120px]"
              />
              <Button
                label="Soft"
                variant="primary"
                soft={true}
                className="min-w-[120px]"
              />
              <Button
                label="Outline"
                variant="outline"
                className="min-w-[120px]"
              />
              <Button label="Ghost" variant="ghost" className="min-w-[120px]" />
              <IconButton
                icon="heart"
                variant="error"
                onPress={() => toast.success("Favorited")}
              />
            </ScrollView>
          </Section>
        </View>

        <Container>
          <VStack spacing={40}>
            {/* New Gesture Showcase */}
            <Section title="Gestures & Swipes">
              <VStack spacing={16}>
                {/* Swipeable Row */}
                <Card
                  elevation={2}
                  className="p-0 overflow-hidden rounded-2xl bg-base-100"
                >
                  <SwipeableRow rightActions={swipeActions}>
                    <HStack
                      align="center"
                      spacing={16}
                      className="p-4 bg-base-100"
                    >
                      <Avatar
                        url="https://res.cloudinary.com/ddwijawuc/image/upload/v1784397369/IMG_20250119_021400_abke1x.jpg"
                        size={50}
                      />
                      <VStack style={{ flex: 1 }}>
                        <Txt variant="mid" className="font-bold">
                          Swipe me left!
                        </Txt>
                        <Txt
                          variant="caption"
                          className="text-base-content/60 mt-1"
                        >
                          Reveal hidden actions natively
                        </Txt>
                      </VStack>
                      <MaterialIcons
                        name="chevron-left"
                        size={24}
                        color={colors.baseContent}
                        style={{ opacity: 0.3 }}
                      />
                    </HStack>
                  </SwipeableRow>
                </Card>

                {/* Gesture Wrapper Interactive Card */}
                <GestureWrapper
                  onDoubleTap={() =>
                    toast.success("Loved!", "You double tapped the card")
                  }
                  onSwipeUp={() => setIsModalOpen(true)}
                >
                  <Card
                    elevation={0}
                    className="bg-accent/10 border border-accent/20 rounded-2xl items-center p-8"
                  >
                    <MaterialIcons
                      name="touch-app"
                      size={40}
                      color={colors.accent}
                      style={{ marginBottom: 12 }}
                    />
                    <Txt variant="h3" className="text-accent text-center">
                      Double Tap or Swipe Up
                    </Txt>
                    <Txt
                      variant="caption"
                      className="text-accent/70 mt-2 text-center"
                    >
                      Powered by Reanimated & Gesture Handler
                    </Txt>
                  </Card>
                </GestureWrapper>
              </VStack>
            </Section>

            {/* Inputs & Controls (Sleek List) */}
            <Section title="Settings & Controls">
              <Card elevation={1} className="rounded-3xl p-6">
                <VStack spacing={24}>
                  <SearchBar
                    value={searchQ}
                    onChangeText={setSearchQ}
                    placeholder="Search components..."
                  />

                  <View className="h-px w-full bg-base-300/50" />

                  <HStack justify="space-between" align="center">
                    <VStack>
                      <Txt variant="mid" className="font-bold">
                        Biometric Login
                      </Txt>
                      <Txt
                        variant="caption"
                        className="text-base-content/50 mt-1"
                      >
                        FaceID or TouchID
                      </Txt>
                    </VStack>
                    <Switch checked={isEnabled} onChange={setIsEnabled} />
                  </HStack>

                  <View className="h-px w-full bg-base-300/50" />

                  <VStack spacing={12}>
                    <HStack justify="space-between" align="center">
                      <Txt variant="mid" className="font-bold">
                        Intensity
                      </Txt>
                      <Badge label={`${sliderVal}%`} variant="secondary" />
                    </HStack>
                    <Slider
                      value={sliderVal}
                      onValueChange={setSliderVal}
                      minimumValue={0}
                      maximumValue={100}
                    />
                  </VStack>

                  <View className="h-px w-full bg-base-300/50 mt-2" />

                  {/* Text Input */}
                  <Input
                    label="Account Email"
                    placeholder="hello@example.com"
                    leftIcon="mail-outline"
                  />

                  <View className="h-px w-full bg-base-300/50" />

                  {/* Selection Controls */}
                  <VStack spacing={16}>
                    <Checkbox
                      checked={isChecked}
                      onChange={setIsChecked}
                      label="Remember my preferences"
                    />
                    <HStack spacing={24}>
                      <Radio
                        checked={radioVal === "option1"}
                        onChange={() => setRadioVal("option1")}
                        label="Personal Plan"
                      />
                      <Radio
                        checked={radioVal === "option2"}
                        onChange={() => setRadioVal("option2")}
                        label="Pro Plan"
                      />
                    </HStack>
                  </VStack>
                </VStack>
              </Card>
            </Section>

            {/* Navigation & Layout */}
            <Section title="Navigation">
              <Card elevation={1} className="rounded-3xl p-6 pt-4">
                <Tabs
                  variant="underline"
                  activeTab={activeTab}
                  onChange={setActiveTab}
                  tabs={[
                    { id: "tab1", label: "Overview" },
                    { id: "tab2", label: "Analytics" },
                    { id: "tab3", label: "Settings" },
                  ]}
                />
                <View className="py-6 items-center justify-center">
                  <Txt variant="body" className="text-base-content/60 italic">
                    Currently viewing {activeTab} content.
                  </Txt>
                </View>
              </Card>
            </Section>

            {/* Feedback & Loading */}
            <Section title="Loading States">
              <HStack spacing={16} justify="space-between">
                <Card
                  elevation={1}
                  style={{ flex: 1 }}
                  className="rounded-3xl items-center py-8"
                >
                  <CircularProgress progress={65} size={70} strokeWidth={6} />
                  <Txt
                    variant="caption"
                    className="mt-4 font-bold text-base-content/70"
                  >
                    SYNCING
                  </Txt>
                </Card>

                <Card
                  elevation={1}
                  style={{ flex: 1 }}
                  className="rounded-3xl p-6 justify-center"
                >
                  <VStack spacing={12}>
                    <Skeleton width="100%" height={12} borderRadius={6} />
                    <Skeleton width="70%" height={12} borderRadius={6} />
                    <Skeleton width="85%" height={12} borderRadius={6} />
                  </VStack>
                </Card>
              </HStack>

              <Card elevation={1} className="rounded-3xl p-6 mt-4">
                <HStack justify="space-between" align="center" className="mb-4">
                  <Txt variant="mid" className="font-bold">
                    Background Sync
                  </Txt>
                  <Spinner size={24} />
                </HStack>
                <ProgressBar progress={0.75} height={8} />
                <Txt
                  variant="caption"
                  className="text-base-content/60 mt-2 text-right"
                >
                  75% Complete
                </Txt>
              </Card>
            </Section>

            {/* Information (Accordion) */}
            <Section title="Information & FAQs" className="pb-20">
              <VStack spacing={12}>
                <Accordion title="How to use this library?">
                  <Txt variant="body">
                    Simply import the components from the `@/components/ui`
                    directory. They are fully typed, gesture-driven, and styled
                    with NativeWind.
                  </Txt>
                </Accordion>
                <Accordion title="Does it support dark mode?">
                  <Txt variant="body">
                    Yes! All components automatically respond to the device&apos;s
                    color scheme, utilizing the custom CSS variables defined in
                    global.css.
                  </Txt>
                </Accordion>
              </VStack>
            </Section>
          </VStack>
        </Container>
      </ScrollContainer>

      {/* Floating Action Button */}
      <View className="absolute bottom-24 right-2">
        <FloatingActionButton icon="add" onPress={() => setIsModalOpen(true)} />
      </View>

      {/* Interactive Bottom Modal */}
      <BottomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        heightPercent={0.45}
      >
        <VStack spacing={20} className="px-4 py-2">
          <View className="h-16 w-16 bg-primary/10 rounded-full items-center justify-center self-center mb-2">
            <MaterialIcons
              name="auto-awesome"
              size={32}
              color={colors.primary}
            />
          </View>
          <Txt variant="h2" className="text-center font-black">
            Premium Modal
          </Txt>
          <Txt
            variant="body"
            className="text-center text-base-content/70 leading-relaxed px-4"
          >
            This highly responsive bottom sheet is gesture-driven. You can
            seamlessly drag it down to dismiss it.
          </Txt>
          <Button
            label="Acknowledge"
            variant="primary"
            isFullWidth
            className="mt-4"
            onPress={() => setIsModalOpen(false)}
          />
        </VStack>
      </BottomModal>
    </View>
  );
};

export default Index;
