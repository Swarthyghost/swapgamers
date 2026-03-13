import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Easing,
} from "react-native";

import { router } from "expo-router";
import { Gamepad2, Headphones, Trophy, MonitorSmartphone } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Floating animations for background elements
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous floating animations
    const createFloatAnimation = (animValue: Animated.Value, duration: number, delay: number = 0) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
            delay: delay,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
    };

    createFloatAnimation(float1, 3000).start();
    createFloatAnimation(float2, 4000, 500).start();
    createFloatAnimation(float3, 3500, 1000).start();
  }, []);

  const getFloatStyle = (animValue: Animated.Value, distance: number) => ({
    transform: [
      {
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -distance],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

      {/* Decorative Background Elements */}
      <View style={styles.backgroundDecorations}>
        <View style={[styles.glowOrb, styles.orbTopLeft]} />
        <View style={[styles.glowOrb, styles.orbBottomRight]} />
      </View>

      {/* Floating Icons */}
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={[styles.floatingIcon, { top: "15%", left: "10%" }, getFloatStyle(float1, 15)]}>
          <Headphones size={32} color="rgba(57, 255, 20, 0.2)" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { top: "25%", right: "15%" }, getFloatStyle(float2, 20)]}>
          <Gamepad2 size={40} color="rgba(57, 255, 20, 0.15)" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { top: "60%", left: "15%" }, getFloatStyle(float3, 10)]}>
          <Trophy size={28} color="rgba(57, 255, 20, 0.2)" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { top: "50%", right: "10%" }, getFloatStyle(float1, 25)]}>
          <MonitorSmartphone size={36} color="rgba(57, 255, 20, 0.15)" />
        </Animated.View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.mainIconContainer}>
            <View style={styles.iconPulseRing1} />
            <View style={styles.iconPulseRing2} />
            <View style={styles.iconCore}>
              <Gamepad2 size={56} color="#0B0F19" fill="#39FF14" />
            </View>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>SwapGamers</Text>
            <Text style={styles.badgeText}>GH</Text>
          </View>
          
          <Text style={styles.subtitle}>
            Your premium hub to trade, discover, and play the best games.
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => router.push("/(auth)/signup")}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <View style={styles.buttonArrowContainer}>
              <Trophy size={20} color="#39FF14" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.loginContainer}>
             <Text style={styles.loginText}>Already have an account? </Text>
             <TouchableOpacity activeOpacity={0.7}>
               <Text style={styles.loginLink}>Log In</Text>
             </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F19", // Deep, rich dark background
  },
  backgroundDecorations: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  glowOrb: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "#39FF14", // Neon green
    opacity: 0.05,
    filter: "blur(60px)", // Works on web/newer native, acts as fallback
  },
  orbTopLeft: {
    top: -width * 0.2,
    left: -width * 0.2,
  },
  orbBottomRight: {
    bottom: -width * 0.2,
    right: -width * 0.2,
    backgroundColor: "#1D4ED8", // Deep blue subtle mix
    opacity: 0.08,
  },
  floatingIcon: {
    position: "absolute",
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  heroSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mainIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  iconCore: {
    width: 110,
    height: 110,
    borderRadius: 35,
    backgroundColor: "#39FF14",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
    shadowColor: "#39FF14",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  iconPulseRing1: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 45,
    backgroundColor: "rgba(57, 255, 20, 0.15)",
    zIndex: 2,
  },
  iconPulseRing2: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 55,
    backgroundColor: "rgba(57, 255, 20, 0.05)",
    zIndex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  titleText: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  badgeText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0B0F19",
    backgroundColor: "#39FF14",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
    overflow: "hidden",
  },
  subtitle: {
    fontSize: 16,
    color: "#8B9BB4",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
    paddingHorizontal: 10,
  },
  footer: {
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "rgba(57, 255, 20, 0.1)",
    borderWidth: 1.5,
    borderColor: "#39FF14",
    borderRadius: 20,
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    shadowColor: "#39FF14",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  primaryButtonText: {
    color: "#39FF14",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginRight: 12,
  },
  buttonArrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(57, 255, 20, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#64748B",
    fontSize: 15,
  },
  loginLink: {
    color: "#39FF14",
    fontSize: 15,
    fontWeight: "700",
  },
});