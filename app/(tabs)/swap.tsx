import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { getUserGames } from "../../lib/game-swaps";

const FILTERS = ["All Games", "PlayStation", "Xbox", "Switch", "PC"];

const GAMES = [
  {
    id: "1",
    title: "God of War Ragnarök",
    platform: "PS5",
    platformColor: "#003087",
    status: "available",
    emoji: "⚔️",
    bgColor: "#0a1628",
    owner: "Kwame",
  },
  {
    id: "2",
    title: "Forza Horizon 5",
    platform: "XBOX",
    platformColor: "#107C10",
    status: "available",
    emoji: "🚗",
    bgColor: "#0d1a10",
    owner: "Ama",
  },
  {
    id: "3",
    title: "The Last of Us Part II",
    platform: "PS5",
    platformColor: "#003087",
    status: "waitlist",
    waitlistCount: 2,
    emoji: "🎸",
    bgColor: "#1a1008",
    owner: "Yaw",
  },
  {
    id: "4",
    title: "Starfield",
    platform: "XBOX",
    platformColor: "#107C10",
    status: "available",
    emoji: "🌌",
    bgColor: "#080d1a",
    owner: "Kofi",
  },
];

const Swap = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All Games");
  const [search, setSearch] = useState("");
  const [myGames, setMyGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, [user]);

  const fetchGames = async () => {
    try {
      if (user) {
        const userGames = await getUserGames(user.uid);
        setMyGames(userGames || []);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredGames = () => {
    let filtered = GAMES;
    if (search.trim()) {
      filtered = filtered.filter((g) =>
        g.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (activeFilter !== "All Games") {
      const platformMap: { [key: string]: string } = {
        PlayStation: "PS5",
        Xbox: "XBOX",
        Switch: "Switch",
        PC: "PC",
      };
      const platform = platformMap[activeFilter];
      if (platform) {
        filtered = filtered.filter((g) => g.platform === platform);
      }
    }
    return filtered;
  };

  const handleGamePress = (game: any) => {
    router.push({
      pathname: "/game-detail",
      params: {
        id: game.id,
        title: game.title,
        platform: game.platform,
        platformColor: game.platformColor,
        emoji: game.emoji,
        bgColor: game.bgColor,
        status: game.status,
        waitlistCount: game.waitlistCount || 0,
        owner: game.owner,
      },
    });
  };

  const handleJoinWaitlist = (gameTitle: string) => {
    if (!user) {
      Alert.alert("Login Required", "Please login to join waitlist");
      return;
    }
    Alert.alert(
      "Waitlist Joined! ✅",
      `You're on the waitlist for "${gameTitle}". We'll notify you when it becomes available!`
    );
  };

  const filteredGames = getFilteredGames();
  const gameRows: (typeof GAMES)[] = [];
  for (let i = 0; i < filteredGames.length; i += 2) {
    gameRows.push(filteredGames.slice(i, i + 2));
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
          <Text style={styles.headerTitle}>Swap Center</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              if (!user) {
                Alert.alert("Login Required", "Please login to add games");
                return;
              }
              router.push("/add-game");
            }}
          >
            <Text style={styles.addBtnIcon}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Find games to swap..."
            placeholderTextColor="#3a4460"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text style={{ color: "#8a9ab0", fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text
                style={[styles.filterPillText, activeFilter === f && styles.filterPillTextActive]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* My Current Disc */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Current Disc</Text>
          <View style={styles.currentDiscCard}>
            <View style={styles.discCoverBox}>
              <Text style={styles.discCoverEmoji}>🤖</Text>
            </View>
            <View style={styles.discInfo}>
              <Text style={styles.discTitle}>Cyberpunk 2077</Text>
              <View style={styles.discPlatformBadge}>
                <Text style={styles.discPlatformText}>PS5</Text>
              </View>
              <Text style={styles.discDue}>Due in 12 days</Text>
            </View>
            <TouchableOpacity
              style={styles.swapAgainBtn}
              onPress={() => router.push("/add-game")}
            >
              <Text style={styles.swapAgainIcon}>↻</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* My Games */}
        {myGames.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Games ({myGames.length})</Text>
            <FlatList
              data={myGames}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
              renderItem={({ item }) => (
                <View style={styles.myGamePill}>
                  <Text style={styles.myGamePillText}>{item.title}</Text>
                  <Text style={styles.myGamePillPlatform}>{item.platform}</Text>
                </View>
              )}
            />
          </View>
        )}

        {/* Available to Swap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Available to Swap ({filteredGames.length})
          </Text>
          {filteredGames.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🎮</Text>
              <Text style={styles.emptyText}>No games found</Text>
              <Text style={styles.emptySubtext}>Try a different filter or search</Text>
            </View>
          ) : (
            gameRows.map((row, rowIdx) => (
              <View key={rowIdx} style={styles.gameRow}>
                {row.map((game) => (
                  <TouchableOpacity
                    key={game.id}
                    style={styles.gameCard}
                    activeOpacity={0.9}
                    onPress={() => handleGamePress(game)}
                  >
                    {/* Cover Art */}
                    <View style={[styles.gameCover, { backgroundColor: game.bgColor }]}>
                      <Text style={styles.gameCoverEmoji}>{game.emoji}</Text>
                      <View style={[styles.gamePlatformBadge, { backgroundColor: game.platformColor }]}>
                        <Text style={styles.gamePlatformText}>{game.platform}</Text>
                      </View>
                    </View>

                    {/* Info */}
                    <View style={styles.gameInfo}>
                      <Text style={styles.gameTitle} numberOfLines={1}>
                        {game.title}
                      </Text>
                      {game.status === "available" ? (
                        <Text style={styles.statusAvailable}>● Available</Text>
                      ) : (
                        <Text style={styles.statusWaitlist}>
                          ● Waitlist ({game.waitlistCount})
                        </Text>
                      )}
                    </View>

                    {/* CTA Button */}
                    {game.status === "available" ? (
                      <TouchableOpacity
                        style={styles.requestBtn}
                        activeOpacity={0.85}
                        onPress={() => handleGamePress(game)}
                      >
                        <Text style={styles.requestBtnText}>Request Swap</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.waitlistBtn}
                        activeOpacity={0.85}
                        onPress={() => handleJoinWaitlist(game.title)}
                      >
                        <Text style={styles.waitlistBtnText}>Join Waitlist</Text>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                ))}
                {row.length === 1 && <View style={styles.gameCardPlaceholder} />}
              </View>
            ))
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0a0f1a" },
  scrollContent: { paddingBottom: 120 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
  headerTitle: { color: "#ffffff", fontSize: 26, fontWeight: "900", letterSpacing: -0.5 },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnIcon: { color: "#ffffff", fontSize: 22, fontWeight: "700" },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1e2d45",
  },
  searchIcon: { fontSize: 15, opacity: 0.5 },
  searchInput: { flex: 1, color: "#e2e8f0", fontSize: 15, padding: 0 },
  filterRow: { paddingHorizontal: 20, gap: 10, paddingBottom: 4, marginBottom: 8 },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1e2d45",
  },
  filterPillActive: { backgroundColor: "#22ff88", borderColor: "#22ff88" },
  filterPillText: { color: "#8a9ab0", fontSize: 14, fontWeight: "600" },
  filterPillTextActive: { color: "#0a0f1a", fontWeight: "800" },
  section: { marginBottom: 24 },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    paddingHorizontal: 20,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  currentDiscCard: {
    marginHorizontal: 20,
    backgroundColor: "#0f1624",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#22ff88",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  discCoverBox: {
    width: 64,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#1a0a28",
    alignItems: "center",
    justifyContent: "center",
  },
  discCoverEmoji: { fontSize: 32 },
  discInfo: { flex: 1, gap: 5 },
  discTitle: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  discPlatformBadge: {
    backgroundColor: "#003087",
    alignSelf: "flex-start",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discPlatformText: { color: "#ffffff", fontSize: 10, fontWeight: "800" },
  discDue: { color: "#5a6a8a", fontSize: 13, fontWeight: "500" },
  swapAgainBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#1e3a6e",
    alignItems: "center",
    justifyContent: "center",
  },
  swapAgainIcon: { color: "#60a5fa", fontSize: 20, fontWeight: "700" },
  myGamePill: {
    backgroundColor: "#0f1624",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#1e2d45",
    minWidth: 120,
  },
  myGamePillText: { color: "#ffffff", fontSize: 13, fontWeight: "700" },
  myGamePillPlatform: { color: "#8a9ab0", fontSize: 11, marginTop: 2 },
  gameRow: { flexDirection: "row", paddingHorizontal: 20, gap: 12, marginBottom: 12 },
  gameCard: {
    flex: 1,
    backgroundColor: "#0f1624",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1e2d45",
  },
  gameCardPlaceholder: { flex: 1 },
  gameCover: { height: 170, alignItems: "center", justifyContent: "center", position: "relative" },
  gameCoverEmoji: { fontSize: 64 },
  gamePlatformBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  gamePlatformText: { color: "#ffffff", fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  gameInfo: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 6, gap: 3 },
  gameTitle: { color: "#e2e8f0", fontSize: 14, fontWeight: "700" },
  statusAvailable: { color: "#22ff88", fontSize: 11, fontWeight: "600" },
  statusWaitlist: { color: "#f59e0b", fontSize: 11, fontWeight: "600" },
  requestBtn: {
    backgroundColor: "#22ff88",
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: "center",
  },
  requestBtnText: { color: "#0a0f1a", fontSize: 13, fontWeight: "800" },
  waitlistBtn: {
    backgroundColor: "#2563eb",
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: "center",
  },
  waitlistBtnText: { color: "#ffffff", fontSize: 13, fontWeight: "800" },
  emptyState: { alignItems: "center", paddingVertical: 40, gap: 8 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  emptySubtext: { color: "#8a9ab0", fontSize: 13 },
});

export default Swap;