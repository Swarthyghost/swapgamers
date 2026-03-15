import { router } from "expo-router";
import { ArrowLeft, Plus } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { createGame } from "../lib/game-swaps";

const PLATFORMS = ["PS5", "PS4", "Xbox", "Switch", "PC"];
const CONDITIONS = ["New", "Like New", "Good", "Fair"];

export default function AddGame() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [condition, setCondition] = useState("Good");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const platformMap: { [key: string]: string } = {
    PS5: "ps5",
    PS4: "ps4",
    Xbox: "xbox",
    Switch: "switch",
    PC: "pc",
  };

  const conditionMap: { [key: string]: string } = {
    New: "new",
    "Like New": "like-new",
    Good: "good",
    Fair: "fair",
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to add games");
      return;
    }
    if (!title.trim()) {
      Alert.alert("Missing Info", "Please enter the game title.");
      return;
    }
    if (!platform) {
      Alert.alert("Missing Info", "Please select a platform.");
      return;
    }

    setLoading(true);
    try {
      await createGame({
        title: title.trim(),
        platform: platformMap[platform] as any,
        description: description.trim(),
        condition: conditionMap[condition] as any,
        owner: user.uid,
        available: true,
        genre: [],
        releaseYear: new Date().getFullYear(),
        rating: 0,
        imageUrl: undefined,
        location: "Accra, Ghana",
      });

      Alert.alert(
        "Game Added! 🎮",
        `"${title}" is now listed and available for swapping!`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error adding game:", error);
      Alert.alert("Error", "Failed to add game. Please try again.");
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
        <Text style={styles.headerTitle}>Add Game</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>
              🎮 Add games you own to make them available for swapping with other gamers in Ghana!
            </Text>
          </View>

          {/* Game Title */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Game Title *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="e.g. Spider-Man 2"
                placeholderTextColor="#4a5568"
                value={title}
                onChangeText={setTitle}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Platform */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Platform *</Text>
            <View style={styles.optionsRow}>
              {PLATFORMS.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.option, platform === p && styles.optionSelected]}
                  onPress={() => setPlatform(p)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, platform === p && styles.optionTextSelected]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Condition */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Condition *</Text>
            <View style={styles.optionsRow}>
              {CONDITIONS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.option, condition === c && styles.optionSelected]}
                  onPress={() => setCondition(c)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, condition === c && styles.optionTextSelected]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the game's condition, any extras included, etc."
                placeholderTextColor="#4a5568"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
                maxLength={300}
              />
            </View>
            <Text style={styles.charCount}>{description.length}/300</Text>
          </View>

          {/* Rules */}
          <View style={styles.rulesCard}>
            <Text style={styles.rulesTitle}>📋 Swap Guidelines</Text>
            <Text style={styles.rulesText}>
              • Meetup locations should be agreed in Accra{"\n"}
              • Game must match the condition you described{"\n"}
              • Swap duration is typically 14 days{"\n"}
              • Payment via MTN MoMo or Telecel Cash
            </Text>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Plus size={18} color="#0a0f1a" />
            <Text style={styles.submitBtnText}>
              {loading ? "Adding Game..." : "Add Game"}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  content: { padding: 20, gap: 20 },
  infoBanner: {
    backgroundColor: "rgba(34,255,136,0.08)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(34,255,136,0.2)",
  },
  infoBannerText: { color: "#22ff88", fontSize: 13, lineHeight: 20 },
  fieldGroup: { gap: 8 },
  label: { color: "#e2e8f0", fontSize: 14, fontWeight: "700" },
  inputWrapper: {
    backgroundColor: "#0f1624",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1e2d45",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textAreaWrapper: { paddingVertical: 10 },
  input: { color: "#ffffff", fontSize: 15, padding: 0 },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  charCount: { color: "#4a5568", fontSize: 11, textAlign: "right" },
  optionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#0f1624",
    borderWidth: 1,
    borderColor: "#1e2d45",
  },
  optionSelected: { backgroundColor: "#22ff88", borderColor: "#22ff88" },
  optionText: { color: "#8a9ab0", fontSize: 13, fontWeight: "600" },
  optionTextSelected: { color: "#0a0f1a", fontWeight: "800" },
  rulesCard: {
    backgroundColor: "rgba(37,99,235,0.08)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(37,99,235,0.2)",
    gap: 8,
  },
  rulesTitle: { color: "#ffffff", fontSize: 14, fontWeight: "800" },
  rulesText: { color: "#8a9ab0", fontSize: 13, lineHeight: 22 },
  submitBtn: {
    backgroundColor: "#22ff88",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  submitBtnDisabled: { backgroundColor: "rgba(34,255,136,0.4)" },
  submitBtnText: { color: "#0a0f1a", fontSize: 16, fontWeight: "800" },
});