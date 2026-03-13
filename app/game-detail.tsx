import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, RefreshCw, Star, Users } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function GameDetail() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [joinedWaitlist, setJoinedWaitlist] = useState(false);

  const game = {
    id: params.id as string,
    title: params.title as string || "Unknown Game",
    platform: params.platform as string || "PS5",
    platformColor: params.platformColor as string || "#003087",
    emoji: params.emoji as string || "🎮",
    bgColor: params.bgColor as string || "#111827",
    status: params.status as string || "available",
    waitlistCount: params.waitlistCount ? Number(params.waitlistCount) : 0,
    owner: params.owner as string || "Unknown",
  };

  const handleRequestSwap = () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to request swaps");
      return;
    }
    router.push({
      pathname: "/swap-request",
      params: {
        gameId: game.id,
        gameTitle: game.title,
        gamePlatform: game.platform,
        gameOwner: game.owner,
      },
    });
  };

  const handleJoinWaitlist = () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to join the waitlist");
      return;
    }
    setJoinedWaitlist(true);
    Alert.alert("Joined Waitlist! ✅", `You'll be notified when "${game.title}" becomes available.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1a" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Game Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.gameCover, { backgroundColor: game.bgColor }]}>
          <Text style={styles.gameCoverEmoji}>{game.emoji}</Text>
          <View style={[styles.platformBadge, { backgroundColor: game.platformColor }]}>
            <Text style={styles.platformText}>{game.platform}</Text>
          </View>
          <View style={[styles.statusBadge, game.status === "available" ? styles.statusAvailable : styles.statusWaitlist]}>
            <Text style={styles.statusText}>
              {game.status === "available" ? "● Available" : `● Waitlist (${game.waitlistCount})`}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.gameTitle}>{game.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Star size={14} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.metaText}>4.5 Rating</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <Users size={14} color="#8a9ab0" />
              <Text style={styles.metaText}>12 swaps</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <RefreshCw size={14} color="#8a9ab0" />
              <Text style={styles.metaText}>{game.platform}</Text>
            </View>
          </View>
        </View>

        <View style={styles.ownerCard}>
          <View style={styles.ownerAvatar}>
            <Text style={styles.ownerAvatarText}>{game.owner?.charAt(0)?.toUpperCase() || "G"}</Text>
          </View>
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerName}>{game.owner}</Text>
            <Text style={styles.ownerBadge}>⭐ 4.8 · 14 swaps completed</Text>
          </View>
          <TouchableOpacity style={styles.chatBtn} onPress={() => Alert.alert("Chat", `Chat with ${game.owner} coming soon!`)}>
            <Text style={styles.chatBtnText}>Chat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Game Details</Text>
          {[
            ["Platform", game.platform],
            ["Condition", "Like New"],
            ["Location", "Accra, Ghana"],
            ["Swap Duration", "14 days"],
          ].map(([label, value], i) => (
            <View key={label}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={styles.detailValue}>{value}</Text>
              </View>
              {i < 3 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>📋 Swap Rules</Text>
          <Text style={styles.rulesText}>
            • Agree on a meetup location in Accra{"\n"}
            • Game must be returned in same condition{"\n"}
            • Payment via MTN MoMo or Telecel Cash{"\n"}
            • Contact support if any issues arise
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        {game.status === "available" ? (
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={handleRequestSwap}>
            <RefreshCw size={18} color="#0a0f1a" />
            <Text style={styles.primaryBtnText}>Request Swap</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.waitlistBtn, joinedWaitlist && styles.waitlistBtnDone]}
            activeOpacity={0.85}
            onPress={joinedWaitlist ? undefined : handleJoinWaitlist}
          >
            <Text style={styles.waitlistBtnText}>{joinedWaitlist ? "On Waitlist ✓" : "Join Waitlist"}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0a0f1a" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#1e2d45" },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#111827", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#1e2d45" },
  headerTitle: { color: "#ffffff", fontSize: 18, fontWeight: "800", flex: 1, textAlign: "center", marginHorizontal: 8 },
  content: { paddingBottom: 20 },
  gameCover: { height: 280, alignItems: "center", justifyContent: "center", position: "relative" },
  gameCoverEmoji: { fontSize: 110 },
  platformBadge: { position: "absolute", top: 16, left: 16, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  platformText: { color: "#ffffff", fontSize: 11, fontWeight: "800" },
  statusBadge: { position: "absolute", top: 16, right: 16, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  statusAvailable: { backgroundColor: "rgba(34,255,136,0.15)", borderWidth: 1, borderColor: "rgba(34,255,136,0.3)" },
  statusWaitlist: { backgroundColor: "rgba(245,158,11,0.15)", borderWidth: 1, borderColor: "rgba(245,158,11,0.3)" },
  statusText: { fontSize: 12, fontWeight: "700", color: "#ffffff" },
  infoSection: { padding: 20, gap: 10 },
  gameTitle: { color: "#ffffff", fontSize: 28, fontWeight: "900", letterSpacing: -0.5 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { color: "#8a9ab0", fontSize: 13, fontWeight: "500" },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: "#1e2d45" },
  ownerCard: { flexDirection: "row", alignItems: "center", marginHorizontal: 20, backgroundColor: "#0f1624", borderRadius: 14, padding: 14, gap: 12, borderWidth: 1, borderColor: "#1e2d45", marginBottom: 12 },
  ownerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#1e3a5f", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#22ff88" },
  ownerAvatarText: { color: "#22ff88", fontSize: 18, fontWeight: "800" },
  ownerInfo: { flex: 1 },
  ownerName: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
  ownerBadge: { color: "#8a9ab0", fontSize: 12 },
  chatBtn: { backgroundColor: "#2563eb", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  chatBtnText: { color: "#ffffff", fontSize: 13, fontWeight: "700" },
  detailsCard: { marginHorizontal: 20, backgroundColor: "#0f1624", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#1e2d45", marginBottom: 12 },
  detailsTitle: { color: "#ffffff", fontSize: 16, fontWeight: "800", marginBottom: 12 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
  detailLabel: { color: "#8a9ab0", fontSize: 14 },
  detailValue: { color: "#ffffff", fontSize: 14, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#1e2d45" },
  rulesCard: { marginHorizontal: 20, backgroundColor: "rgba(37,99,235,0.08)", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "rgba(37,99,235,0.2)", gap: 10 },
  rulesTitle: { color: "#ffffff", fontSize: 15, fontWeight: "800" },
  rulesText: { color: "#8a9ab0", fontSize: 13, lineHeight: 22 },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: "#0a0f1a", borderTopWidth: 1, borderTopColor: "#1e2d45" },
  primaryBtn: { backgroundColor: "#22ff88", borderRadius: 14, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  primaryBtnText: { color: "#0a0f1a", fontSize: 16, fontWeight: "800" },
  waitlistBtn: { backgroundColor: "#2563eb", borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  waitlistBtnDone: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: "#2563eb" },
  waitlistBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "800" },
});