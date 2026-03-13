import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import {
    BotMessageSquare,
    CircleUser,
    House,
    RefreshCw,
    Store,
    Users,
} from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: "absolute",
          bottom: 24,
          left: 16,
          right: 16,
          elevation: 0,
          backgroundColor: "rgba(12, 18, 32, 0.85)",
          borderRadius: 24,
          height: 64,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          paddingBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => <House size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="swap"
        options={{
          title: "Swap",
          headerShown: false,
          tabBarIcon: ({ color }) => <RefreshCw size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          headerShown: false,
          tabBarIcon: ({ color }) => <Store size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          headerShown: false,
          tabBarIcon: ({ color }) => <Users size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="assist"
        options={{
          title: "Assist",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <BotMessageSquare size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => <CircleUser size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
