import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Send } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { createSwapRequest, getUserGames } from "../lib/game-swaps";

export default function SwapRequest() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [myGames, setMyGames] = useState<any[]>([]);
  const [selectedMyGame, setSelectedMyGame] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingGames, setFetchingGames] = useState(true);

  const game = {
    id: params.gameId as string,
    title: params.gameTitle as string || "Unknown Game",
    platform: params.gamePlatform as string || "PS5",
    owner: params.gameOwner as string || "Unknown",
  };

  useEffect(() => {
    if (user) {
      getUserGames(user.uid)
        .then((games) => setMyGames(games || []))
        .catch(console.error)
        .finally(() => setFetchingGames(false));
    } else {
      setFetchingGames(false);
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to request swaps");
      return;
    }
    if (myGames.length > 0 && !selectedMyGame) {
      Alert.alert("Select a Game", "Please select one of your games to offer in exchange.");
      return;
    }

    setLoading(true);
    try {
      await createSwapRequest({
        gameId: game.id,
        requesterId: user.uid,
        ownerId: game.owner,
        requestedGameId: game.id,
        offeredGameId: selectedMyGame?.id || "",
        status: "pending",
        message: message.trim() || `Hi! I'd like to swap for ${game.title}.`,
      } as any);

      Alert.alert(
        "Request Sent! 🎮",
        `Your swap request for "${game.title}" has been sent to ${game.owner}. You'll be notified when they respond.`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error creating swap request:", error);
      Alert.alert("Error", "Failed to send swap request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Swap</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={myGames}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={() => (
          <>
            {/* Game Being Requested */}
            <View style={styles.requestingCard}>
              <Text style={styles.requestingLabel}>You're requesting:</Text>
              <View style={styles.requestingGame}>
                <View style={styles.requestingGameIcon}>
                  <Text style={styles.requestingGameEmoji}>🎮</Text>
                </View>
                <View style={styles.requestingGameInfo}>
                  <Text style={styles.requestingGameTitle}>{game.title}</Text>
                  <Text style={styles.requestingGameMeta}>
                    {game.platform} · Owner: {game.owner}
                  </Text>
                </View>
              </View>
            </View>

            {/* How it works */}
            <View style={styles.howItWorks}>
              <Text style={styles.howItWorksTitle}>📋 How Swapping Works</Text>
              <Text style={styles.howItWorksText}>
                1. Select one of your games to offer{"\n"}
                2. Add a message to the owner{"\n"}
                3. Agree on a meetup spot in Accra{"\n"}
                4. Pay via MTN MoMo or Telecel Cash
              </Text>
            </View>

            {/* My Games to Offer */}
            <Text style={styles.sectionLabel}>
              {myGames.length > 0
                ? "Select a game to offer:"
                : "Your games (add games to offer in exchange):"}
            </Text>

            {fetchingGames && (
              <Text style={styles.loadingText}>Loading your games...</Text>
            )}

            {!fetchingGames && myGames.length === 0 && (
              <View style={styles.noGamesCard}>
                <Text style={styles.noGamesEmoji}>🎮</Text>
                <Text style={styles.noGamesText}>You haven't added any games yet.</Text>
                <TouchableOpacity
                  style={styles.addGameBtn}
                  onPress={() => router.push("/add-game")}
                >
                  <Text style={styles.addGameBtnText}>Add a Game</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.myGameCard, selectedMyGame?.id === item.id && styles.myGameCardSelected]}
            onPress={() => setSelectedMyGame(item)}
            activeOpacity={0.8}
          >
            <View style={styles.myGameInfo}>
              <Text style={styles.myGameTitle}>{item.title}</Text>
              <Text style={styles.myGamePlatform}>{item.platform}</Text>
            </View>
            <View style={[styles.selectCircle, selectedMyGame?.id === item.id && styles.selectCircleActive]}>
              {selectedMyGame?.id === item.id && (
                <Text style={styles.selectCheck}>✓</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <>
            {/* Message */}
            <Text style={styles.sectionLabel}>Message to owner (optional):</Text>
            <View style={styles.messageInput}>
              <TextInput
                style={styles.messageText}
                placeholder={`Hi ${game.owner}! I'd love to swap for ${game.title}...`}
                placeholderTextColor="#4a5568"
                multiline
                numberOfLines={4}
                value={message}
                onChangeText={setMessage}
                maxLength={300}
              />
              <Text style={styles.charCount}>{message.length}/300</Text>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Send size={18} color="#0a0f1a" />
              <Text style={styles.submitBtnText}>
                {loading ? "Sending..." : "Send Swap Request"}
              </Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </>
        )}
      />
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
  content: { padding: 20, gap: 16 },
  requestingCard: {
    backgroundColor: "#0f1624",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#22ff88",
    gap: 12,
  },
  requestingLabel: { color: "#22ff88", fontSize: 12, fontWeight: "700", letterSpacing: 0.5 },
  requestingGame: { flexDirection: "row", alignItems: "center", gap: 12 },
  requestingGameIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  requestingGameEmoji: { fontSize: 28 },
  requestingGameInfo: { flex: 1, gap: 4 },
  requestingGameTitle: { color: "#ffffff", fontSize: 17, fontWeight: "800" },
  requestingGameMeta: { color: "#8a9ab0", fontSize: 13 },
  howItWorks: {
    backgroundColor: "rgba(37,99,235,0.08)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(37,99,235,0.2)",
    gap: 8,
  },
  howItWorksTitle: { color: "#ffffff", fontSize: 14, fontWeight: "800" },
  howItWorksText: { color: "#8a9ab0", fontSize: 13, lineHeight: 22 },
  sectionLabel: { color: "#ffffff", fontSize: 15, fontWeight: "700", marginTop: 4 },
  loadingText: { color: "#64748b", fontSize: 14, textAlign: "center", paddingVertical: 16 },
  noGamesCard: {
    backgroundColor: "#0f1624",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#1e2d45",
  },
  noGamesEmoji: { fontSize: 36 },
  noGamesText: { color: "#8a9ab0", fontSize: 14, textAlign: "center" },
  addGameBtn: { backgroundColor: "#2563eb", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  addGameBtnText: { color: "#ffffff", fontSize: 13, fontWeight: "700" },
  myGameCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f1624",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1e2d45",
    marginBottom: 8,
  },
  myGameCardSelected: { borderColor: "#22ff88", backgroundColor: "rgba(34,255,136,0.05)" },
  myGameInfo: { flex: 1 },
  myGameTitle: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
  myGamePlatform: { color: "#8a9ab0", fontSize: 12, marginTop: 2 },
  selectCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#1e2d45",
    alignItems: "center",
    justifyContent: "center",
  },
  selectCircleActive: { borderColor: "#22ff88", backgroundColor: "#22ff88" },
  selectCheck: { color: "#0a0f1a", fontSize: 14, fontWeight: "800" },
  messageInput: {
    backgroundColor: "#0f1624",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1e2d45",
    minHeight: 100,
  },
  messageText: {
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 22,
    textAlignVertical: "top",
    minHeight: 80,
  },
  charCount: { color: "#4a5568", fontSize: 11, textAlign: "right", marginTop: 4 },
  submitBtn: {
    backgroundColor: "#22ff88",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  submitBtnDisabled: { backgroundColor: "rgba(34,255,136,0.4)" },
  submitBtnText: { color: "#0a0f1a", fontSize: 16, fontWeight: "800" },
});