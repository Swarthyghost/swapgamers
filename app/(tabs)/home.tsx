import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { getUserData } from "../../lib/auth";
import { getGames } from "../../lib/game-swaps";

const POPULAR_GAMES = [
  {
    id: "1",
    title: "God of War Ragnarök",
    platform: "PS5",
    platformColor: "#003087",
    emoji: "⚔️",
    bgColor: "#0a1628",
    status: "available",
    owner: "Kwame",
  },
  {
    id: "2",
    title: "FC Striker 24",
    platform: "XBOX",
    platformColor: "#107C10",
    emoji: "⚽",
    bgColor: "#0a2010",
    status: "available",
    owner: "Ama",
  },
  {
    id: "3",
    title: "Spider-Man 2",
    platform: "PS5",
    platformColor: "#003087",
    emoji: "🕷️",
    bgColor: "#1a0a1a",
    status: "waitlist",
    waitlistCount: 2,
    owner: "Yaw",
  },
];

const ACCESSORIES = [
  {
    id: "1",
    title: "DualSense Controller",
    price: "GHS 850",
    platform: "PS5",
    emoji: "🎮",
  },
  {
    id: "2",
    title: "Pro Audio Headset",
    price: "GHS 450",
    platform: "Any",
    emoji: "🎧",
  },
];

