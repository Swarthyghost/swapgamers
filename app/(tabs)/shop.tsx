import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native'
import React, { useState } from 'react'

const FILTERS = ['All', 'Controllers', 'Headsets', 'Chargers', 'Cables']

const PRODUCTS = [
  {
    id: '1',
    title: 'PS5 DualSense Controller',
    price: 'GHS 1,150.00',
    platform: 'PS5',
    platformColor: '#003087',
    emoji: '🎮',
    bgColor: '#0d1a2e',
  },
  {
    id: '2',
    title: 'Xbox Wireless Controller',
    price: 'GHS 950.00',
    platform: 'XBOX',
    platformColor: '#107C10',
    emoji: '🕹️',
    bgColor: '#111111',
  },
  {
    id: '3',
    title: 'Pulse 3D Wireless Headset',
    price: 'GHS 1,400.00',
    platform: null,
    emoji: '🎧',
    bgColor: '#0e1220',
  },
  {
    id: '4',
    title: 'DualSense Charging Station',
    price: 'GHS 550.00',
    platform: 'PS5',
    platformColor: '#003087',
    emoji: '🔌',
    bgColor: '#0d1a2e',
  },
  {
    id: '5',
    title: 'Stealth 600 Gen 2 Headset',
    price: 'GHS 1,250.00',
    platform: null,
    emoji: '🎧',
    bgColor: '#0a150a',
  },
  {
    id: '6',
    title: 'Ultra High Speed HDMI Cable',
    price: 'GHS 180.00',
    platform: null,
    emoji: '📺',
    bgColor: '#12080a',
  },
]

const Shop = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  const [cartCount, setCartCount] = useState(3)
  const [addedItems, setAddedItems] = useState<string[]>([])

  const handleAdd = (id: string) => {
    if (!addedItems.includes(id)) {
      setAddedItems((prev) => [...prev, id])
      setCartCount((c) => c + 1)
    }
  }

  const rows: (typeof PRODUCTS)[] = []
  for (let i = 0; i < PRODUCTS.length; i += 2) {
    rows.push(PRODUCTS.slice(i, i + 2))
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1a" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shop</Text>
          <TouchableOpacity style={styles.cartBtn} activeOpacity={0.85}>
            <Text style={styles.cartIcon}>🛍</Text>
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
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

        {/* Product Grid */}
        <View style={styles.grid}>
          {rows.map((row, rowIdx) => (
            <View key={rowIdx} style={styles.gridRow}>
              {row.map((item) => {
                const added = addedItems.includes(item.id)
                return (
                  <View key={item.id} style={styles.card}>
                    {/* Image */}
                    <View style={[styles.cardImage, { backgroundColor: item.bgColor }]}>
                      <Text style={styles.cardEmoji}>{item.emoji}</Text>
                      {item.platform && (
                        <View style={[styles.platformBadge, { backgroundColor: item.platformColor }]}>
                          <Text style={styles.platformText}>{item.platform}</Text>
                        </View>
                      )}
                    </View>
                    {/* Info */}
                    <View style={styles.cardBody}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardPrice}>{item.price}</Text>
                      <TouchableOpacity
                        style={[styles.addBtn, added && styles.addBtnAdded]}
                        onPress={() => handleAdd(item.id)}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.addBtnText, added && styles.addBtnTextAdded]}>
                          {added ? '✓ Added' : '+ Add'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              })}
              {row.length < 2 && <View style={styles.cardEmpty} />}
            </View>
          ))}
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1a',
  },
  scrollContent: {
    paddingBottom: 16,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 58 : 44,
    paddingBottom: 18,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  cartBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: {
    fontSize: 20,
  },
  cartBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#22ff88',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#0a0f1a',
  },
  cartBadgeText: {
    color: '#0a0f1a',
    fontSize: 10,
    fontWeight: '900',
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
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1e2d45',
  },
  pillActive: {
    backgroundColor: '#22ff88',
    borderColor: '#22ff88',
  },
  pillText: {
    color: '#8a9ab0',
    fontSize: 14,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#0a0f1a',
    fontWeight: '800',
  },

  // Grid
  grid: {
    paddingHorizontal: 14,
    gap: 14,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 14,
  },
  cardEmpty: {
    flex: 1,
  },

  // Card
  card: {
    flex: 1,
    backgroundColor: '#0f1624',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  cardImage: {
    height: 158,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardEmoji: {
    fontSize: 62,
  },
  platformBadge: {
    position: 'absolute',
    top: 9,
    right: 9,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  platformText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Card Body
  cardBody: {
    padding: 12,
    gap: 6,
  },
  cardTitle: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  cardPrice: {
    color: '#22ff88',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  addBtn: {
    backgroundColor: '#22ff88',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
  },
  addBtnAdded: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#22ff88',
  },
  addBtnText: {
    color: '#0a0f1a',
    fontSize: 14,
    fontWeight: '800',
  },
  addBtnTextAdded: {
    color: '#22ff88',
  },
})

export default Shop