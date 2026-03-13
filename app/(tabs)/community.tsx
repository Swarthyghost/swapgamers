import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import {
  getPosts,
  likePost,
  unlikePost,
} from "../../lib/community";

const FILTERS = ["Feed", "Top Gamers", "Game Reviews"];

// Fallback static posts when Firestore is empty
const STATIC_POSTS = [
  {
    id: "1",
    userName: "Kwame K.",
    userAvatar: null,
    time: "2 hrs ago",
    rating: 5.0,
    content: "Just finished Spider-Man 2! What a masterpiece. The web-swinging mechanics are insane. Highly recommend swapping for this. 🔥",
    hasImage: true,
    imageBg: "#1a0a1a",
    imageEmoji: "🕷️",
    likes: 24,
    comments: [],
  },
  {
    id: "2",
    userName: "Ama S.",
    userAvatar: null,
    time: "5 hrs ago",
    rating: null,
    content: "Looking for someone to swap EA FC 24 for Mortal Kombat 1. Anyone in East Legon or Madina area? Hit me up!",
    hasImage: false,
    likes: 12,
    comments: [],
  },
  {
    id: "3",
    userName: "Yaw D.",
    userAvatar: null,
    time: "1 day ago",
    rating: 4.5,
    content: "Cyberpunk 2077 on PS5 is a totally different experience now. The new updates fixed almost everything. Definitely a keeper for a while! 🦾",
    hasImage: true,
    imageBg: "#0a0a1a",
    imageEmoji: "🏍️",
    likes: 45,
    comments: [],
  },
];

const Community = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("Feed");
  const [posts, setPosts] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts.length > 0 ? fetchedPosts : STATIC_POSTS);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts(STATIC_POSTS);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) {
      Alert.alert("Login Required", "Please login to like posts");
      return;
    }
    if (likedPosts.includes(postId)) {
      await unlikePost(postId, user.uid);
      setLikedPosts((prev) => prev.filter((id) => id !== postId));
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likes: (post.likes || 0) - 1 } : post
        )
      );
    } else {
      await likePost(postId, user.uid);
      setLikedPosts((prev) => [...prev, postId]);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
        )
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1a" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Community</Text>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => router.push("/notifications")}
          >
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
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
              style={[styles.pill, activeFilter === f && styles.pillActive]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={[styles.pillText, activeFilter === f && styles.pillTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Posts */}
        <View style={styles.posts}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading posts...</Text>
            </View>
          ) : posts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🎮</Text>
              <Text style={styles.emptyText}>No posts yet. Be the first to share!</Text>
              <TouchableOpacity
                style={styles.createFirstPost}
                onPress={() => {
                  if (!user) {
                    Alert.alert("Login Required", "Please login to create posts");
                    return;
                  }
                  router.push("/new-post");
                }}
              >
                <Text style={styles.createFirstPostText}>Create Post</Text>
              </TouchableOpacity>
            </View>
          ) : (
            posts.map((post) => {
              const liked = likedPosts.includes(post.id);
              const commentCount = Array.isArray(post.comments) ? post.comments.length : (post.comments || 0);

              return (
                <View key={post.id} style={styles.post}>
                  {/* User Info */}
                  <View style={styles.postHeader}>
                    <View style={styles.postUser}>
                      <View style={styles.postAvatar}>
                        <Text style={styles.postAvatarText}>
                          {(post.userName || post.authorName || "G").charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.postUserInfo}>
                        <Text style={styles.postUserName}>
                          {post.userName || post.authorName || "Gamer"}
                        </Text>
                        <Text style={styles.postTime}>
                          {post.time || "Recently"}
                        </Text>
                      </View>
                    </View>
                    {post.rating && (
                      <View style={styles.postRating}>
                        <Text style={styles.postRatingText}>⭐ {post.rating}</Text>
                      </View>
                    )}
                  </View>

                  {/* Content */}
                  <Text style={styles.postContent}>
                    {post.content || post.title}
                  </Text>

                  {/* Image */}
                  {post.hasImage && (
                    <View style={[styles.postImage, { backgroundColor: post.imageBg || "#111827" }]}>
                      <Text style={styles.postImageEmoji}>{post.imageEmoji || "🎮"}</Text>
                    </View>
                  )}

                  {/* Post Actions */}
                  <View style={styles.postActions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => toggleLike(post.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.actionIcon}>{liked ? "❤️" : "🤍"}</Text>
                      <Text style={[styles.actionCount, liked && styles.actionCountLiked]}>
                        {post.likes || 0}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      activeOpacity={0.7}
                      onPress={() => Alert.alert("Comments", "Comment feature coming soon!")}
                    >
                      <Text style={styles.actionIcon}>💬</Text>
                      <Text style={styles.actionCount}>{commentCount}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.shareBtn}
                      activeOpacity={0.7}
                      onPress={() => Alert.alert("Share", "Share functionality coming soon!")}
                    >
                      <Text style={styles.shareIcon}>↗</Text>
                      <Text style={styles.shareText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating compose button - navigates to new-post screen */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => {
          if (!user) {
            Alert.alert("Login Required", "Please login to create posts");
            return;
          }
          router.push("/new-post");
        }}
      >
        <Text style={styles.fabIcon}>✏️</Text>
      </TouchableOpacity>
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
  headerTitle: { color: "#ffffff", fontSize: 28, fontWeight: "900", letterSpacing: -0.5 },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  bellIcon: { fontSize: 18 },
  filterRow: { paddingHorizontal: 20, gap: 10, marginBottom: 20 },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1e2d45",
  },
  pillActive: { backgroundColor: "#22ff88", borderColor: "#22ff88" },
  pillText: { color: "#8a9ab0", fontSize: 14, fontWeight: "600" },
  pillTextActive: { color: "#0a0f1a", fontWeight: "800" },
  posts: { paddingHorizontal: 16, gap: 14 },
  post: {
    backgroundColor: "#0f1624",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e2d45",
    gap: 12,
  },
  postHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  postUser: { flexDirection: "row", alignItems: "center", gap: 10 },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1e3a5f",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#22ff88",
  },
  postAvatarText: { color: "#22ff88", fontSize: 18, fontWeight: "800" },
  postUserInfo: { gap: 2 },
  postUserName: { color: "#e2e8f0", fontSize: 15, fontWeight: "700" },
  postTime: { color: "#4a5568", fontSize: 12, fontWeight: "500" },
  postRating: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  postRatingText: { color: "#ffffff", fontSize: 13, fontWeight: "800" },
  postContent: { color: "#c8d0e0", fontSize: 15, lineHeight: 23, fontWeight: "400" },
  postImage: {
    height: 200,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  postImageEmoji: { fontSize: 80 },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#1e2d45",
    gap: 20,
  },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 5 },
  actionIcon: { fontSize: 16 },
  actionCount: { color: "#6a7a9a", fontSize: 14, fontWeight: "600" },
  actionCountLiked: { color: "#f87171" },
  shareBtn: { flexDirection: "row", alignItems: "center", gap: 5, marginLeft: "auto" },
  shareIcon: { color: "#6a7a9a", fontSize: 16 },
  shareText: { color: "#6a7a9a", fontSize: 14, fontWeight: "600" },
  fab: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 100 : 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#22ff88",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#22ff88",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: { fontSize: 22 },
  loadingContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 40 },
  loadingText: { color: "#64748b", fontSize: 16 },
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 60, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { color: "#64748b", fontSize: 16, textAlign: "center" },
  createFirstPost: {
    backgroundColor: "#22ff88",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  createFirstPostText: { color: "#0a0f1a", fontSize: 14, fontWeight: "800" },
});

export default Community;