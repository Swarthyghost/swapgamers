import { router } from "expo-router";
import { ArrowLeft, Bell, Check, RefreshCw, ShoppingBag, Users } from "lucide-react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const NOTIFICATIONS = [
  {
    id: "1",
    type: "swap",
    title: "New Swap Request",
    message: "Kwame wants to swap FIFA 24 for your God of War",
    time: "2 min ago",
    read: false,
    icon: "swap",
  },
  {
    id: "2",
    type: "swap",
    title: "Swap Accepted!",
    message: "Ama accepted your request for Spider-Man 2",
    time: "1 hr ago",
    read: false,
    icon: "swap",
  },
  {
    id: "3",
    type: "community",
    title: "New Comment",
    message: "Yaw commented on your post about Cyberpunk 2077",
    time: "3 hrs ago",
    read: true,
    icon: "community",
  },
  {
    id: "4",
    type: "shop",
    title: "Order Delivered",
    message: "Your DualSense Controller has been delivered",
    time: "1 day ago",
    read: true,
    icon: "shop",
  },
  {
    id: "5",
    type: "swap",
    title: "Swap Reminder",
    message: "Your Cyberpunk 2077 is due for return in 2 days",
    time: "2 days ago",
    read: true,
    icon: "swap",
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "swap": return <RefreshCw size={20} color="#22ff88" />;
    case "community": return <Users size={20} color="#60a5fa" />;
    case "shop": return <ShoppingBag size={20} color="#f59e0b" />;
    default: return <Bell size={20} color="#8a9ab0" />;
  }
};

const getIconBg = (type: string) => {
  switch (type) {
    case "swap": return "rgba(34,255,136,0.1)";
    case "community": return "rgba(96,165,250,0.1)";
    case "shop": return "rgba(245,158,11,0.1)";
    default: return "#111827";
  }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
            <Check size={16} color="#22ff88" />
            <Text style={styles.markAllText}>All read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Bell size={14} color="#22ff88" />
          <Text style={styles.unreadBannerText}>
            {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
          </Text>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {notifications.map((notif, idx) => (
          <TouchableOpacity
            key={notif.id}
            style={[styles.notifCard, !notif.read && styles.notifCardUnread]}
            activeOpacity={0.8}
            onPress={() => markRead(notif.id)}
          >
            <View style={[styles.notifIcon, { backgroundColor: getIconBg(notif.type) }]}>
              {getIcon(notif.type)}
            </View>
            <View style={styles.notifBody}>
              <View style={styles.notifTop}>
                <Text style={styles.notifTitle}>{notif.title}</Text>
                {!notif.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notifMessage}>{notif.message}</Text>
              <Text style={styles.notifTime}>{notif.time}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <Bell size={48} color="#1e2d45" />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>You're all caught up!</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(34,255,136,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(34,255,136,0.2)",
  },
  markAllText: { color: "#22ff88", fontSize: 12, fontWeight: "700" },
  unreadBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: "rgba(34,255,136,0.08)",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(34,255,136,0.15)",
  },
  unreadBannerText: { color: "#22ff88", fontSize: 13, fontWeight: "600" },
  scrollContent: { padding: 20, gap: 10 },
  notifCard: {
    flexDirection: "row",
    backgroundColor: "#0f1624",
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#1e2d45",
    alignItems: "flex-start",
  },
  notifCardUnread: {
    borderColor: "rgba(34,255,136,0.25)",
    backgroundColor: "rgba(34,255,136,0.03)",
  },
  notifIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  notifBody: { flex: 1, gap: 3 },
  notifTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notifTitle: { color: "#ffffff", fontSize: 14, fontWeight: "700" },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22ff88",
  },
  notifMessage: { color: "#8a9ab0", fontSize: 13, lineHeight: 18 },
  notifTime: { color: "#4a5568", fontSize: 11, fontWeight: "500" },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: { color: "#ffffff", fontSize: 18, fontWeight: "700" },
  emptySubtitle: { color: "#4a5568", fontSize: 14 },
});