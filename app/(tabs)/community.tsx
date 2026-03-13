import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
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
import { useAuth } from "../../contexts/AuthContext";
import {
  addComment,
  createPost,
  getPosts,
  likePost,
  unlikePost,
} from "../../lib/community";

const FILTERS = ["Feed", "Top Gamers", "Game Reviews"];

const POSTS = [
  {
    id: "1",
    user: "Kwame K.",
    avatar: "🧑🏾",
    time: "2 hrs ago",
    rating: 5.0,
    content:
      "Just finished Spider-Man 2! What a masterpiece. The web-swinging mechanics are insane. Highly recommend swapping for this. 🔥",
    hasImage: true,
    imageBg: "#1a1a1a",
    imageEmoji: "🕷️",
    likes: 24,
    comments: 5,
  },
  {
    id: "2",
    user: "Ama S.",
    avatar: "👩🏾",
    time: "5 hrs ago",
    rating: null,
    content:
      "Looking for someone to swap EA FC 24 for Mortal Kombat 1. Anyone in East Legon or Madina area? Hit me up!",
    hasImage: false,
    likes: 12,
    comments: 8,
  },
  {
    id: "3",
    user: "Yaw D.",
    avatar: "👨🏾‍💼",
    time: "1 day ago",
    rating: 4.5,
    content:
      "Cyberpunk 2077 on PS5 is a totally different experience now. The new updates fixed almost everything. Definitely a keeper for a while! 🦾",
    hasImage: true,
    imageBg: "#0a0a1a",
    imageEmoji: "🏍️",
    likes: 45,
    comments: 12,
  },
];

