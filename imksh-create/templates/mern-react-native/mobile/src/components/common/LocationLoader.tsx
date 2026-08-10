import React, { useEffect, ReactElement, useState } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Txt } from "./Typography";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  withDelay,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const MW = width * 3;
const MH = height * 2.8;

// ─────────────────────────────────────────
// THEME-AWARE MAP PALETTE
// Light: warm beige city, white roads
// Dark: deep navy city, slate roads
// ─────────────────────────────────────────
const LIGHT_MAP = {
  base:   "#EDE8DF",
  block:  ["#C9B99A", "#BFB08F", "#D4C4A8", "#CCC0A0", "#B8A880"],
  road:   "#FFFFFF",
  roadMn: "#F0EBE0",
  lane:   "#E8C84A",
  water:  "#A8C8E8",
  park:   "#8BC34A",
};
const DARK_MAP = {
  base:   "#0F172A",
  block:  ["#1E293B", "#172032", "#243044", "#1A2638", "#202E40"],
  road:   "#2A3445",
  roadMn: "#1B2433",
  lane:   "#60A5FA",
  water:  "#1e3a5f",
  park:   "#14532d",
};

// ─── Map Primitives ───
const Water = ({ top, left, w, h, rx = 8, dark }: any) => (
  <View style={{
    position: "absolute", top, left, width: w, height: h,
    backgroundColor: dark ? DARK_MAP.water : LIGHT_MAP.water,
    borderRadius: rx, opacity: 0.9,
  }} />
);
const Park = ({ top, left, w, h, rx = 6, dark }: any) => (
  <View style={{
    position: "absolute", top, left, width: w, height: h,
    backgroundColor: dark ? DARK_MAP.park : LIGHT_MAP.park,
    borderRadius: rx, opacity: dark ? 0.6 : 0.55,
  }} />
);
const Block = ({ top, left, w, h, shade = 0, dark }: any) => {
  const palette = dark ? DARK_MAP.block : LIGHT_MAP.block;
  return (
    <View style={{
      position: "absolute", top, left, width: w, height: h,
      backgroundColor: palette[shade % palette.length],
      borderRadius: 3, opacity: 0.9,
    }} />
  );
};
const Road = ({ top, left, w, h, major = false, dark }: any) => (
  <View style={{
    position: "absolute", top, left, width: w, height: h,
    backgroundColor: major ? (dark ? DARK_MAP.road : LIGHT_MAP.road)
                           : (dark ? DARK_MAP.roadMn : LIGHT_MAP.roadMn),
    opacity: major ? 0.95 : 0.75,
  }} />
);
const LaneDash = ({ top, left, vertical = false, dark }: any) => (
  <View style={{
    position: "absolute", top, left,
    width: vertical ? 2 : 12, height: vertical ? 12 : 2,
    backgroundColor: dark ? DARK_MAP.lane : LIGHT_MAP.lane,
    opacity: dark ? 0.3 : 0.45,
  }} />
);

