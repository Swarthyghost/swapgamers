import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  Camera,
  Eye,
  EyeOff,
  Gamepad2,
  Lock,
  Mail,
  Phone,
  Smartphone,
  Upload,
  User,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
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
import { signUp } from "../../lib/auth";

const { width, height } = Dimensions.get("window");

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [momoNumber, setMomoNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "We need camera roll permissions to make this work!");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleSignup = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const result = await signUp(email.trim(), password, {
        fullName: fullName.trim(),
        phone: phone.trim(),
        momoNumber: momoNumber.trim(),
        profileImage: profileImage,
        momoProvider:
          momoNumber.startsWith("055") || momoNumber.startsWith("025")
            ? "mtn"
            : "telecel",
      });
      if (result.success && result.user) {
        setUser(result.user);
        router.replace("/(tabs)/home" as any);
      } else {
        Alert.alert("Signup Failed", result.error);
      }
    } catch {
      Alert.alert("Signup Failed", "An unexpected error occurred");
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
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
    ]).start();
    const createFloatAnimation = (anim: Animated.Value, duration: number, delay: number = 0) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true, delay }),
          Animated.timing(anim, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      );
    };
    createFloatAnimation(floatOrb1, 4000).start();
    createFloatAnimation(floatOrb2, 5000, 1000).start();
  }, []);

  const getFloatStyle = (animRef: Animated.Value, distance: number) => ({
    transform: [{ translateY: animRef.interpolate({ inputRange: [0, 1], outputRange: [0, -distance] }) }],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Animated.View style={[styles.glowOrb, styles.orbTopLeft, getFloatStyle(floatOrb1, 20)]} />
        <Animated.View style={[styles.glowOrb, styles.orbBottomRight, getFloatStyle(floatOrb2, 25)]} />
      </View>

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Animated.ScrollView
          contentContainerStyle={styles.content}
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top */}
          <View style={styles.topArea}>
            <View style={styles.header}>
              <View style={styles.brandRow}>
                <View style={styles.iconCoreContainer}>
                  <Gamepad2 size={16} color="#0B0F19" fill="#1D4ED8" />
                </View>
                <Text style={styles.brandName}>SwapGamers GH</Text>
              </View>
              <Text style={styles.title}>Create Account</Text>
            </View>
            <View style={styles.tabContainer}>
              <TouchableOpacity style={styles.tabInactive} onPress={() => router.replace("/(auth)/login")}>
                <Text style={styles.tabInactiveText}>Login</Text>
              </TouchableOpacity>
              <View style={styles.tabActive}>
                <Text style={styles.tabActiveText}>Sign Up</Text>
              </View>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formArea}>
            <View style={styles.form}>
              {/* Profile Image */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Profile Photo</Text>
                <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage} activeOpacity={0.8}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                  ) : (
                    <View style={styles.profileImagePlaceholder}>
                      <Camera size={32} color="#64748B" />
                      <Text style={styles.profileImageText}>Add Photo</Text>
                    </View>
                  )}
                  <View style={styles.uploadIcon}>
                    <Upload size={16} color="#22FF88" />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.fieldGroupRow}>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Full Name *</Text>
                  <View style={styles.inputWrapper}>
                    <User size={16} color="#64748B" />
                    <TextInput style={styles.input} placeholder="Kofi Mensah" placeholderTextColor="#475569" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
                  </View>
                </View>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Phone</Text>
                  <View style={styles.inputWrapper}>
                    <Phone size={16} color="#64748B" />
                    <TextInput style={styles.input} placeholder="055 123 4567" placeholderTextColor="#475569" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                  </View>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email Address *</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={16} color="#64748B" />
                  <TextInput style={styles.input} placeholder="kofi@example.com" placeholderTextColor="#475569" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Password *</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={16} color="#64748B" />
                  <TextInput style={[styles.input, styles.inputFlex]} placeholder="••••••••" placeholderTextColor="#475569" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                  <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Eye size={16} color="#39FF14" /> : <EyeOff size={16} color="#64748B" />}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Mobile Money Number</Text>
                <View style={[styles.inputWrapper, styles.inputWrapperHighlighted]}>
                  <Smartphone size={16} color="#39FF14" />
                  <TextInput style={styles.input} placeholder="MTN / Telecel Number" placeholderTextColor="#475569" value={momoNumber} onChangeText={setMomoNumber} keyboardType="phone-pad" />
                </View>
              </View>
            </View>

            <View style={styles.formBottom}>
              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                activeOpacity={0.8}
                onPress={handleSignup}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>{loading ? "Creating Account..." : "Create Account"}</Text>
              </TouchableOpacity>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                <View style={styles.dividerLine} />
              </View>
              <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.secondaryButtonText}>Google</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footerArea}>
            <Text style={styles.termsText}>
              By signing up, you agree to our{" "}
              <Text style={styles.termsLink}>Terms</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0B0F19" },
  glowOrb: { position: "absolute", width: width * 0.7, height: width * 0.7, borderRadius: width * 0.35, backgroundColor: "#1D4ED8", opacity: 0.08 },
  orbTopLeft: { top: -width * 0.1, left: -width * 0.2 },
  orbBottomRight: { bottom: height * 0.1, right: -width * 0.3, backgroundColor: "#39FF14", opacity: 0.05 },
  container: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 8, paddingBottom: 20, justifyContent: "space-between" },
  topArea: { flexShrink: 1 },
  header: { marginBottom: 10 },
  brandRow: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(29,78,216,0.1)", alignSelf: "flex-start", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 8, borderWidth: 1, borderColor: "rgba(29,78,216,0.2)" },
  iconCoreContainer: { width: 20, height: 20, borderRadius: 6, backgroundColor: "#1D4ED8", alignItems: "center", justifyContent: "center", marginRight: 6 },
  brandName: { color: "#60A5FA", fontSize: 11, fontWeight: "700" },
  title: { color: "#ffffff", fontSize: 26, fontWeight: "900", letterSpacing: -0.5 },
  tabContainer: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 3, marginBottom: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  tabInactive: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabInactiveText: { color: "#8B9BB4", fontSize: 13, fontWeight: "600" },
  tabActive: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10, backgroundColor: "#1D4ED8", shadowColor: "#1D4ED8", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  tabActiveText: { color: "#ffffff", fontSize: 13, fontWeight: "800" },
  formArea: { flex: 1, justifyContent: "space-evenly" },
  form: { gap: 8 },
  fieldGroupRow: { flexDirection: "row", gap: 10 },
  fieldGroup: { gap: 4 },
  label: { color: "#E2E8F0", fontSize: 12, fontWeight: "600", marginLeft: 2 },
  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  inputWrapperHighlighted: { borderColor: "rgba(57,255,20,0.4)", backgroundColor: "rgba(57,255,20,0.03)" },
  profileImageContainer: { alignItems: "center", marginBottom: 8 },
  profileImage: { width: 80, height: 80, borderRadius: 40 },
  profileImagePlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 2, borderColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center", gap: 4 },
  profileImageText: { color: "#64748B", fontSize: 12, fontWeight: "500" },
  uploadIcon: { position: "absolute", bottom: 4, right: "35%", backgroundColor: "#39FF14", borderRadius: 12, padding: 4 },
  input: { flex: 1, color: "#ffffff", fontSize: 14, padding: 0, height: 18, fontWeight: "500" },
  inputFlex: { flex: 1 },
  formBottom: { gap: 8, marginTop: 8 },
  primaryButton: { backgroundColor: "#39FF14", borderRadius: 14, paddingVertical: 14, alignItems: "center", shadowColor: "#39FF14", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  primaryButtonDisabled: { backgroundColor: "rgba(57,255,20,0.3)", shadowOpacity: 0, elevation: 0 },
  primaryButtonText: { color: "#0B0F19", fontSize: 15, fontWeight: "800", letterSpacing: 0.5 },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  dividerText: { color: "#64748B", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  secondaryButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 14, paddingVertical: 12, gap: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  googleIcon: { color: "#ffffff", fontSize: 16, fontWeight: "900" },
  secondaryButtonText: { color: "#ffffff", fontSize: 14, fontWeight: "700" },
  footerArea: { flexShrink: 0, marginTop: 10 },
  termsText: { color: "#64748B", fontSize: 11, textAlign: "center" },
  termsLink: { color: "#39FF14", fontWeight: "700" },
});

export default Signup;