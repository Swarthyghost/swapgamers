import { router } from "expo-router";
import { ArrowLeft, Send } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
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
import { useAuth } from "../contexts/AuthContext";
import { getUserData } from "../lib/auth";
import { createPost } from "../lib/community";

const TAGS = ["Review", "Looking to Swap", "Recommendation", "Question", "Discussion"];

export default function NewPost() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to create posts");
      return;
    }
    if (!content.trim() || content.trim().length < 10) {
      Alert.alert("Too Short", "Please write at least 10 characters.");
      return;
    }

    setLoading(true);
    try {
      const userData = await getUserData(user.uid);
      const userName = userData?.fullName || userData?.displayName || "Gamer";

      await createPost({
        authorId: user.uid,
        authorName: userName,
        authorAvatar: userData?.profileImage || null,
        title: content.trim().substring(0, 60),
        content: content.trim(),
        tags: selectedTag ? [selectedTag] : [],
      } as any);

      Alert.alert("Posted! 🎮", "Your post is live in the community!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post. Please try again.");
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
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity
          style={[styles.postBtn, (!content.trim() || loading) && styles.postBtnDisabled]}
          onPress={handlePost}
          disabled={!content.trim() || loading}
        >
          <Send size={16} color={content.trim() && !loading ? "#0a0f1a" : "#4a5568"} />
          <Text style={[styles.postBtnText, (!content.trim() || loading) && styles.postBtnTextDisabled]}>
            {loading ? "Posting..." : "Post"}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Author row */}
        <View style={styles.authorRow}>
          <View style={styles.authorAvatar}>
            <Text style={styles.authorAvatarText}>
              {user?.displayName?.charAt(0)?.toUpperCase() || "G"}
            </Text>
          </View>
          <View>
            <Text style={styles.authorName}>
              {user?.displayName || "Gamer"}
            </Text>
            <Text style={styles.authorSub}>Posting to SwapGamers Community</Text>
          </View>
        </View>

        {/* Tags */}
        <View style={styles.tagsSection}>
          <Text style={styles.tagsLabel}>Tag your post:</Text>
          <View style={styles.tagsRow}>
            {TAGS.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[styles.tag, selectedTag === tag && styles.tagSelected]}
                onPress={() => setSelectedTag(selectedTag === tag ? "" : tag)}
              >
                <Text style={[styles.tagText, selectedTag === tag && styles.tagTextSelected]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Text Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Share your gaming experience, ask a question, or start a discussion..."
            placeholderTextColor="#3a4460"
            multiline
            value={content}
            onChangeText={setContent}
            autoFocus
            maxLength={2000}
          />
        </View>

        {/* Character count */}
        <View style={styles.footer}>
          <Text style={styles.charCount}>{content.length}/2000</Text>
          {content.length >= 10 && (
            <Text style={styles.readyText}>✓ Ready to post</Text>
          )}
        </View>
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
  postBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#22ff88",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postBtnDisabled: { backgroundColor: "#111827", borderWidth: 1, borderColor: "#1e2d45" },
  postBtnText: { color: "#0a0f1a", fontSize: 14, fontWeight: "800" },
  postBtnTextDisabled: { color: "#4a5568" },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1e2d45",
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1e3a5f",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#22ff88",
  },
  authorAvatarText: { color: "#22ff88", fontSize: 18, fontWeight: "800" },
  authorName: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
  authorSub: { color: "#4a5568", fontSize: 12 },
  tagsSection: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10, gap: 8 },
  tagsLabel: { color: "#8a9ab0", fontSize: 12, fontWeight: "600" },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1e2d45",
  },
  tagSelected: { backgroundColor: "rgba(34,255,136,0.12)", borderColor: "#22ff88" },
  tagText: { color: "#8a9ab0", fontSize: 12, fontWeight: "600" },
  tagTextSelected: { color: "#22ff88", fontWeight: "700" },
  inputContainer: { flex: 1, padding: 20 },
  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: "top",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#1e2d45",
  },
  charCount: { color: "#4a5568", fontSize: 12 },
  readyText: { color: "#22ff88", fontSize: 12, fontWeight: "600" },
});