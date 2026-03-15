import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'
import { useAuth } from '../contexts/AuthContext'

const index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B0F19' }}>
        <ActivityIndicator size="large" color="#39FF14" />
      </View>
    );
  }

  if (user) {
    console.log("[Index] User found, redirecting to Home");
    return <Redirect href="/(tabs)/home" />;
  }

  console.log("[Index] No user found, redirecting to Welcome");
  return (
    <Redirect href="/(auth)/welcome" />
  );
}

export default index