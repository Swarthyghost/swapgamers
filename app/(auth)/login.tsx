import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'

const Login = () => {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1a" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Nav */}
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.navBtn} onPress={() => router.back()}>
            <Text style={styles.navBtnText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn}>
            <Text style={styles.navBtnText}>?</Text>
          </TouchableOpacity>
        </View>

        {/* Brand Badge */}
        <View style={styles.brandBadge}>
          <View style={styles.brandAvatar}>
            <Text style={styles.brandAvatarText}>SG</Text>
          </View>
          <Text style={styles.brandName}>SwapGamer GH</Text>
        </View>

        {/* Hero Text */}
        <Text style={styles.heroTitle}>Login and get back to your next swap.</Text>
        <Text style={styles.heroSubtitle}>
          Sign in to manage your subscription, request discs in Accra and Kumasi, and shop
          accessories with Mobile Money checkout.
        </Text>

        {/* Tab Toggle */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.tabInactive} onPress={() => router.replace('/(auth)/signup')}>
            <Text style={styles.tabInactiveText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabActive}>
            <Text style={styles.tabActiveText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email or Phone */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email or phone number</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="kofi@example.com / 024 000 0..."
                placeholderTextColor="#3a4460"
                value={identifier}
                onChangeText={setIdentifier}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={[styles.input, styles.inputFlex]}
                placeholder="•••••••••"
                placeholderTextColor="#3a4460"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.forgotText}>Forgot?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Log In Button */}
          <TouchableOpacity style={styles.loginBtn} activeOpacity={0.85} onPress={() => router.replace('/home' as any)}>
            <Text style={styles.loginBtnText}>Log In</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Button */}
          <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85}>
            <Text style={styles.googleIcon}>⊙</Text>
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Mobile Money Card */}
        <View style={styles.momoCard}>
          <View style={styles.momoCardHeader}>
            <Text style={styles.momoCardTitle}>Set up Mobile Money</Text>
            <View style={styles.fastBadge}>
              <Text style={styles.fastBadgeText}>Fast checkout</Text>
            </View>
          </View>
          <Text style={styles.momoCardDesc}>
            Link your preferred wallet now and pay for swaps, subscriptions, and accessories in
            seconds.
          </Text>
          <View style={styles.momoOptions}>
            <TouchableOpacity style={styles.momoOption} activeOpacity={0.8}>
              <Text style={styles.momoOptionIcon}>📱</Text>
              <Text style={styles.momoOptionText}>MTN MoMo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.momoOption} activeOpacity={0.8}>
              <Text style={styles.momoOptionIcon}>💳</Text>
              <Text style={styles.momoOptionText}>Telecel Cash</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Terms */}
        <Text style={styles.termsText}>
          By continuing, you agree to SwapGamer GH terms and confirm you are ready to swap, play,
          and repeat.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1a',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 40,
  },

  // Top Nav
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1e2d45',
  },
  navBtnText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },

  // Brand Badge
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1e35',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  brandAvatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#0d9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandAvatarText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  brandName: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },

  // Hero
  heroTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    letterSpacing: -0.6,
    marginBottom: 12,
  },
  heroSubtitle: {
    color: '#5a6a8a',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 28,
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tabInactive: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 9,
  },
  tabInactiveText: {
    color: '#4a5568',
    fontSize: 15,
    fontWeight: '600',
  },
  tabActive: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 9,
    backgroundColor: '#22ff88',
  },
  tabActiveText: {
    color: '#0a0f1a',
    fontSize: 15,
    fontWeight: '800',
  },

  // Form
  form: {
    gap: 16,
    marginBottom: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: '#c8d0e0',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e2d45',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  inputIcon: {
    fontSize: 14,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 15,
    padding: 0,
  },
  inputFlex: {
    flex: 1,
  },
  forgotText: {
    color: '#22ff88',
    fontSize: 14,
    fontWeight: '600',
  },

  // Login Button
  loginBtn: {
    backgroundColor: '#22ff88',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#22ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  loginBtnText: {
    color: '#0a0f1a',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1e2d45',
  },
  dividerText: {
    color: '#3a4460',
    fontSize: 12,
    fontWeight: '500',
  },

  // Google Button
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f1e35',
    borderRadius: 10,
    paddingVertical: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  googleIcon: {
    fontSize: 16,
  },
  googleBtnText: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '600',
  },

  // Mobile Money Card
  momoCard: {
    backgroundColor: '#0f1624',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1e2d45',
  },
  momoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  momoCardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  fastBadge: {
    backgroundColor: 'rgba(34,255,136,0.12)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(34,255,136,0.25)',
  },
  fastBadgeText: {
    color: '#22ff88',
    fontSize: 11,
    fontWeight: '700',
  },
  momoCardDesc: {
    color: '#5a6a8a',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  momoOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  momoOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#1e2d45',
  },
  momoOptionIcon: {
    fontSize: 15,
  },
  momoOptionText: {
    color: '#c8d0e0',
    fontSize: 13,
    fontWeight: '600',
  },

  // Terms
  termsText: {
    color: '#3a4460',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
})

export default Login