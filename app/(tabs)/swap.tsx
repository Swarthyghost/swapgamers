import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
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
import {
  createGame,
  createSwapRequest,
  getUserGames
} from "../../lib/game-swaps";

const FILTERS = ["All Games", "PlayStation", "Xbox", "Switch", "PC"];

const GAMES = [
  {
    id: "1",
    title: "God of War Ragna...",
    platform: "PS5",
    platformColor: "#003087",
    status: "available",
    emoji: "⚔️",
    bgColor: "#0a1628",
  },
  {
    id: "2",
    title: "Forza Horizon 5",
    platform: "XBOX",
    platformColor: "#107C10",
    status: "available",
    emoji: "🚗",
    bgColor: "#0d1a10",
  },
  {
    id: "3",
    title: "The Last of Us Par...",
    platform: "PS5",
    platformColor: "#003087",
    status: "waitlist",
    waitlistCount: 2,
    emoji: "🎸",
    bgColor: "#1a1008",
  },
  {
    id: "4",
    title: "Starfield",
    platform: "XBOX",
    platformColor: "#107C10",
    status: "available",
    emoji: "🌌",
    bgColor: "#080d1a",
  },
];

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "swap", label: "Swap", icon: "◎" },
  { id: "shop", label: "Shop", icon: "🛒" },
  { id: "community", label: "Community", icon: "👥" },
  { id: "profile", label: "Profile", icon: "👤" },
];