const Community = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("Feed");
  const [posts, setPosts] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) {
      Alert.alert("Login Required", "Please login to like posts");
      return;
    }

    try {
      if (likedPosts.includes(postId)) {
        await unlikePost(postId, user.uid);
        setLikedPosts((prev) => prev.filter((id) => id !== postId));
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, likes: post.likes - 1 } : post,
          ),
        );
      } else {
        await likePost(postId, user.uid);
        setLikedPosts((prev) => [...prev, postId]);
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post,
          ),
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to like post");
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to create posts");
      return;
    }

    if (!newPostContent.trim()) {
      Alert.alert("Error", "Please enter post content");
      return;
    }

    try {
      const userData = await getUserData(user.uid);
      await createPost({
        userId: user.uid,
        content: newPostContent.trim(),
        userName: userData?.fullName || userData?.displayName || "Anonymous",
        userAvatar: userData?.profileImage || null,
      });

      setNewPostContent("");
      setShowNewPost(false);
      fetchPosts(); // Refresh posts
      Alert.alert("Success", "Post created successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to create post");
    }
  };

  const handleComment = (postId: string) => {
    Alert.prompt("Add Comment", "Enter your comment:", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Post",
        onPress: async (comment) => {
          if (!user || !comment?.trim()) return;

          try {
            await addComment(postId, {
              userId: user.uid,
              content: comment.trim(),
              userName: "You", // Would get from user data
            });
            fetchPosts(); // Refresh posts
            Alert.alert("Success", "Comment added!");
          } catch (error) {
            Alert.alert("Error", "Failed to add comment");
          }
        },
      },
    ]);
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
            onPress={() => console.log("Community notifications pressed")}
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
              <Text
                style={[
                  styles.pillText,
                  activeFilter === f && styles.pillTextActive,
                ]}
              >
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
              <Text style={styles.emptyText}>
                No posts yet. Be the first to share!
              </Text>
            </View>
          ) : (
            posts.map((post) => {
              const liked = likedPosts.includes(post.id);
              const likeCount = post.likes + (liked ? 1 : 0);

              return (
                <View key={post.id} style={styles.post}>
                  {/* User Info */}
                  <View style={styles.postHeader}>
                    <View style={styles.postUser}>
                      <View style={styles.postAvatar}>
                        <Text style={styles.postAvatarText}>
                          {post.userAvatar
                            ? "👤"
                            : post.userName?.charAt(0)?.toUpperCase() || "?"}
                        </Text>
                      </View>
                      <View style={styles.postUserInfo}>
                        <Text style={styles.postUserName}>{post.userName}</Text>
                        <Text style={styles.postTime}>{post.time}</Text>
                      </View>
                    </View>
                    {post.rating && (
                      <View style={styles.postRating}>
                        <Text style={styles.postRatingText}>
                          ⭐ {post.rating}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Content */}
                  <Text style={styles.postContent}>{post.content}</Text>

                  {/* Image */}
                  {post.hasImage && (
                    <View
                      style={[
                        styles.postImage,
                        { backgroundColor: post.imageBg },
                      ]}
                    >
                      <Text style={styles.postImageEmoji}>
                        {post.imageEmoji}
                      </Text>
                    </View>
                  )}

                  {/* Post Actions */}
                  <View style={styles.postActions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => toggleLike(post.id)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.actionIcon,
                          liked && styles.actionIconLiked,
                        ]}
                      >
                        {liked ? "❤️" : "🤍"}
                      </Text>
                      <Text
                        style={[
                          styles.actionCount,
                          liked && styles.actionCountLiked,
                        ]}
                      >
                        {likeCount}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      activeOpacity={0.7}
                      onPress={() => handleComment(post.id)}
                    >
                      <Text style={styles.actionIcon}>💬</Text>
                      <Text style={styles.actionCount}>{post.comments}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.shareBtn}
                      activeOpacity={0.7}
                      onPress={() =>
                        Alert.alert("Share", "Share functionality coming soon!")
                      }
                    >
                      <Text style={styles.shareIcon}>⟳</Text>
                      <Text style={styles.shareText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Floating compose button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => setShowNewPost(true)}
      >
        <Text style={styles.fabIcon}>✏️</Text>
      </TouchableOpacity>

      {/* New Post Modal */}
      <Modal
        visible={showNewPost}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNewPost(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowNewPost(false)}>
              <Text style={styles.modalCancelBtn}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Post</Text>
            <TouchableOpacity onPress={handleCreatePost}>
              <Text style={styles.modalPostBtn}>Post</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TextInput
              style={styles.postInput}
              placeholder="Share your gaming experience..."
              placeholderTextColor="#64748b"
              multiline
              value={newPostContent}
              onChangeText={setNewPostContent}
              autoFocus
            />
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
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  bellIcon: {
    fontSize: 18,
  },

  // Filter Pills
  filterRow: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1e2d45",
  },
  pillActive: {
    backgroundColor: "#22ff88",
    borderColor: "#22ff88",
  },
  pillText: {
    color: "#8a9ab0",
    fontSize: 14,
    fontWeight: "600",
  },
  pillTextActive: {
    color: "#0a0f1a",
    fontWeight: "800",
  },

  // Feed
  feed: {
    paddingHorizontal: 16,
    gap: 14,
  },

  // Post Card
  postCard: {
    backgroundColor: "#0f1624",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e2d45",
    gap: 12,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  postHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1e2d45",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarEmoji: {
    fontSize: 28,
  },
  userName: {
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: "700",
  },
  postTime: {
    color: "#4a5568",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 1,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  ratingIcon: {
    color: "#ffffff",
    fontSize: 11,
  },
  ratingText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
  },

  // Content
  postContent: {
    color: "#c8d0e0",
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "400",
  },

  // Image
  postImage: {
    height: 200,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  postImageEmoji: {
    fontSize: 80,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  // Actions
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#1e2d45",
    gap: 20,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actionIcon: {
    fontSize: 16,
  },
  actionIconLiked: {},
  actionCount: {
    color: "#6a7a9a",
    fontSize: 14,
    fontWeight: "600",
  },
  actionCountLiked: {
    color: "#f87171",
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginLeft: "auto",
  },
  shareIcon: {
    color: "#6a7a9a",
    fontSize: 16,
  },
  shareText: {
    color: "#6a7a9a",
    fontSize: 14,
    fontWeight: "600",
  },

  // FAB
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
  fabIcon: {
    fontSize: 22,
  },

  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    color: "#64748b",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#64748b",
    fontSize: 16,
    textAlign: "center",
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
  modalPostBtn: {
    fontSize: 16,
    color: "#22ff88",
    fontWeight: "700",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  postInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: "top",
    minHeight: 120,
  },
});

export default Community;
