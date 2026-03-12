import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;
  const btnSlide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 7, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(btnOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(btnSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0e1621" />

      {/* ── Branding ── */}
      <View style={styles.brandingWrap}>
        <Animated.View
          style={[styles.iconWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
        >
          <View style={styles.iconGlow} />
          <View style={styles.iconBox}>
            <Text style={styles.iconEmoji}>🎮</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.nameRow, { opacity: textOpacity }]}>
          <Text style={styles.nameWhite}>SwapGamers </Text>
          <Text style={styles.nameGreen}>GH</Text>
        </Animated.View>

        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          SWAP. PLAY. REPEAT.
        </Animated.Text>
      </View>

      {/* ── Bottom ── */}
      <Animated.View
        style={[styles.bottomWrap, { opacity: btnOpacity, transform: [{ translateY: btnSlide }] }]}
      >
        <View style={styles.barTrack}>
          <View style={styles.barFill} />
        </View>

        <TouchableOpacity onPress={() => router.push('/(auth)/signup')} activeOpacity={0.85} style={styles.btn}>
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e1621",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 52,
  },
  brandingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  iconGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#1aff6b",
    opacity: 0.08,
  },
  iconBox: {
    width: 108,
    height: 108,
    borderRadius: 26,
    backgroundColor: "#1a3a3a",
    borderWidth: 1.5,
    borderColor: "#20c874",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#20c874",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 18,
  },
  iconEmoji: { fontSize: 52 },
  nameRow: { flexDirection: "row", alignItems: "baseline" },
  nameWhite: { fontSize: 34, fontWeight: "800", color: "#ffffff", letterSpacing: 0.2 },
  nameGreen: { fontSize: 34, fontWeight: "800", color: "#39FF14", letterSpacing: 0.2 },
  tagline: { marginTop: 10, fontSize: 11.5, letterSpacing: 4, color: "#6b7a8d", fontWeight: "500" },

  bottomWrap: {
    width: "100%",
    paddingHorizontal: 28,
    alignItems: "center",
    gap: 20,
  },
  barTrack: {
    width: width * 0.58,
    height: 3,
    backgroundColor: "#1e2a38",
    borderRadius: 99,
    overflow: "hidden",
  },
  barFill: {
    width: "55%",
    height: "100%",
    borderRadius: 99,
    backgroundColor: "#39FF14",
    shadowColor: "#39FF14",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
  },
  btn: {
    width: "100%",
    height: 58,
    borderRadius: 14,
    backgroundColor: "#39FF14",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#39FF14",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  btnText: {
    color: "#0e1621",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});