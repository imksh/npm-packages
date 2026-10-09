import React, { useState } from "react";
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Txt } from "./Typography";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  showImage?: boolean;
  badges?: React.ReactNode;
  content?: React.ReactNode | ((color: string) => React.ReactNode);
  imageUrl?: string;
  onBack: () => void;
  rightActions?: React.ReactNode | ((color: string) => React.ReactNode);
  children: React.ReactNode;
  imageFallbackIcon?: keyof typeof Ionicons.glyphMap;
}

const HEADER_MAX_HEIGHT = 300;

export default function AnimatedHeader({
  title,
  subtitle,
  showImage = true,
  badges,
  content,
  imageUrl,
  onBack,
  rightActions,
  children,
  imageFallbackIcon = "business",
}: AnimatedHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [scrollY] = useState(() => new Animated.Value(0));
  const isDarkBg = !!imageUrl;

  const dynamicTextColor = isDarkBg ? "#FFFFFF" : colors.baseContent;

  const HEADER_MIN_HEIGHT = Platform.OS === "ios" ? 90 : 70 + insets.top;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: "clamp",
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0.8],
    extrapolate: "clamp",
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, -8],
    extrapolate: "clamp",
  });

  const titleTranslateX = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 40],
    extrapolate: "clamp",
  });

  const topBarBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE - 20, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  const smallImageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE - 20, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        {children}
      </Animated.ScrollView>

      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        <Animated.View
          style={[
            styles.backgroundImageContainer,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslateY }],
            },
          ]}
        >
          {imageUrl ? (
            <>
              <Image
                source={{ uri: imageUrl }}
                style={styles.backgroundImage}
                resizeMode="cover"
              />
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
            </>
          ) : (
            <View className="w-full h-full items-center justify-center bg-primary/20 pt-10">
              <Ionicons
                name={imageFallbackIcon}
                size={80}
                color={colors.primary}
                style={{ opacity: 0.5 }}
              />
            </View>
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.titleContainer,
            {
              transform: [
                { scale: titleScale },
                { translateY: titleTranslateY },
                { translateX: titleTranslateX },
              ],
            },
          ]}
        >
          {badges}
          <Txt
            variant="2xl"
            className=""
            style={{ color: dynamicTextColor }}
            numberOfLines={1}
          >
            {title}
          </Txt>
          {subtitle && (
            <Txt
              variant="sm"
              className=" mt-1"
              style={{ color: dynamicTextColor, opacity: 0.8 }}
              numberOfLines={1}
            >
              {subtitle}
            </Txt>
          )}
          {typeof content === "function" ? content(dynamicTextColor) : content}
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={[
          styles.topBar,
          {
            height: HEADER_MIN_HEIGHT,
            paddingTop: insets.top,
            backgroundColor: colors.base100,
            opacity: topBarBackgroundOpacity,
          },
        ]}
      >
        <Animated.View
          style={{
            position: "absolute",
            top: insets.top + 10,
            left: 0,
            right: 0,
            height: 40,
            opacity: smallImageOpacity,
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 60,
            marginRight: 100,
          }}
        >
          {showImage && (
            <>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.smallImage} />
              ) : (
                <View
                  style={[
                    styles.smallImage,
                    {
                      backgroundColor: colors.primary,
                      opacity: 0.2,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Ionicons
                    name={imageFallbackIcon}
                    size={18}
                    color={colors.primary}
                  />
                </View>
              )}
            </>
          )}

          <Txt
            variant="md"
            className="font-bold text-base-content"
            numberOfLines={1}
          >
            {title}
          </Txt>
        </Animated.View>
      </Animated.View>

      {/* Buttons */}
      <View style={[styles.buttonsContainer, { top: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={onBack}
          className={`w-10 h-10 rounded-full items-center justify-center ${isDarkBg ? 'bg-black/40' : ''}`}
        >
          <Ionicons name="arrow-back" size={22} color={dynamicTextColor} />
        </TouchableOpacity>
        <View className="flex-row gap-2">
          {typeof rightActions === "function" ? rightActions(dynamicTextColor) : rightActions}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MAX_HEIGHT,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  backgroundImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: HEADER_MAX_HEIGHT,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },

  titleContainer: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  topBarInner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
  },
  smallImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  buttonsContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 100,
  },
});