// ─── The full map world ───
const MapWorld = ({ dark }: { dark: boolean }) => {
  const roads: ReactElement[] = [];
  const blocks: ReactElement[] = [];
  const dashes: ReactElement[] = [];

  const hMajorY = [MH * 0.18, MH * 0.36, MH * 0.54, MH * 0.72, MH * 0.88];
  hMajorY.forEach((y, i) => {
    roads.push(<Road key={`hm${i}`} top={y} left={0} w={MW} h={14} major dark={dark} />);
    for (let x = 0; x < MW; x += 32) {
      dashes.push(<LaneDash key={`hd${i}-${x}`} top={y + 6} left={x} dark={dark} />);
    }
  });

  const hMinorY = [MH * 0.09, MH * 0.27, MH * 0.45, MH * 0.63, MH * 0.80];
  hMinorY.forEach((y, i) => {
    roads.push(<Road key={`hmin${i}`} top={y} left={0} w={MW} h={7} dark={dark} />);
  });

  const vMajorX = [MW * 0.15, MW * 0.33, MW * 0.50, MW * 0.68, MW * 0.85];
  vMajorX.forEach((x, i) => {
    roads.push(<Road key={`vm${i}`} top={0} left={x} w={14} h={MH} major dark={dark} />);
    for (let y = 0; y < MH; y += 32) {
      dashes.push(<LaneDash key={`vd${i}-${y}`} top={y} left={x + 6} vertical dark={dark} />);
    }
  });

  const vMinorX = [MW * 0.07, MW * 0.24, MW * 0.41, MW * 0.59, MW * 0.76, MW * 0.93];
  vMinorX.forEach((x, i) => {
    roads.push(<Road key={`vmin${i}`} top={0} left={x} w={7} h={MH} dark={dark} />);
  });

  const hAll = [0, ...hMinorY, ...hMajorY, MH].sort((a, b) => a - b);
  const vAll = [0, ...vMinorX, ...vMajorX, MW].sort((a, b) => a - b);
  let shade = 0;
  for (let r = 0; r < hAll.length - 1; r++) {
    for (let c = 0; c < vAll.length - 1; c++) {
      const top = hAll[r] + 8;
      const left = vAll[c] + 8;
      const bh = hAll[r + 1] - hAll[r] - 16;
      const bw = vAll[c + 1] - vAll[c] - 16;
      if (bh > 10 && bw > 10) {
        blocks.push(<Block key={`b${r}-${c}`} top={top} left={left} w={bw} h={bh} shade={shade++} dark={dark} />);
      }
    }
  }

  return (
    <View style={{ width: MW, height: MH, position: "relative", backgroundColor: dark ? DARK_MAP.base : LIGHT_MAP.base }}>
      <Water top={MH * 0.05} left={MW * 0.55} w={MW * 0.38} h={MH * 0.12} rx={40} dark={dark} />
      <Water top={MH * 0.60} left={-20}        w={MW * 0.18} h={MH * 0.08} rx={30} dark={dark} />
      <Water top={MH * 0.82} left={MW * 0.70}  w={MW * 0.28} h={MH * 0.10} rx={24} dark={dark} />
      <Park  top={MH * 0.20} left={MW * 0.02}  w={MW * 0.10} h={MH * 0.10} dark={dark} />
      <Park  top={MH * 0.38} left={MW * 0.72}  w={MW * 0.12} h={MH * 0.12} dark={dark} />
      <Park  top={MH * 0.65} left={MW * 0.35}  w={MW * 0.08} h={MH * 0.07} dark={dark} />
      <Park  top={MH * 0.80} left={MW * 0.16}  w={MW * 0.09} h={MH * 0.06} dark={dark} />
      {blocks}
      {roads}
      {dashes}
    </View>
  );
};

// ─── MOVING TRAFFIC DOT ───
const TrafficDot = ({ startX, startY, endX, endY, delay, color }: any) => {
  const x = useSharedValue(startX);
  const y = useSharedValue(startY);

  useEffect(() => {
    x.value = withDelay(delay, withRepeat(
      withTiming(endX, { duration: 3000, easing: Easing.linear }), -1, false
    ));
    y.value = withDelay(delay, withRepeat(
      withTiming(endY, { duration: 3000, easing: Easing.linear }), -1, false
    ));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <Animated.View style={[style, {
      position: "absolute", top: 0, left: 0,
      width: 6, height: 6, borderRadius: 3,
      backgroundColor: color, opacity: 0.75,
    }]} />
  );
};

// ─── PROPERTY PRICE PIN ───
const PropertyPin = ({ top, left, delay, price, color }: any) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const bounce = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 8, stiffness: 240 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    bounce.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(-4, { duration: 600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0,  { duration: 600, easing: Easing.inOut(Easing.quad) })
      ), -1, true
    ));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: bounce.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[style, { position: "absolute", top, left, alignItems: "center" }]}>
      <View style={{
        backgroundColor: color,
        paddingHorizontal: 9, paddingVertical: 5,
        borderRadius: 14, flexDirection: "row", alignItems: "center", gap: 4,
        shadowColor: color, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45, shadowRadius: 8, elevation: 6,
      }}>
        <Ionicons name="home" size={11} color="#fff" />
        <Txt style={{ color: "#fff", fontFamily: "InterBold", fontSize: 11 }}>{price}</Txt>
      </View>
      <View style={{
        width: 0, height: 0,
        borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 8,
        borderLeftColor: "transparent", borderRightColor: "transparent",
        borderTopColor: color, alignSelf: "center", marginTop: -1,
      }} />
    </Animated.View>
  );
};

// ─── RADAR PULSE ───
const Pulse = ({ delay, r, primary }: { delay: number; r: number; primary: string }) => {
  const scale = useSharedValue(0.1);
  const opacity = useSharedValue(0.9);

  useEffect(() => {
    scale.value = withDelay(delay, withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.out(Easing.quad) }), -1, false
    ));
    opacity.value = withDelay(delay, withRepeat(
      withTiming(0, { duration: 2000, easing: Easing.out(Easing.quad) }), -1, false
    ));
  }, []);

  const s = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }], opacity: opacity.value,
  }));

  return (
    <Animated.View style={[s, {
      position: "absolute",
      width: r * 2, height: r * 2, borderRadius: r,
      borderWidth: 2, borderColor: primary,
      backgroundColor: `${primary}10`,
    }]} />
  );
};

