import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  FlatList,
  Platform,
  SafeAreaView,
} from 'react-native'
import React, { useState } from 'react'

const FILTERS = ['All Games', 'PlayStation', 'Xbox', 'Switch', 'PC']

const GAMES = [
  {
    id: '1',
    title: 'God of War Ragna...',
    platform: 'PS5',
    platformColor: '#003087',
    status: 'available',
    emoji: '⚔️',
    bgColor: '#0a1628',
  },
  {
    id: '2',
    title: 'Forza Horizon 5',
    platform: 'XBOX',
    platformColor: '#107C10',
    status: 'available',
    emoji: '🚗',
    bgColor: '#0d1a10',
  },
  {
    id: '3',
    title: 'The Last of Us Par...',
    platform: 'PS5',
    platformColor: '#003087',
    status: 'waitlist',
    waitlistCount: 2,
    emoji: '🎸',
    bgColor: '#1a1008',
  },
  {
    id: '4',
    title: 'Starfield',
    platform: 'XBOX',
    platformColor: '#107C10',
    status: 'available',
    emoji: '🌌',
    bgColor: '#080d1a',
  },
]

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'swap', label: 'Swap', icon: '◎' },
  { id: 'shop', label: 'Shop', icon: '🛒' },
  { id: 'community', label: 'Community', icon: '👥' },
  { id: 'profile', label: 'Profile', icon: '👤' },
]

const Swap = () => {
  const [activeFilter, setActiveFilter] = useState('All Games')
  const [search, setSearch] = useState('')
  const [activeNav, setActiveNav] = useState('swap')

  const gameRows = []
  for (let i = 0; i < GAMES.length; i += 2) {
    gameRows.push(GAMES.slice(i, i + 2))
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
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterBtnIcon}>⚙</Text>
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
              style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterPillText, activeFilter === f && styles.filterPillTextActive]}>
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
            <TouchableOpacity style={styles.swapAgainBtn}>
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
                  <View style={[styles.gameCover, { backgroundColor: game.bgColor }]}>
                    <Text style={styles.gameCoverEmoji}>{game.emoji}</Text>
                    <View style={[styles.gamePlatformBadge, { backgroundColor: game.platformColor }]}>
                      <Text style={styles.gamePlatformText}>{game.platform}</Text>
                    </View>
                  </View>

                  {/* Info */}
                  <View style={styles.gameInfo}>
                    <Text style={styles.gameTitle} numberOfLines={1}>{game.title}</Text>
                    {game.status === 'available' ? (
                      <Text style={styles.statusAvailable}>Available</Text>
                    ) : (
                      <Text style={styles.statusWaitlist}>Waitlist ({game.waitlistCount})</Text>
                    )}
                  </View>

                  {/* CTA Button */}
                  {game.status === 'available' ? (
                    <TouchableOpacity style={styles.requestBtn} activeOpacity={0.85}>
                      <Text style={styles.requestBtnText}>Request Swap</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.waitlistBtn} activeOpacity={0.85}>
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

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0f1a',
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0f1a',
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnIcon: {
    color: '#ffffff',
    fontSize: 18,
  },

  // Search
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e2d45',
  },
  searchIcon: {
    fontSize: 15,
    opacity: 0.5,
  },
  searchInput: {
    flex: 1,
    color: '#e2e8f0',
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
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1e2d45',
  },
  filterPillActive: {
    backgroundColor: '#22ff88',
    borderColor: '#22ff88',
  },
  filterPillText: {
    color: '#8a9ab0',
    fontSize: 14,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#0a0f1a',
    fontWeight: '800',
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    paddingHorizontal: 20,
    marginBottom: 14,
    letterSpacing: -0.3,
  },

  // Current Disc Card
  currentDiscCard: {
    marginHorizontal: 20,
    backgroundColor: '#0f1624',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#22ff88',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  discCoverBox: {
    width: 64,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#1a0a28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discCoverEmoji: {
    fontSize: 32,
  },
  discInfo: {
    flex: 1,
    gap: 5,
  },
  discTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  discPlatformBadge: {
    backgroundColor: '#003087',
    alignSelf: 'flex-start',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discPlatformText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  discDue: {
    color: '#5a6a8a',
    fontSize: 13,
    fontWeight: '500',
  },
  swapAgainBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1e3a6e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapAgainIcon: {
    color: '#60a5fa',
    fontSize: 20,
    fontWeight: '700',
  },

  // Game Grid
  gameRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 12,
  },
  gameCard: {
    flex: 1,
    backgroundColor: '#0f1624',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e2d45',
  },
  gameCardPlaceholder: {
    flex: 1,
  },
  gameCover: {
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gameCoverEmoji: {
    fontSize: 64,
  },
  gamePlatformBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  gamePlatformText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  gameInfo: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 6,
    gap: 3,
  },
  gameTitle: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '700',
  },
  statusAvailable: {
    color: '#22ff88',
    fontSize: 12,
    fontWeight: '600',
  },
  statusWaitlist: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '600',
  },
  requestBtn: {
    backgroundColor: '#22ff88',
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
  },
  requestBtnText: {
    color: '#0a0f1a',
    fontSize: 13,
    fontWeight: '800',
  },
  waitlistBtn: {
    backgroundColor: '#2563eb',
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
  },
  waitlistBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },

})

export default Swap