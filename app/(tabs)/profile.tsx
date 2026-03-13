import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { getSwapHistory, getUserData, logOut, updateUserData } from "../../lib/auth";

const PURCHASE_HISTORY = [
  {
    id: "1",
    title: "DualSense Controller",
    subtitle: "Delivered to Adenta · GHS 850",
    status: "Paid",
    icon: "🎮",
    iconBg: "#111827",
  },
  {
    id: "2",
    title: "Pro Audio Headset",
    subtitle: "Delivered to Kumasi · GHS 450",
    status: "Paid",
    icon: "🎧",
    iconBg: "#111827",
  },
];

const SETTINGS = [
  {
    id: "notifications",
    icon: "🔔",
    label: "Notifications",
    subtitle: "Swap alerts, delivery updates, and new drops",
  },
  {
    id: "payment",
    icon: "💳",
    label: "Payment Methods",
    subtitle: "MTN MoMo, Telecel Cash, card details",
  },
  {
    id: "swap-history",
    icon: "🔄",
    label: "Full Swap History",
    subtitle: "View all your past swaps and ratings",
  },
  {
    id: "logout",
    icon: "🚪",
    label: "Logout",
    subtitle: "Securely sign out of your account",
    danger: true,
  },
];

const Profile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [swapHistory, setSwapHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const [userProfile, history] = await Promise.all([
            getUserData(user.uid),
            getSwapHistory(user.uid),
          ]);
          setUserData(userProfile);
          setSwapHistory(history || []);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const pickProfileImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "We need camera roll permissions to update your photo.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled && result.assets?.[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        if (user) {
          await updateUserData(user.uid, { profileImage: imageUri });
          setUserData((prev: any) => ({ ...prev, profileImage: imageUri }));
        }
        Alert.alert("Success", "Profile photo updated!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile photo");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logOut();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleSettingPress = (id: string) => {
    switch (id) {
      case "notifications":
        router.push("/notifications");
        break;
      case "payment":
        Alert.alert(
          "Payment Methods",
          "Manage your payment methods:\n\n• MTN MoMo\n• Telecel Cash\n\nPayment management coming soon!"
        );
        break;
      case "swap-history":
        // Could navigate to a full swap history screen
        Alert.alert("Swap History", "Full swap history screen coming soon!");
        break;
      case "logout":
        handleLogout();
        break;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0f1a" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22ff88" />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0f1a" />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorEmoji}>🔒</Text>
          <Text style={styles.errorText}>Please login to view your profile</Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.replace("/(auth)/login")}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const displayName = userData?.fullName || userData?.displayName || "Gamer";
  const currentImage = userData?.profileImage || profileImage;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1a" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => router.push("/settings")}
          >
            <Text style={styles.settingsBtnIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Hero */}
        <View style={styles.profileHero}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={pickProfileImage}
            activeOpacity={0.8}
          >
            {currentImage ? (
              <Image source={{ uri: currentImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.editIcon}>
              <Text style={styles.editIconText}>📷</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{displayName}</Text>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>Pro Active</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>{userData?.location || "Ghana"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>⭐</Text>
            <Text style={styles.infoText}>
              {userData?.rating?.toFixed(1) || "5.0"} Rating
            </Text>
          </View>
          {userData?.email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📧</Text>
              <Text style={styles.infoText}>{userData.email}</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData?.totalSwaps || 0}</Text>
            <Text style={styles.statLabel}>Total Swaps</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{swapHistory.length}</Text>
            <Text style={styles.statLabel}>History</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData?.rating?.toFixed(1) || "5.0"}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Subscription Status */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Subscription</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>Manage</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subCard}>
            <View style={styles.subCardTop}>
              <Text style={styles.subPlanName}>3-Month Elite Plan</Text>
              <View style={styles.renewsBadge}>
                <Text style={styles.renewsText}>Renews in 18 days</Text>
              </View>
            </View>
            <View style={styles.subDescBox}>
              <Text style={styles.subDesc}>
                Priority swaps in Accra and Kumasi, plus discounted accessory delivery.
              </Text>
            </View>
            <View style={styles.subStats}>
              <View style={styles.subStat}>
                <Text style={styles.subStatNumber}>6</Text>
                <Text style={styles.subStatLabel}>Allowed</Text>
              </View>
              <View style={styles.subStat}>
                <Text style={styles.subStatNumber}>2</Text>
                <Text style={styles.subStatLabel}>Left</Text>
              </View>
              <View style={styles.subStat}>
                <Text style={styles.subStatNumber}>MoMo</Text>
                <Text style={styles.subStatLabel}>Payment</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Swap History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Swap History</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.listCard}>
            {swapHistory.length === 0 ? (
              <View style={styles.emptyList}>
                <Text style={styles.emptyListText}>No swaps yet. Start swapping!</Text>
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/swap")}
                  style={styles.startSwapBtn}
                >
                  <Text style={styles.startSwapText}>Browse Games</Text>
                </TouchableOpacity>
              </View>
            ) : (
              swapHistory.slice(0, 3).map((item, idx) => (
                <View key={item.id}>
                  <View style={styles.listItem}>
                    <View style={[styles.listItemIcon, { backgroundColor: item.status === "completed" ? "#0f2a1a" : "#111827" }]}>
                      <Text style={[styles.listItemIconText, { color: item.status === "completed" ? "#22ff88" : "#60a5fa" }]}>
                        {item.status === "completed" ? "✓" : "⏳"}
                      </Text>
                    </View>
                    <View style={styles.listItemInfo}>
                      <Text style={styles.listItemTitle} numberOfLines={1}>
                        {item.gameTitle}
                      </Text>
                      <Text style={styles.listItemSubtitle}>
                        {item.type === "given" ? "Given to " : "Received from "}{item.partnerName}
                      </Text>
                    </View>
                    <Text style={[styles.listItemStatus, { color: item.status === "completed" ? "#22ff88" : "#60a5fa" }]}>
                      {item.status}
                    </Text>
                  </View>
                  {idx < Math.min(swapHistory.length, 3) - 1 && <View style={styles.listDivider} />}
                </View>
              ))
            )}
          </View>
        </View>

        {/* Purchase History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Purchase History</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>Receipts</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.listCard}>
            {PURCHASE_HISTORY.map((item, idx) => (
              <View key={item.id}>
                <View style={styles.listItem}>
                  <View style={[styles.listItemIcon, { backgroundColor: item.iconBg }]}>
                    <Text style={styles.listItemIconEmoji}>{item.icon}</Text>
                  </View>
                  <View style={styles.listItemInfo}>
                    <Text style={styles.listItemTitle}>{item.title}</Text>
                    <Text style={styles.listItemSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Text style={styles.paidBadge}>{item.status}</Text>
                </View>
                {idx < PURCHASE_HISTORY.length - 1 && <View style={styles.listDivider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.listCard}>
            {SETTINGS.map((item, idx) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.listItem}
                  activeOpacity={0.7}
                  onPress={() => handleSettingPress(item.id)}
                >
                  <View style={[styles.listItemIcon, { backgroundColor: item.danger ? "rgba(248,113,113,0.15)" : "#111827" }]}>
                    <Text style={styles.listItemIconEmoji}>{item.icon}</Text>
                  </View>
                  <View style={styles.listItemInfo}>
                    <Text style={[styles.listItemTitle, item.danger && styles.dangerText]}>
                      {item.label}
                    </Text>
                    <Text style={styles.listItemSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
                {idx < SETTINGS.length - 1 && <View style={styles.listDivider} />}
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0a0f1a" },
  scrollContent: { paddingBottom: 120 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0a0f1a", gap: 16 },
  errorEmoji: { fontSize: 48 },
  errorText: { color: "#f87171", fontSize: 16, fontWeight: "500", textAlign: "center" },
  loginBtn: { backgroundColor: "#22ff88", paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  loginBtnText: { color: "#0a0f1a", fontSize: 15, fontWeight: "800" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: { color: "#ffffff", fontSize: 28, fontWeight: "900", letterSpacing: -0.5 },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1e2d45",
  },
  settingsBtnIcon: { color: "#8a9ab0", fontSize: 18 },
  profileHero: { alignItems: "center", paddingVertical: 24, paddingHorizontal: 20, gap: 8 },
  avatarWrapper: { marginBottom: 4 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1e3a5f",
    borderWidth: 3,
    borderColor: "#22ff88",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: { width: 80, height: 80, borderRadius: 40 },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#39FF14",
    borderRadius: 12,
    padding: 4,
  },
  editIconText: { fontSize: 12 },
  avatarEmoji: { fontSize: 36, fontWeight: "800", color: "#22ff88" },
  profileName: { color: "#ffffff", fontSize: 22, fontWeight: "800", letterSpacing: -0.3 },
  proBadge: {
    backgroundColor: "#22ff88",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  proBadgeText: { color: "#0a0f1a", fontSize: 12, fontWeight: "800" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoIcon: { fontSize: 13, opacity: 0.7 },
  infoText: { color: "#8a9ab0", fontSize: 14, fontWeight: "500" },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: "#0f1624",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e2d45",
    marginBottom: 24,
  },
  statItem: { flex: 1, alignItems: "center", gap: 3 },
  statDivider: { width: 1, backgroundColor: "#1e2d45", marginVertical: 4 },
  statNumber: { color: "#ffffff", fontSize: 22, fontWeight: "800" },
  statLabel: { color: "#4a5568", fontSize: 11, fontWeight: "500" },
  section: { marginHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { color: "#ffffff", fontSize: 18, fontWeight: "800", marginBottom: 12, letterSpacing: -0.2 },
  sectionAction: { color: "#22ff88", fontSize: 13, fontWeight: "600" },
  subCard: {
    backgroundColor: "#0f1624",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e2d45",
    gap: 14,
  },
  subCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 },
  subPlanName: { color: "#ffffff", fontSize: 16, fontWeight: "800" },
  renewsBadge: {
    backgroundColor: "rgba(34,255,136,0.12)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(34,255,136,0.25)",
  },
  renewsText: { color: "#22ff88", fontSize: 11, fontWeight: "700" },
  subDescBox: {
    borderWidth: 1.5,
    borderColor: "#2563eb",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "rgba(37,99,235,0.06)",
  },
  subDesc: { color: "#8a9ab0", fontSize: 13, lineHeight: 19 },
  subStats: { flexDirection: "row" },
  subStat: { flex: 1, alignItems: "flex-start", gap: 2 },
  subStatNumber: { color: "#ffffff", fontSize: 18, fontWeight: "800" },
  subStatLabel: { color: "#4a5568", fontSize: 11, fontWeight: "500" },
  listCard: {
    backgroundColor: "#0f1624",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1e2d45",
    overflow: "hidden",
  },
  listItem: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  listDivider: { height: 1, backgroundColor: "#1a2438", marginHorizontal: 14 },
  listItemIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  listItemIconText: { fontSize: 18, fontWeight: "700" },
  listItemIconEmoji: { fontSize: 18 },
  listItemInfo: { flex: 1, gap: 2 },
  listItemTitle: { color: "#e2e8f0", fontSize: 14, fontWeight: "700" },
  listItemSubtitle: { color: "#4a5568", fontSize: 12, fontWeight: "400", lineHeight: 17 },
  listItemStatus: { fontSize: 13, fontWeight: "700" },
  paidBadge: { color: "#22ff88", fontSize: 13, fontWeight: "700" },
  chevron: { color: "#3a4460", fontSize: 22, fontWeight: "300" },
  dangerText: { color: "#f87171" },
  emptyList: { padding: 20, alignItems: "center", gap: 12 },
  emptyListText: { color: "#64748b", fontSize: 14, textAlign: "center" },
  startSwapBtn: { backgroundColor: "#2563eb", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  startSwapText: { color: "#ffffff", fontSize: 13, fontWeight: "700" },
});

export default Profile;