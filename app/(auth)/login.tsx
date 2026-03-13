import { router } from "expo-router";
import {
    ArrowLeft,
    Gamepad2,
    HelpCircle,
    Lock,
    Mail,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    Easing,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { signIn } from "../../lib/auth";

const { width, height } = Dimensions.get("window");

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn(identifier.trim(), password);

      if (result.success) {
        setUser(result.user);
        router.replace("/(tabs)/home" as any);
      } else {
        Alert.alert("Login Failed", result.error);
      }
    } catch {
      Alert.alert("Login Failed", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const floatOrb1 = useRef(new Animated.Value(0)).current;
  const floatOrb2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    const createFloatAnimation = (
      anim: Animated.Value,
      duration: number,
      delay: number = 0,
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
            delay,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );
    };

    createFloatAnimation(floatOrb1, 4000).start();
    createFloatAnimation(floatOrb2, 5000, 1000).start();
  }, []);

  const getFloatStyle = (animRef: Animated.Value, distance: number) => ({
    transform: [
      {
        translateY: animRef.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -distance],
        }),
      },
    ],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

      {/* Decorative Orbs */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Animated.View
          style={[
            styles.glowOrb,
            styles.orbTopRight,
            getFloatStyle(floatOrb1, 25),
          ]}
        />
        <Animated.View
          style={[
            styles.glowOrb,
            styles.orbBottomLeft,
            getFloatStyle(floatOrb2, 20),
          ]}
        />
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Animated.ScrollView
          contentContainerStyle={styles.content}
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* --- TOP SECTION --- */}
          <View style={styles.headerArea}>
            <View style={styles.topNav}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.navBtnWrapper}
                onPress={() => router.back()}
              >
                <View style={styles.navBtn}>
                  <ArrowLeft size={22} color="#ffffff" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.navBtnWrapper}
              >
                <View style={styles.navBtn}>
                  <HelpCircle size={22} color="#ffffff" />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.brandRow}>
              <View style={styles.iconCoreContainer}>
                <Gamepad2 size={20} color="#0B0F19" fill="#39FF14" />
              </View>
              <Text style={styles.brandName}>SwapGamers GH</Text>
            </View>

            <Text
              style={styles.heroTitle}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              Welcome back.
            </Text>
            <Text style={styles.heroSubtitle}>
              Log in to continue swapping, playing, and repeating.
            </Text>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.tabInactive}
                onPress={() => router.replace("/(auth)/signup")}
              >
                <Text style={styles.tabInactiveText}>Sign Up</Text>
              </TouchableOpacity>
              <View style={styles.tabActive}>
                <Text style={styles.tabActiveText}>Login</Text>
              </View>
            </View>
          </View>

          {/* --- MIDDLE FORM SECTION --- */}
          <View style={styles.formContainer}>
            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email or Phone</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={18} color="#64748B" />
                  <TextInput
                    style={styles.input}
                    placeholder="kofi@example.com"
                    placeholderTextColor="#475569"
                    value={identifier}
                    onChangeText={setIdentifier}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={18} color="#64748B" />
                  <TextInput
                    style={[styles.input, styles.inputFlex]}
                    placeholder="•••••••••"
                    placeholderTextColor="#475569"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.forgotText}>Forgot?</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.formBottom}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  loading && styles.primaryButtonDisabled,
                ]}
                activeOpacity={0.8}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Signing In..." : "Log In"}
                </Text>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.8}
              >
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.secondaryButtonText}>Google</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* --- BOTTOM SECTION --- */}
          <View style={styles.footerArea}>
            <View style={styles.momoCard}>
              <View style={styles.momoCardHeader}>
                <Text style={styles.momoCardTitle}>Quick Payment Methods</Text>
                <View style={styles.pulseBadgeContainer}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.pulseText}>MoMo Live</Text>
                </View>
              </View>
              <View style={styles.momoOptions}>
                <TouchableOpacity style={styles.momoOption} activeOpacity={0.7}>
                  <Text style={styles.momoOptionIcon}>🟡</Text>
                  <Text style={styles.momoOptionText}>MTN</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.momoOption} activeOpacity={0.7}>
                  <Text style={styles.momoOptionIcon}>🔴</Text>
                  <Text style={styles.momoOptionText}>Telecel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B0F19",
  },
  glowOrb: {
    position: "absolute",
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: "#39FF14",
    opacity: 0.06,
    filter: "blur(60px)",
  },
  orbTopRight: {
    top: -width * 0.1,
    right: -width * 0.2,
  },
  orbBottomLeft: {
    bottom: height * 0.1,
    left: -width * 0.3,
    backgroundColor: "#1D4ED8",
    opacity: 0.08,
  },
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
    justifyContent: "space-between",
  },
  headerArea: {
    flexShrink: 1,
    marginBottom: 8,
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navBtnWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  navBtn: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(57, 255, 20, 0.08)",
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(57, 255, 20, 0.2)",
  },
  iconCoreContainer: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "#39FF14",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  brandName: { color: "#39FF14", fontSize: 13, fontWeight: "700" },
  heroTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: "#8B9BB4",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
    flexShrink: 0,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  tabInactive: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabInactiveText: { color: "#8B9BB4", fontSize: 14, fontWeight: "600" },
  tabActive: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#39FF14",
    shadowColor: "#39FF14",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabActiveText: { color: "#0B0F19", fontSize: 14, fontWeight: "800" },

  formContainer: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  form: {
    gap: 12,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 15,
    padding: 0,
    height: 20,
    fontWeight: "500",
  },
  inputFlex: { flex: 1 },
  forgotText: { color: "#39FF14", fontSize: 13, fontWeight: "700" },

  formBottom: {
    gap: 12,
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: "#39FF14",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#39FF14",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonDisabled: {
    backgroundColor: "rgba(57, 255, 20, 0.3)",
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: "#0B0F19",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  dividerText: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 14,
    paddingVertical: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  googleIcon: { color: "#ffffff", fontSize: 16, fontWeight: "900" },
  secondaryButtonText: { color: "#ffffff", fontSize: 15, fontWeight: "700" },

  footerArea: {
    flexShrink: 0,
    marginTop: 12,
  },
  momoCard: {
    backgroundColor: "rgba(29, 78, 216, 0.1)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(29, 78, 216, 0.3)",
  },
  momoCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  momoCardTitle: { color: "#ffffff", fontSize: 14, fontWeight: "700" },
  pulseBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(57, 255, 20, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#39FF14",
  },
  pulseText: { color: "#39FF14", fontSize: 10, fontWeight: "800" },
  momoOptions: { flexDirection: "row", gap: 10 },
  momoOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  momoOptionIcon: { fontSize: 14 },
  momoOptionText: { color: "#E2E8F0", fontSize: 13, fontWeight: "700" },
});

export default Login;