// ─── THE BIG PIN (receives visible as plain boolean) ───
const BigPin = ({ visible, primary }: { visible: boolean; primary: string }) => {
  const dropY = useSharedValue(-120);
  const bounce = useSharedValue(0);
  const shadowScl = useSharedValue(0.3);
  const shadowOp = useSharedValue(0.1);

  useEffect(() => {
    if (visible) {
      dropY.value = withSpring(0, { damping: 10, stiffness: 120 });
      bounce.value = withDelay(600, withRepeat(
        withSequence(
          withTiming(-10, { duration: 600, easing: Easing.out(Easing.quad) }),
          withTiming(0,   { duration: 600, easing: Easing.in(Easing.quad) })
        ), -1, true
      ));
      shadowScl.value = withDelay(600, withRepeat(
        withSequence(withTiming(0.6, { duration: 600 }), withTiming(1, { duration: 600 })), -1, true
      ));
      shadowOp.value = withDelay(600, withRepeat(
        withSequence(withTiming(0.2, { duration: 600 }), withTiming(0.5, { duration: 600 })), -1, true
      ));
    }
  }, [visible]);

  const pinStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dropY.value + bounce.value }],
  }));
  const shadowStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: shadowScl.value }],
    opacity: shadowOp.value,
  }));

  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ alignItems: "center", justifyContent: "center", marginBottom: -4 }}>
        <Pulse delay={0}    r={50} primary={primary} />
        <Pulse delay={700}  r={50} primary={primary} />
        <Pulse delay={1400} r={50} primary={primary} />
      </View>
      <Animated.View style={pinStyle}>
        <View style={{
          width: 60, height: 60, borderRadius: 30,
          backgroundColor: primary,
          alignItems: "center", justifyContent: "center",
          borderWidth: 4, borderColor: "#fff",
          shadowColor: primary,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.55, shadowRadius: 16, elevation: 14,
        }}>
          <Ionicons name="location" size={30} color="#fff" style={{ marginLeft: 1, marginTop: 2 }} />
        </View>
        <View style={{
          width: 0, height: 0,
          borderLeftWidth: 10, borderRightWidth: 10, borderTopWidth: 16,
          borderLeftColor: "transparent", borderRightColor: "transparent",
          borderTopColor: primary, alignSelf: "center", marginTop: -2,
        }} />
      </Animated.View>
      <Animated.View style={[shadowStyle, {
        width: 36, height: 10, backgroundColor: "#000",
        borderRadius: 8, marginTop: 6,
      }]} />
    </View>
  );
};

