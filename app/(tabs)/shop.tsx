import React, { useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const FILTERS = ["All", "Controllers", "Headsets", "Chargers", "Cables"];

const PRODUCTS = [
  {
    id: "1",
    title: "PS5 DualSense Controller",
    price: "GHS 1,150.00",
    platform: "PS5",
    platformColor: "#003087",
    emoji: "🎮",
    bgColor: "#0d1a2e",
  },
  {
    id: "2",
    title: "Xbox Wireless Controller",
    price: "GHS 950.00",
    platform: "XBOX",
    platformColor: "#107C10",
    emoji: "🕹️",
    bgColor: "#111111",
  },
  {
    id: "3",
    title: "Pulse 3D Wireless Headset",
    price: "GHS 1,400.00",
    platform: null,
    emoji: "🎧",
    bgColor: "#0e1220",
  },
  {
    id: "4",
    title: "DualSense Charging Station",
    price: "GHS 550.00",
    platform: "PS5",
    platformColor: "#003087",
    emoji: "🔌",
    bgColor: "#0d1a2e",
  },
  {
    id: "5",
    title: "Stealth 600 Gen 2 Headset",
    price: "GHS 1,250.00",
    platform: null,
    emoji: "🎧",
    bgColor: "#0a150a",
  },
  {
    id: "6",
    title: "Ultra High Speed HDMI Cable",
    price: "GHS 180.00",
    platform: null,
    emoji: "📺",
    bgColor: "#12080a",
  },
];

const Shop = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);

  const handleAdd = (product: any) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (!existingItem) {
      setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    }
  };

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(
          item.price.replace("GHS ", "").replace(",", ""),
        );
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart Empty", "Please add items to your cart first");
      return;
    }
    Alert.alert(
      "Checkout",
      `Total: GHS ${getTotalPrice()}\nProceed to payment?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Pay Now",
          onPress: () => {
            Alert.alert("Success", "Order placed successfully!");
            setCartItems([]);
            setShowCart(false);
          },
        },
      ],
    );
  };

  const rows: (typeof PRODUCTS)[] = [];
  for (let i = 0; i < PRODUCTS.length; i += 2) {
    rows.push(PRODUCTS.slice(i, i + 2));
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
          <Text style={styles.headerTitle}>Shop</Text>
          <TouchableOpacity
            style={styles.cartBtn}
            activeOpacity={0.85}
            onPress={() => setShowCart(true)}
          >
            <Text style={styles.cartIcon}>🛍</Text>
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
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

        {/* Product Grid */}
        <View style={styles.grid}>
          {rows.map((row, rowIdx) => (
            <View key={rowIdx} style={styles.gridRow}>
              {row.map((product) => {
                const added = cartItems.some((item) => item.id === product.id);
                return (
                  <View key={product.id} style={styles.card}>
                    {/* Image */}
                    <View
                      style={[
                        styles.cardImage,
                        { backgroundColor: product.bgColor },
                      ]}
                    >
                      <Text style={styles.cardEmoji}>{product.emoji}</Text>
                      {product.platform && (
                        <View
                          style={[
                            styles.platformBadge,
                            { backgroundColor: product.platformColor },
                          ]}
                        >
                          <Text style={styles.platformText}>
                            {product.platform}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Info */}
                    <View style={styles.cardBody}>
                      <Text style={styles.cardTitle}>{product.title}</Text>
                      <Text style={styles.cardPrice}>{product.price}</Text>
                      <TouchableOpacity
                        style={[styles.addBtn, added && styles.addBtnAdded]}
                        onPress={() => handleAdd(product)}
                        activeOpacity={0.85}
                      >
                        <Text
                          style={[
                            styles.addBtnText,
                            added && styles.addBtnTextAdded,
                          ]}
                        >
                          {added ? "✓ Added" : "+ Add"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
              {row.length < 2 && <View style={styles.cardEmpty} />}
            </View>
          ))}
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>

      {/* Cart Modal */}
      <Modal
        visible={showCart}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCart(false)}
      >
        <SafeAreaView style={styles.cartSafeArea}>
          <View style={styles.cartHeader}>
            <TouchableOpacity onPress={() => setShowCart(false)}>
              <Text style={styles.cartCloseBtn}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.cartTitle}>
              Shopping Cart ({cartItems.length})
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {cartItems.length === 0 ? (
            <View style={styles.emptyCart}>
              <Text style={styles.emptyCartText}>Your cart is empty</Text>
              <TouchableOpacity
                style={styles.continueShoppingBtn}
                onPress={() => setShowCart(false)}
              >
                <Text style={styles.continueShoppingText}>
                  Continue Shopping
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.cartItem}>
                    <View style={styles.cartItemImage}>
                      <Text style={styles.cartItemEmoji}>{item.emoji}</Text>
                    </View>
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemTitle}>{item.title}</Text>
                      <Text style={styles.cartItemPrice}>{item.price}</Text>
                    </View>
                    <View style={styles.cartItemControls}>
                      <TouchableOpacity
                        style={styles.quantityBtn}
                        onPress={() => handleQuantityChange(item.id, -1)}
                      >
                        <Text style={styles.quantityBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityBtn}
                        onPress={() => handleQuantityChange(item.id, 1)}
                      >
                        <Text style={styles.quantityBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => handleRemove(item.id)}
                    >
                      <Text style={styles.removeBtnText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                )}
                style={styles.cartList}
              />

              <View style={styles.cartFooter}>
                <View style={styles.cartTotal}>
                  <Text style={styles.cartTotalLabel}>Total</Text>
                  <Text style={styles.cartTotalAmount}>
                    GHS {getTotalPrice()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={handleCheckout}
                >
                  <Text style={styles.checkoutBtnText}>Checkout</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  cartBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  cartIcon: {
    fontSize: 20,
  },
  cartBadge: {
    position: "absolute",
    top: -3,
    right: -3,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#22ff88",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#0a0f1a",
  },
  cartBadgeText: {
    color: "#0a0f1a",
    fontSize: 10,
    fontWeight: "900",
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

  // Grid
  grid: {
    paddingHorizontal: 14,
    gap: 14,
  },
  gridRow: {
    flexDirection: "row",
    gap: 14,
  },
  cardEmpty: {
    flex: 1,
  },

  // Card
  card: {
    flex: 1,
    backgroundColor: "#0f1624",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#2563eb",
  },
  cardImage: {
    height: 158,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cardEmoji: {
    fontSize: 62,
  },
  platformBadge: {
    position: "absolute",
    top: 9,
    right: 9,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  platformText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  // Card Body
  cardBody: {
    padding: 12,
    gap: 6,
  },
  cardTitle: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  cardPrice: {
    color: "#22ff88",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4,
  },
  addBtn: {
    backgroundColor: "#22ff88",
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: "center",
  },
  addBtnAdded: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#22ff88",
  },
  addBtnText: {
    color: "#0a0f1a",
    fontSize: 14,
    fontWeight: "800",
  },
  addBtnTextAdded: {
    color: "#22ff88",
  },

  // Cart Modal Styles
  cartSafeArea: {
    flex: 1,
    backgroundColor: "#0a0f1a",
  },
  cartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1e2d45",
  },
  cartCloseBtn: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "600",
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  emptyCart: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyCartText: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 20,
  },
  continueShoppingBtn: {
    backgroundColor: "#39FF14",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  continueShoppingText: {
    color: "#0a0f1a",
    fontSize: 14,
    fontWeight: "800",
  },
  cartList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1e2d45",
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#0f1624",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cartItemEmoji: {
    fontSize: 20,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    color: "#22ff88",
    fontWeight: "700",
  },
  cartItemControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quantityBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#1e2d45",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityBtnText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
  },
  quantityText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
    minWidth: 20,
    textAlign: "center",
  },
  removeBtn: {
    marginLeft: 12,
    padding: 4,
  },
  removeBtnText: {
    fontSize: 16,
  },
  cartFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#1e2d45",
    gap: 16,
  },
  cartTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartTotalLabel: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
  },
  cartTotalAmount: {
    fontSize: 18,
    color: "#22ff88",
    fontWeight: "800",
  },
  checkoutBtn: {
    backgroundColor: "#39FF14",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutBtnText: {
    color: "#0a0f1a",
    fontSize: 16,
    fontWeight: "800",
  },
});

export default Shop;
