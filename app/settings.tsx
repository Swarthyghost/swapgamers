import { router } from "expo-router";
import { ArrowLeft, Bell, CreditCard, HelpCircle, Info, Lock, Shield } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Settings() {
  const [swapAlerts, setSwapAlerts] = useState(true);
  const [communityNotifs, setCommunityNotifs] = useState(true);
  const [deliveryAlerts, setDeliveryAlerts] = useState(true);
  const [marketingNotifs, setMarketingNotifs] = useState(false);

  const handlePaymentPress = () => {
    Alert.alert(
      "Payment Methods",
      "Currently supported:\n\n🟡 MTN MoMo\n🔴 Telecel Cash\n\nMore payment options coming soon!"
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Notifications Section */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Bell size={18} color="#22ff88" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Swap Requests</Text>
              <Text style={styles.settingSubtext}>When someone requests your game</Text>
            </View>
            <Switch
              value={swapAlerts}
              onValueChange={setSwapAlerts}
              trackColor={{ false: "#1e2d45", true: "rgba(34,255,136,0.4)" }}
              thumbColor={swapAlerts ? "#22ff88" : "#4a5568"}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Bell size={18} color="#60a5fa" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Community</Text>
              <Text style={styles.settingSubtext}>Likes, comments on your posts</Text>
            </View>
            <Switch
              value={communityNotifs}
              onValueChange={setCommunityNotifs}
              trackColor={{ false: "#1e2d45", true: "rgba(96,165,250,0.4)" }}
              thumbColor={communityNotifs ? "#60a5fa" : "#4a5568"}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Bell size={18} color="#f59e0b" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Delivery Updates</Text>
              <Text style={styles.settingSubtext}>Shop order status and tracking</Text>
            </View>
            <Switch
              value={deliveryAlerts}
              onValueChange={setDeliveryAlerts}
              trackColor={{ false: "#1e2d45", true: "rgba(245,158,11,0.4)" }}
              thumbColor={deliveryAlerts ? "#f59e0b" : "#4a5568"}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Bell size={18} color="#8a9ab0" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Promotions</Text>
              <Text style={styles.settingSubtext}>New games, deals, and offers</Text>
            </View>
            <Switch
              value={marketingNotifs}
              onValueChange={setMarketingNotifs}
              trackColor={{ false: "#1e2d45", true: "rgba(34,255,136,0.3)" }}
              thumbColor={marketingNotifs ? "#22ff88" : "#4a5568"}
            />
          </View>
        </View>

        {/* Payment Section */}
        <Text style={styles.sectionTitle}>Payment</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingRow} onPress={handlePaymentPress} activeOpacity={0.7}>
            <View style={[styles.settingIcon, { backgroundColor: "rgba(245,158,11,0.1)" }]}>
              <CreditCard size={18} color="#f59e0b" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Payment Methods</Text>
              <Text style={styles.settingSubtext}>MTN MoMo · Telecel Cash</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy & Security */}
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => Alert.alert("Privacy", "Privacy settings coming soon!")}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIcon, { backgroundColor: "rgba(37,99,235,0.1)" }]}>
              <Shield size={18} color="#2563eb" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Privacy Settings</Text>
              <Text style={styles.settingSubtext}>Control who can see your profile</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => Alert.alert("Password", "Change password via email link sent to your registered email.")}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIcon, { backgroundColor: "rgba(168,85,247,0.1)" }]}>
              <Lock size={18} color="#a855f7" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Change Password</Text>
              <Text style={styles.settingSubtext}>Update your account password</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Support */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push("/(tabs)/assist")}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIcon, { backgroundColor: "rgba(34,255,136,0.1)" }]}>
              <HelpCircle size={18} color="#22ff88" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Help & Support</Text>
              <Text style={styles.settingSubtext}>Chat with AI or contact support</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => Alert.alert("About SwapGamers GH", "Version 1.0.0\n\nSwapGamers GH is the #1 game swapping app in Ghana. Built for gamers, by gamers.\n\n© 2024 SwapGamers GH")}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIcon, { backgroundColor: "rgba(96,165,250,0.1)" }]}>
              <Info size={18} color="#60a5fa" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>About</Text>
              <Text style={styles.settingSubtext}>Version 1.0.0</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0a0f1a" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1e2d45",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1e2d45",
  },
  headerTitle: { color: "#ffffff", fontSize: 20, fontWeight: "800" },
  content: { padding: 20, gap: 4, paddingBottom: 40 },
  sectionTitle: { color: "#8a9ab0", fontSize: 12, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginTop: 20, marginBottom: 8, marginLeft: 4 },
  card: {
    backgroundColor: "#0f1624",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1e2d45",
    overflow: "hidden",
  },
  settingRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(34,255,136,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  settingInfo: { flex: 1 },
  settingLabel: { color: "#e2e8f0", fontSize: 14, fontWeight: "700" },
  settingSubtext: { color: "#4a5568", fontSize: 12, marginTop: 1 },
  divider: { height: 1, backgroundColor: "#1a2438", marginHorizontal: 14 },
  chevron: { color: "#3a4460", fontSize: 22 },
});