// ─── ALTITUDE INDICATOR ───
const AltitudeBar = ({ primary }: { primary: string }) => {
  const prog = useSharedValue(1);

  useEffect(() => {
    prog.value = withTiming(0, { duration: 2800, easing: Easing.out(Easing.quad) });
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    height: `${prog.value * 100}%` as any,
    opacity: interpolate(prog.value, [0, 0.1], [0, 1], Extrapolation.CLAMP),
  }));

  const altStyle = useAnimatedStyle(() => ({
    opacity: interpolate(prog.value, [0.05, 0.2], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <Animated.View style={[altStyle, {
      position: "absolute", right: 20, top: "20%",
      alignItems: "center", gap: 4,
    }]}>
      <Txt style={{ color: "rgba(255,255,255,0.6)", fontSize: 9, fontFamily: "InterMedium", letterSpacing: 1 }}>
        ALT
      </Txt>
      <View style={{
        width: 3, height: 60, borderRadius: 2,
        backgroundColor: "rgba(255,255,255,0.15)", overflow: "hidden",
        justifyContent: "flex-end",
      }}>
        <Animated.View style={[barStyle, { backgroundColor: primary, borderRadius: 2 }]} />
      </View>
      <Txt style={{ color: "rgba(255,255,255,0.6)", fontSize: 9, fontFamily: "InterMedium" }}>
        GND
      </Txt>
    </Animated.View>
  );
};

// ─── COMPASS ───
const Compass = () => {
  const rotate = useSharedValue(15);

  useEffect(() => {
    rotate.value = withTiming(-15, { duration: 3000, easing: Easing.out(Easing.quad) });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View style={[style, {
      position: "absolute", left: 20, top: "22%",
      width: 32, height: 32, borderRadius: 16,
      backgroundColor: "rgba(0,0,0,0.35)",
      borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
      alignItems: "center", justifyContent: "center",
    }]}>
      <Txt style={{ color: "#EF4444", fontSize: 10, fontFamily: "InterBold" }}>N</Txt>
    </Animated.View>
  );
};

// ────────────────────────────
// MAIN COMPONENT
// ────────────────────────────
interface LocationLoaderProps {
  onReady: () => void;
}

export const LocationLoader = ({ onReady }: LocationLoaderProps) => {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  const isDark = colorScheme === "dark";
  const themeColors = Colors[isDark ? "dark" : "light"];
  const primary = themeColors.primary;        // #3B82F6 light / #60A5FA dark
  const accent  = themeColors.accent;         // #14B8A6 / #2DD4BF
  const success = themeColors.success;        // #22C55E / #4ADE80
  const warning = themeColors.warning;        // #F59E0B / #FBBF24
  const error   = themeColors.error;          // #EF4444 / #F87171

  // ── Camera flyover shared values ──
  const camScale = useSharedValue(0.45);
  const camX     = useSharedValue(-MW * 0.05);
  const camY     = useSharedValue(-MH * 0.08);

  // ── Pin drops after camera lands — use useState not SharedValue to avoid render warning ──
  const [pinVisible, setPinVisible] = useState(false);

  // ── Property markers appear during flyover ──
  const markersOpacity   = useSharedValue(0);
  const uiOpacity        = useSharedValue(0);
  const uiY              = useSharedValue(20);
  const screenOpacity    = useSharedValue(1);
  const vignetteOpacity  = useSharedValue(0);

  useEffect(() => {
    let active = true;

    const EXIT_AFTER   = 1400;
    const PIN_AT       = 600;
    const CAM_DURATION = 1800;
    const MARKER_DELAY = 500;
    const UI_DELAY     = 300;

    // Camera zoom-in flyover
    camScale.value = withTiming(1.15, { duration: CAM_DURATION, easing: Easing.out(Easing.cubic) });
    camX.value     = withTiming(-MW * 0.15, { duration: CAM_DURATION, easing: Easing.out(Easing.cubic) });
    camY.value     = withTiming(-MH * 0.22, { duration: CAM_DURATION, easing: Easing.out(Easing.cubic) });

    vignetteOpacity.value = withTiming(1, { duration: CAM_DURATION * 0.6 });
    uiOpacity.value       = withDelay(UI_DELAY, withTiming(1, { duration: 500 }));
    uiY.value             = withDelay(UI_DELAY, withSpring(0, { damping: 14, stiffness: 80 }));
    markersOpacity.value  = withDelay(MARKER_DELAY, withTiming(1, { duration: 500 }));

    // Drop pin
    const pinTimer = setTimeout(() => { if (active) setPinVisible(true); }, PIN_AT);

    // Exit
    const exitTimer = setTimeout(() => {
      if (!active) return;
      screenOpacity.value = withTiming(0, { duration: 500 });
      setTimeout(() => { if (active) onReady(); }, 520);
    }, EXIT_AFTER);

    return () => { active = false; clearTimeout(pinTimer); clearTimeout(exitTimer); };
  }, []);

  const camStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: camX.value },
      { translateY: camY.value },
      { scale: camScale.value },
    ],
  }));
  const markersStyle  = useAnimatedStyle(() => ({ opacity: markersOpacity.value }));
  const uiStyle       = useAnimatedStyle(() => ({ opacity: uiOpacity.value, transform: [{ translateY: uiY.value }] }));
  const screenStyle   = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));
  const vigStyle      = useAnimatedStyle(() => ({ opacity: vignetteOpacity.value }));

  // Property markers use brand/semantic colors from theme
  const propMarkers = [
    { top: MH * 0.20, left: MW * 0.05, price: "₹12k", color: success,           delay: 1400 },
    { top: MH * 0.26, left: MW * 0.22, price: "₹18k", color: "#8B5CF6",         delay: 1700 },
    { top: MH * 0.30, left: MW * 0.45, price: "₹9k",  color: warning,           delay: 1600 },
    { top: MH * 0.22, left: MW * 0.64, price: "₹24k", color: error,             delay: 1900 },
    { top: MH * 0.38, left: MW * 0.10, price: "₹15k", color: accent,            delay: 2100 },
    { top: MH * 0.42, left: MW * 0.30, price: "₹11k", color: primary,           delay: 2000 },
    { top: MH * 0.36, left: MW * 0.54, price: "₹21k", color: success,           delay: 1800 },
    { top: MH * 0.44, left: MW * 0.72, price: "₹8k",  color: warning,           delay: 2200 },
  ];

  const traffic = [
    { startX: 0,          startY: MH * 0.18 + 3, endX: MW * 0.4,       endY: MH * 0.18 + 3, delay: 0,   color: warning },
    { startX: MW * 0.4,   startY: MH * 0.36 + 3, endX: 0,              endY: MH * 0.36 + 3, delay: 400, color: error   },
    { startX: 0,          startY: MH * 0.54 + 3, endX: MW * 0.5,       endY: MH * 0.54 + 3, delay: 800, color: success },
    { startX: MW * 0.15 + 3, startY: 0,          endX: MW * 0.15 + 3,  endY: MH * 0.5,       delay: 200, color: warning },
    { startX: MW * 0.50 + 3, startY: MH * 0.5,   endX: MW * 0.50 + 3,  endY: 0,              delay: 600, color: "#8B5CF6" },
    { startX: MW * 0.33 + 3, startY: 0,          endX: MW * 0.33 + 3,  endY: MH * 0.6,       delay: 300, color: accent  },
  ];

  // Vignette uses theme dark overlay
  const vignDark = isDark ? "rgba(17,24,39," : "rgba(15,23,42,";

  return (
    <Animated.View style={[StyleSheet.absoluteFill, screenStyle, {
      overflow: "hidden",
      backgroundColor: isDark ? DARK_MAP.base : LIGHT_MAP.base,
    }]}>

      {/* ── ANIMATED MAP WORLD ── */}
      <Animated.View style={[camStyle, { width: MW, height: MH }]}>
        <MapWorld dark={isDark} />

        {traffic.map((t, i) => (
          <TrafficDot key={i} {...t} />
        ))}

        <Animated.View style={[markersStyle, { position: "absolute", top: 0, left: 0, width: MW, height: MH }]}>
          {propMarkers.map((p, i) => (
            <PropertyPin key={i} {...p} />
          ))}
        </Animated.View>

        {/* Big location pin — uses plain boolean from useState, no .value read in render */}
        <View style={{
          position: "absolute",
          top: MH * 0.31, left: MW * 0.27,
          alignItems: "center",
        }}>
          <BigPin visible={pinVisible} primary={primary} />
        </View>
      </Animated.View>

      {/* ── VIGNETTE ── */}
      <Animated.View style={[StyleSheet.absoluteFill, vigStyle, { pointerEvents: "none" }]}>
        <LinearGradient
          colors={[`${vignDark}0.88)`, `${vignDark}0.0)`]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: height * 0.38 }}
        />
        <LinearGradient
          colors={[`${vignDark}0.0)`, `${vignDark}0.78)`]}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: height * 0.30 }}
        />
        <LinearGradient
          colors={[`${vignDark}0.55)`, `${vignDark}0.0)`]}
          start={{ x: 0, y: 0.5 }} end={{ x: 0.25, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={[`${vignDark}0.0)`, `${vignDark}0.55)`]}
          start={{ x: 0.75, y: 0.5 }} end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* ── HUD ── */}
      <Compass />
      <AltitudeBar primary={primary} />

      {/* ── BRAND LOGO ── */}
      <Animated.View style={[uiStyle, {
        position: "absolute", top: insets.top + 16,
        left: 0, right: 0, alignItems: "center",
      }]}>
        <View style={{
          flexDirection: "row", alignItems: "center", gap: 10,
          backgroundColor: "rgba(0,0,0,0.40)",
          paddingHorizontal: 20, paddingVertical: 10,
          borderRadius: 28,
          borderWidth: 1, borderColor: "rgba(255,255,255,0.16)",
        }}>
          <View style={{
            width: 32, height: 32, borderRadius: 11,
            backgroundColor: primary,
            alignItems: "center", justifyContent: "center",
          }}>
            <Ionicons name="home" size={17} color="#fff" />
          </View>
          <Txt style={{ color: "#fff", fontFamily: "InterExtraBold", fontSize: 20, letterSpacing: -0.5 }}>
            rentro
          </Txt>
        </View>
      </Animated.View>

      {/* ── BOTTOM STATUS ── */}
      <Animated.View style={[uiStyle, {
        position: "absolute", bottom: insets.bottom + 40,
        left: 0, right: 0, alignItems: "center",
      }]}>
        <View style={{
          flexDirection: "row", alignItems: "center", gap: 6,
          backgroundColor: "rgba(0,0,0,0.32)",
          paddingHorizontal: 16, paddingVertical: 6,
          borderRadius: 20,
        }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: success }} />
          <Txt style={{ color: "rgba(255,255,255,0.82)", fontFamily: "InterMedium", fontSize: 12, letterSpacing: 0.3 }}>
            Exploring your neighbourhood
          </Txt>
        </View>
      </Animated.View>

    </Animated.View>
  );
};

export default LocationLoader;