const Swap = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All Games");
  const [search, setSearch] = useState("");
  const [showAddGame, setShowAddGame] = useState(false);
  const [myGames, setMyGames] = useState<any[]>([]);
  const [availableGames, setAvailableGames] = useState<any[]>([]);
  const [showSwapRequest, setShowSwapRequest] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [selectedMyGame, setSelectedMyGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newGameTitle, setNewGameTitle] = useState("");
  const [newGamePlatform, setNewGamePlatform] = useState("");
  const [newGameDescription, setNewGameDescription] = useState("");

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      if (user) {
        const userGames = await getUserGames(user.uid);
        setMyGames(userGames || []);
      }
      // For now, use mock data for available games with owner info
      const mockAvailableGames = GAMES.map((game) => ({
        ...game,
        owner: {
          uid: game.id === "1" ? "user1" : game.id === "2" ? "user2" : "user3",
          displayName:
            game.id === "1" ? "Kwame" : game.id === "2" ? "Ama" : "Yaw",
          avatar: "👤",
        },
      }));
      setAvailableGames(mockAvailableGames);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwap = (game: any) => {
    if (!user) {
      Alert.alert("Login Required", "Please login to request swaps");
      return;
    }
    if (myGames.length === 0) {
      Alert.alert("No Games", "Please add your games first to request swaps");
      return;
    }
    setSelectedGame(game);
    setShowSwapRequest(true);
  };

  const handleSwapRequestSubmit = async () => {
    if (!selectedGame || !selectedMyGame) {
      Alert.alert("Error", "Please select a game to offer");
      return;
    }

    try {
      await createSwapRequest({
        requesterId: user!.uid,
        requestedGameId: selectedGame.id,
        offeredGameId: selectedMyGame.id,
        status: "pending",
      });

      Alert.alert(
        "Success!",
        `Swap request sent for ${selectedGame.title}!\n\nYou can now chat with ${selectedGame.owner.displayName} to discuss the swap.`,
      );
      setShowSwapRequest(false);
      setSelectedGame(null);
      setSelectedMyGame(null);
    } catch (error) {
      console.error("Error creating swap request:", error);
      Alert.alert("Error", "Failed to send swap request");
    }
  };

  const handleJoinWaitlist = (gameTitle: string) => {
    if (!user) {
      Alert.alert("Login Required", "Please login to join waitlist");
      return;
    }
    Alert.alert(
      "Waitlist",
      `Joined waitlist for: ${gameTitle}\nWe'll notify you when it's available!`,
    );
  };

  const handleSwapAgain = () => {
    Alert.alert("Swap Again", "This feature is coming soon!");
  };

  const handleAddGame = () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to add games");
      return;
    }
    setShowAddGame(true);
  };

  const handleNotifications = () => {
    Alert.alert(
      "Notifications",
      "You have 3 new swap requests!\n\n- Kwame wants to swap FIFA 24\n- Ama requested Spider-Man 2\n- Yaw is interested in your PS5 games",
    );
  };

  const handleSettings = () => {
    Alert.alert(
      "Settings",
      "Settings panel coming soon!\n\nYou'll be able to:\n- Manage swap preferences\n- Set notification preferences\n- View swap history\n- Account settings",
    );
  };

  const handleAddGameSubmit = async () => {
    if (!newGameTitle.trim() || !newGamePlatform) {
      Alert.alert("Error", "Please fill in game title and platform");
      return;
    }

    try {
      await createGame({
        title: newGameTitle.trim(),
        platform: newGamePlatform.toLowerCase(),
        description: newGameDescription.trim(),
        owner: user!.uid,
        available: true,
        condition: "good",
        genre: [],
        releaseYear: new Date().getFullYear(),
        rating: 0,
        imageUrl: null,
      });

      setNewGameTitle("");
      setNewGamePlatform("");
      setNewGameDescription("");
      setShowAddGame(false);
      fetchGames(); // Refresh games
      Alert.alert("Success", "Your game is now available for swapping!");
    } catch (error) {
      console.error("Error adding game:", error);
      Alert.alert("Error", "Failed to add game");
    }
  };

  const gameRows = [];
  for (let i = 0; i < availableGames.length; i += 2) {
    gameRows.push(availableGames.slice(i, i + 2));
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
            style={styles.filterBtn}
            onPress={() => setShowAddGame(true)}
          >
            <Text style={styles.filterBtnIcon}>+</Text>
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
              style={[
                styles.filterPill,
                activeFilter === f && styles.filterPillActive,
              ]}
              onPress={() => setActiveFilter(f)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeFilter === f && styles.filterPillTextActive,
                ]}
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
              onPress={handleSwapAgain}
            >
              <Text style={styles.swapAgainIcon}>↻</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Available to Swap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available to Swap</Text>
          {gameRows.map((row, rowIdx) => (
            <View key={rowIdx} style={styles.gameRow}>
              {row.map((game) => (
                <View key={game.id} style={styles.gameCard}>
                  {/* Cover Art */}
                  <View
                    style={[
                      styles.gameCover,
                      { backgroundColor: game.bgColor },
                    ]}
                  >
                    <Text style={styles.gameCoverEmoji}>{game.emoji}</Text>
                    <View
                      style={[
                        styles.gamePlatformBadge,
                        { backgroundColor: game.platformColor },
                      ]}
                    >
                      <Text style={styles.gamePlatformText}>
                        {game.platform}
                      </Text>
                    </View>
                  </View>

                  {/* Info */}
                  <View style={styles.gameInfo}>
                    <Text style={styles.gameTitle} numberOfLines={1}>
                      {game.title}
                    </Text>
                    {game.status === "available" ? (
                      <Text style={styles.statusAvailable}>Available</Text>
                    ) : (
                      <Text style={styles.statusWaitlist}>
                        Waitlist ({game.waitlistCount})
                      </Text>
                    )}
                  </View>

                  {/* CTA Button */}
                  {game.status === "available" ? (
                    <TouchableOpacity
                      style={styles.requestBtn}
                      activeOpacity={0.85}
                      onPress={() => handleRequestSwap(game)}
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
                </View>
              ))}
              {/* Fill empty slot if odd */}
              {row.length === 1 && <View style={styles.gameCardPlaceholder} />}
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Swap Request Modal */}
      <Modal
        visible={showSwapRequest}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSwapRequest(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSwapRequest(false)}>
              <Text style={styles.modalCancelBtn}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Request Swap</Text>
            <TouchableOpacity onPress={handleSwapRequestSubmit}>
              <Text style={styles.modalSendBtn}>Send</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {selectedGame && (
              <View style={styles.selectedGameCard}>
                <Text style={styles.selectedGameTitle}>
                  {selectedGame.title}
                </Text>
                <Text style={styles.selectedGameOwner}>
                  Owner: {selectedGame.owner.displayName}
                </Text>
                <Text style={styles.selectedGamePlatform}>
                  {selectedGame.platform}
                </Text>
              </View>
            )}

            <Text style={styles.offerTitle}>Select your game to offer:</Text>
            <FlatList
              data={myGames}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.myGameCard,
                    selectedMyGame?.id === item.id && styles.myGameCardSelected,
                  ]}
                  onPress={() => setSelectedMyGame(item)}
                >
                  <Text style={styles.myGameTitle}>{item.title}</Text>
                  <Text style={styles.myGamePlatform}>{item.platform}</Text>
                </TouchableOpacity>
              )}
              style={styles.myGamesList}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Add Game Modal */}
      <Modal
        visible={showAddGame}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddGame(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddGame(false)}>
              <Text style={styles.modalCancelBtn}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Game</Text>
            <TouchableOpacity onPress={handleAddGameSubmit}>
              <Text style={styles.modalSendBtn}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Game Title</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter game title"
                placeholderTextColor="#64748b"
                value={newGameTitle}
                onChangeText={setNewGameTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Platform</Text>
              <View style={styles.platformOptions}>
                {["PS5", "Xbox", "Switch", "PC"].map((platform) => (
                  <TouchableOpacity
                    key={platform}
                    style={[
                      styles.platformOption,
                      newGamePlatform === platform &&
                        styles.platformOptionSelected,
                    ]}
                    onPress={() => setNewGamePlatform(platform)}
                  >
                    <Text
                      style={[
                        styles.platformOptionText,
                        newGamePlatform === platform &&
                          styles.platformOptionTextSelected,
                      ]}
                    >
                      {platform}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                placeholder="Describe your game condition, etc."
                placeholderTextColor="#64748b"
                multiline
                numberOfLines={4}
                value={newGameDescription}
                onChangeText={setNewGameDescription}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
    paddingBottom: 18,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  filterBtnIcon: {
    color: "#ffffff",
    fontSize: 18,
  },

  // Search
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
  searchIcon: {
    fontSize: 15,
    opacity: 0.5,
  },
  searchInput: {
    flex: 1,
    color: "#e2e8f0",
    fontSize: 15,
    padding: 0,
  },

  // Filter Pills
  filterRow: {
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 4,
    marginBottom: 8,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1e2d45",
  },
  filterPillActive: {
    backgroundColor: "#22ff88",
    borderColor: "#22ff88",
  },
  filterPillText: {
    color: "#8a9ab0",
    fontSize: 14,
    fontWeight: "600",
  },
  filterPillTextActive: {
    color: "#0a0f1a",
    fontWeight: "800",
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    paddingHorizontal: 20,
    marginBottom: 14,
    letterSpacing: -0.3,
  },

  // Current Disc Card
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
  discCoverEmoji: {
    fontSize: 32,
  },
  discInfo: {
    flex: 1,
    gap: 5,
  },
  discTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  discPlatformBadge: {
    backgroundColor: "#003087",
    alignSelf: "flex-start",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discPlatformText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
  },
  discDue: {
    color: "#5a6a8a",
    fontSize: 13,
    fontWeight: "500",
  },
  swapAgainBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#1e3a6e",
    alignItems: "center",
    justifyContent: "center",
  },
  swapAgainIcon: {
    color: "#60a5fa",
    fontSize: 20,
    fontWeight: "700",
  },

  // Game Grid
  gameRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 12,
  },
  gameCard: {
    flex: 1,
    backgroundColor: "#0f1624",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1e2d45",
  },
  gameCardPlaceholder: {
    flex: 1,
  },
  gameCover: {
    height: 170,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  gameCoverEmoji: {
    fontSize: 64,
  },
  gamePlatformBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  gamePlatformText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  gameInfo: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 6,
    gap: 3,
  },
  gameTitle: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "700",
  },
  statusAvailable: {
    color: "#22ff88",
    fontSize: 12,
    fontWeight: "600",
  },
  statusWaitlist: {
    color: "#f59e0b",
    fontSize: 12,
    fontWeight: "600",
  },
  requestBtn: {
    backgroundColor: "#22ff88",
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: "center",
  },
  requestBtnText: {
    color: "#0a0f1a",
    fontSize: 13,
    fontWeight: "800",
  },
  waitlistBtn: {
    backgroundColor: "#2563eb",
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: "center",
  },
  waitlistBtnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
  },

  // Modal Styles
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#0a0f1a",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1e2d45",
  },
  modalCancelBtn: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "600",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  modalSendBtn: {
    fontSize: 16,
    color: "#22ff88",
    fontWeight: "700",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  selectedGameCard: {
    backgroundColor: "#0f1624",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#22ff88",
  },
  selectedGameTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 4,
  },
  selectedGameOwner: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  selectedGamePlatform: {
    fontSize: 12,
    color: "#22ff88",
    fontWeight: "600",
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 12,
  },
  myGamesList: {
    flex: 1,
  },
  myGameCard: {
    backgroundColor: "#0f1624",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1e2d45",
  },
  myGameCardSelected: {
    borderColor: "#22ff88",
    backgroundColor: "#0a1f1a",
  },
  myGameTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  myGamePlatform: {
    fontSize: 12,
    color: "#64748b",
  },

  // Add Game Form Styles
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: "#0f1624",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1e2d45",
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#ffffff",
  },
  formTextArea: {
    height: 80,
    textAlignVertical: "top",
  },
  platformOptions: {
    flexDirection: "row",
    gap: 8,
  },
  platformOption: {
    backgroundColor: "#0f1624",
    borderWidth: 1,
    borderColor: "#1e2d45",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  platformOptionSelected: {
    backgroundColor: "#22ff88",
    borderColor: "#22ff88",
  },
  platformOptionText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  platformOptionTextSelected: {
    color: "#0a0f1a",
  },
});

export default Swap;