const Home = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [popularGames, setPopularGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const [userProfile, games] = await Promise.all([
            getUserData(user.uid),
            getGames(10),
          ]);
          setUserData(userProfile);
          setPopularGames(games.length > 0 ? games : POPULAR_GAMES);
        } catch (error) {
          console.error("Error fetching home data:", error);
          setPopularGames(POPULAR_GAMES);
        } finally {
          setLoading(false);
        }
      } else {
        setPopularGames(POPULAR_GAMES);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleGamePress = (game: any) => {
    router.push({
      pathname: "/game-detail",
      params: {
        id: game.id,
        title: game.title,
        platform: game.platform,
        platformColor: game.platformColor || "#003087",
        emoji: game.emoji || "🎮",
        bgColor: game.bgColor || "#111827",
        status: game.status || "available",
        waitlistCount: game.waitlistCount || 0,
        owner: game.owner || "Unknown",
      },
    });
  };

  const handleAccessoryPress = (item: any) => {
    router.push({
      pathname: "/(tabs)/shop",
    });
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

  const displayName = userData?.fullName || userData?.displayName || "Gamer";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1a" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/profile")}
              activeOpacity={0.8}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>Hey {displayName},</Text>
              <View style={styles.locationRow}>
                <Text style={styles.locationPin}>📍</Text>
                <Text style={styles.locationText}>
                  {userData?.location || "Ghana"}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => router.push("/notifications")}
            activeOpacity={0.8}
          >
            <Text style={styles.bellIcon}>🔔</Text>
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerBg}>
            <View style={styles.bannerGridH} />
            <View style={styles.bannerGridV} />
            <View style={styles.bannerGlowLeft} />
            <View style={styles.bannerGlowRight} />
          </View>
          <View style={styles.bannerContent}>
            <View style={styles.bannerLeft}>
              <View style={styles.levelUpBadge}>
                <Text style={styles.levelUpText}>LEVEL UP YOUR GAME</Text>
              </View>
              <Text style={styles.bannerTitle}>Swap 3 Games!</Text>
              <Text style={styles.bannerSubtitle}>
                Get 1 month free on Pro Plan
              </Text>
              <View style={styles.bannerBtns}>
                <TouchableOpacity
                  style={styles.bannerBtnPrimary}
                  onPress={() => router.push("/(tabs)/shop")}
                >
                  <Text style={styles.bannerBtnPrimaryText}>SHOP NOW</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bannerBtnSecondary}
                  onPress={() => router.push("/(tabs)/swap")}
                >
                  <Text style={styles.bannerBtnSecondaryText}>SWAP NOW</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.bannerRight}>
              <Text style={styles.bannerHeadsetEmoji}>🎧</Text>
            </View>
          </View>
        </View>

        {/* My Subscription */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Subscription</Text>
          <View style={styles.subscriptionCard}>
            <View style={styles.subCardHeader}>
              <View style={styles.subTitleRow}>
                <Text style={styles.subIcon}>🎮</Text>
                <Text style={styles.subTitle}>Monthly Pro</Text>
              </View>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            </View>
            <View style={styles.subStats}>
              <View style={styles.subStat}>
                <Text style={styles.subStatNumber}>18</Text>
                <Text style={styles.subStatLabel}>Days Left</Text>
              </View>
              <View style={styles.subStat}>
                <Text style={styles.subStatNumber}>2</Text>
                <Text style={styles.subStatLabel}>Swaps Left</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Popular Games */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Games</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/swap")}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={popularGames}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.gamesRow}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.gameCard}
                activeOpacity={0.85}
                onPress={() => handleGamePress(item)}
              >
                <View style={[styles.gameImageWrapper, { backgroundColor: item.bgColor || "#111827" }]}>
                  <View
                    style={[
                      styles.platformBadge,
                      { backgroundColor: item.platformColor || "#003087" },
                    ]}
                  >
                    <Text style={styles.platformText}>
                      {item.platform || "PS5"}
                    </Text>
                  </View>
                  <View style={styles.gameImagePlaceholder}>
                    <Text style={styles.gameImageEmoji}>{item.emoji || "🎮"}</Text>
                  </View>
                  {item.status === "available" ? (
                    <View style={styles.availableDot} />
                  ) : (
                    <View style={styles.waitlistDot} />
                  )}
                </View>
                <Text style={styles.gameTitle} numberOfLines={1}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Shop Accessories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop Accessories</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/shop")}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.accessoriesRow}>
            {ACCESSORIES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.accessoryCard}
                activeOpacity={0.85}
                onPress={() => handleAccessoryPress(item)}
              >
                <View style={styles.accessoryImageWrapper}>
                  <Text style={styles.accessoryEmoji}>{item.emoji}</Text>
                </View>
                <Text style={styles.accessoryTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.accessoryPrice}>{item.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => router.push("/(tabs)/swap")}
              activeOpacity={0.8}
            >
              <Text style={styles.quickActionIcon}>🔄</Text>
              <Text style={styles.quickActionText}>Swap Game</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => router.push("/(tabs)/community")}
              activeOpacity={0.8}
            >
              <Text style={styles.quickActionIcon}>👥</Text>
              <Text style={styles.quickActionText}>Community</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => router.push("/(tabs)/assist")}
              activeOpacity={0.8}
            >
              <Text style={styles.quickActionIcon}>🤖</Text>
              <Text style={styles.quickActionText}>AI Assist</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0a0f1a" },
  scrollContent: { paddingBottom: 120 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0f1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1e3a5f",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#22ff88",
  },
  avatarText: { color: "#22ff88", fontSize: 18, fontWeight: "800" },
  greeting: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  locationPin: { fontSize: 10 },
  locationText: { color: "#5a6a8a", fontSize: 12, fontWeight: "500" },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1e2d45",
  },
  bellIcon: { fontSize: 18 },
  bellDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
    borderWidth: 1.5,
    borderColor: "#111827",
  },
  banner: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#060d1a",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#1e3a2a",
    minHeight: 130,
  },
  bannerBg: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  bannerGridH: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(34,255,136,0.08)",
  },
  bannerGridV: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(34,255,136,0.08)",
  },
  bannerGlowLeft: {
    position: "absolute",
    top: -20,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(34,255,136,0.07)",
  },
  bannerGlowRight: {
    position: "absolute",
    bottom: -20,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(34,255,136,0.05)",
  },
  bannerContent: { flexDirection: "row", padding: 18, alignItems: "center" },
  bannerLeft: { flex: 1 },
  levelUpBadge: {
    backgroundColor: "rgba(34,255,136,0.12)",
    alignSelf: "flex-start",
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(34,255,136,0.2)",
  },
  levelUpText: { color: "#22ff88", fontSize: 8, fontWeight: "800", letterSpacing: 1 },
  bannerTitle: { color: "#ffffff", fontSize: 22, fontWeight: "900", letterSpacing: -0.5, marginBottom: 4 },
  bannerSubtitle: { color: "#8a9ab0", fontSize: 12, marginBottom: 12 },
  bannerBtns: { flexDirection: "row", gap: 8 },
  bannerBtnPrimary: {
    backgroundColor: "#22ff88",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  bannerBtnPrimaryText: { color: "#0a0f1a", fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  bannerBtnSecondary: {
    backgroundColor: "transparent",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#2a3a50",
  },
  bannerBtnSecondaryText: { color: "#8a9ab0", fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  bannerRight: { width: 70, alignItems: "center", justifyContent: "center" },
  bannerHeadsetEmoji: { fontSize: 52 },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: { color: "#ffffff", fontSize: 18, fontWeight: "800", paddingHorizontal: 20, marginBottom: 14 },
  seeAll: { color: "#22ff88", fontSize: 13, fontWeight: "600" },
  subscriptionCard: {
    marginHorizontal: 20,
    backgroundColor: "#0f1624",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1e2d45",
  },
  subCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  subTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  subIcon: { fontSize: 18 },
  subTitle: { color: "#e2e8f0", fontSize: 16, fontWeight: "700" },
  activeBadge: {
    backgroundColor: "#22ff88",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  activeBadgeText: { color: "#0a0f1a", fontSize: 12, fontWeight: "800" },
  subStats: { flexDirection: "row", gap: 32 },
  subStat: { gap: 2 },
  subStatNumber: { color: "#ffffff", fontSize: 28, fontWeight: "800", lineHeight: 32 },
  subStatLabel: { color: "#5a6a8a", fontSize: 12, fontWeight: "500" },
  gamesRow: { paddingHorizontal: 20, gap: 12 },
  gameCard: { width: 140 },
  gameImageWrapper: {
    width: 140,
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  platformBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 2,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  platformText: { color: "#ffffff", fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  gameImagePlaceholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  gameImageEmoji: { fontSize: 48 },
  availableDot: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22ff88",
    borderWidth: 1.5,
    borderColor: "#0a0f1a",
  },
  waitlistDot: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#f59e0b",
    borderWidth: 1.5,
    borderColor: "#0a0f1a",
  },
  gameTitle: { color: "#c8d0e0", fontSize: 13, fontWeight: "600" },
  accessoriesRow: { flexDirection: "row", paddingHorizontal: 20, gap: 12 },
  accessoryCard: {
    flex: 1,
    backgroundColor: "#0f1624",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1e2d45",
  },
  accessoryImageWrapper: {
    height: 110,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  accessoryEmoji: { fontSize: 48 },
  accessoryTitle: {
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 4,
  },
  accessoryPrice: {
    color: "#22ff88",
    fontSize: 14,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingBottom: 12,
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: "#0f1624",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#1e2d45",
  },
  quickActionIcon: { fontSize: 24 },
  quickActionText: { color: "#8a9ab0", fontSize: 12, fontWeight: "600" },
});

export default Home;