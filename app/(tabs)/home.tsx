import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
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
    title: "Galactic Front",
    platform: "PS5",
    platformColor: "#003087",
    image: "https://placehold.co/140x180/0a0f2e/6366f1?text=Galactic\nFront",
  },
  {
    id: "2",
    title: "FC Striker 24",
    platform: "XBOX",
    platformColor: "#107C10",
    image: "https://placehold.co/140x180/0a2010/22c55e?text=FC\nStriker+24",
  },
  {
    id: "3",
    title: "Speed Rush",
    platform: "PS5",
    platformColor: "#003087",
    image: "https://placehold.co/140x180/1a0a0a/ef4444?text=Speed\nRush",
  },
];

const ACCESSORIES = [
  {
    id: "1",
    title: "DualSense Contr...",
    price: "GHS 850",
    image: "https://placehold.co/160x120/111827/ffffff?text=DualSense",
  },
  {
    id: "2",
    title: "Pro Audio Headset",
    price: "GHS 450",
    image: "https://placehold.co/160x120/0a1a0a/22ff88?text=Headset",
  },
];

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "swap", label: "Swap", icon: "⇄" },
  { id: "shop", label: "Shop", icon: "🛍" },
  { id: "community", label: "Community", icon: "👥" },
  { id: "profile", label: "Profile", icon: "👤" },
];

const Home = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [popularGames, setPopularGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("home");
  const [showGameDetail, setShowGameDetail] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const [userProfile, games] = await Promise.all([
            getUserData(user.uid),
            getGames(10),
          ]);

          setUserData(userProfile);
          setPopularGames(games);
        } catch (error) {
          console.error("Error fetching home data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleGamePress = (game: any) => {
    setSelectedGame(game);
    setShowGameDetail(true);
  };

  const handleSwapRequest = () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to request swaps");
      return;
    }
    Alert.alert(
      "Swap Request",
      `Swap request sent for ${selectedGame?.title}!\n\nYou can now chat with the owner to discuss the swap.`,
    );
    setShowGameDetail(false);
  };

  const handleChatWithOwner = () => {
    Alert.alert("Chat", `Chat feature coming soon for ${selectedGame?.title}!`);
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
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(userData?.fullName || userData?.displayName || "Gamer")
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.greeting}>
                Hey {userData?.fullName || userData?.displayName || "Gamer"},
              </Text>
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
            onPress={() =>
              Alert.alert(
                "Notifications",
                "You have 3 new swap requests!\n\n- Kwame wants to swap FIFA 24\n- Ama requested Spider-Man 2\n- Yaw is interested in your PS5 games",
              )
            }
          >
            <Text style={styles.bellIcon}>🔔</Text>
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerBg}>
            {/* Grid lines decoration */}
            <View style={styles.bannerGridH} />
            <View style={styles.bannerGridV} />
            {/* Glow accents */}
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
                  onPress={() => console.log("Shop Now pressed")}
                >
                  <Text style={styles.bannerBtnPrimaryText}>SHOP NOW</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bannerBtnSecondary}
                  onPress={() => console.log("Learn More pressed")}
                >
                  <Text style={styles.bannerBtnSecondaryText}>LEARN MORE</Text>
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
            <TouchableOpacity
              onPress={() => console.log("See all games pressed")}
            >
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={popularGames.length > 0 ? popularGames : POPULAR_GAMES}
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
                <View style={styles.gameImageWrapper}>
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
                    <Text style={styles.gameImageEmoji}>🎮</Text>
                  </View>
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
            <TouchableOpacity
              onPress={() => console.log("See all accessories pressed")}
            >
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.accessoriesRow}>
            {ACCESSORIES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.accessoryCard}
                activeOpacity={0.85}
                onPress={() =>
                  Alert.alert(
                    "Accessory Details",
                    `${item.title}\n\nPrice: ${item.price}\nPlatform: ${item.platform}\n\nThis accessory is available for purchase or swap! Add it to your cart to get started.`,
                  )
                }
              >
                <View style={styles.accessoryImageWrapper}>
                  <Text style={styles.accessoryEmoji}>
                    {item.id === "1" ? "🎮" : "🎧"}
                  </Text>
                </View>
                <Text style={styles.accessoryTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.accessoryPrice}>{item.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a0f1a",
  },
  container: {
    flex: 1,
    backgroundColor: "#0a0f1a",
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
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
  avatarText: {
    color: "#22ff88",
    fontSize: 18,
    fontWeight: "800",
  },
  greeting: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  locationPin: {
    fontSize: 10,
  },
  locationText: {
    color: "#5a6a8a",
    fontSize: 12,
    fontWeight: "500",
  },
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
  bellIcon: {
    fontSize: 18,
  },
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

  // Banner
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
  bannerBg: {
    position: "absolute",
    inset: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
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
  bannerContent: {
    flexDirection: "row",
    padding: 18,
    alignItems: "center",
  },
  bannerLeft: {
    flex: 1,
  },
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
  levelUpText: {
    color: "#22ff88",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
  },
  bannerTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: "#8a9ab0",
    fontSize: 12,
    marginBottom: 12,
  },
  bannerBtns: {
    flexDirection: "row",
    gap: 8,
  },
  bannerBtnPrimary: {
    backgroundColor: "#22ff88",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  bannerBtnPrimaryText: {
    color: "#0a0f1a",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  bannerBtnSecondary: {
    backgroundColor: "transparent",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#2a3a50",
  },
  bannerBtnSecondaryText: {
    color: "#8a9ab0",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  bannerRight: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerHeadsetEmoji: {
    fontSize: 52,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  seeAll: {
    color: "#22ff88",
    fontSize: 13,
    fontWeight: "600",
  },

  // Subscription Card
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
  subTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subIcon: {
    fontSize: 18,
  },
  subTitle: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "700",
  },
  activeBadge: {
    backgroundColor: "#22ff88",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  activeBadgeText: {
    color: "#0a0f1a",
    fontSize: 12,
    fontWeight: "800",
  },
  subStats: {
    flexDirection: "row",
    gap: 32,
  },
  subStat: {
    gap: 2,
  },
  subStatNumber: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 32,
  },
  subStatLabel: {
    color: "#5a6a8a",
    fontSize: 12,
    fontWeight: "500",
  },

  // Games
  gamesRow: {
    paddingHorizontal: 20,
    gap: 12,
  },
  gameCard: {
    width: 140,
  },
  gameImageWrapper: {
    width: 140,
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
    backgroundColor: "#111827",
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
  platformText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  gameImagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gameImageEmoji: {
    fontSize: 48,
  },
  gameTitle: {
    color: "#c8d0e0",
    fontSize: 13,
    fontWeight: "600",
  },

  // Accessories
  accessoriesRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
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
  accessoryEmoji: {
    fontSize: 48,
  },
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0f1a",
  },
});

export default Home;
