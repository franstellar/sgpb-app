import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.tomate} />

      <View style={styles.centerContent}>
        {/* Pílula da edição */}
        <View style={styles.editionPill}>
          <View style={styles.yellowDot} />
          <Text style={styles.editionText}>12ª edição solidária • 2026</Text>
        </View>

        {/* Círculo do mascote / ícone principal */}
        <View style={styles.logoOuterRing}>
          <View style={styles.logoInnerCircle}>
            <Text style={styles.logoEmoji}>🥘</Text>
          </View>
        </View>

        {/* Marca Paelito */}
        <Text style={styles.brandTitle}>Paelito</Text>
        <Text style={styles.brandTagline}>
          Paella feita para compartilhar{'\n'}Sabor que transforma vidas!
        </Text>

        {/* Selo ABADEUS */}
        <View style={styles.abadeusBadge}>
          <Ionicons name="heart" size={14} color={COLORS.tomate} />
          <Text style={styles.abadeusBadgeText}>100% beneficente • ABADEUS Criciúma/SC</Text>
        </View>
      </View>

      {/* Rodapé de carregamento */}
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.acafrao} />
        <Text style={styles.loadingText}>Aquecendo os tachos solidários...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.tomate,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
    gap: 6,
  },
  yellowDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.acafrao,
  },
  editionText: {
    color: COLORS.creme,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  logoOuterRing: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: 'rgba(244, 184, 42, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderWidth: 2,
    borderColor: COLORS.acafrao,
  },
  logoInnerCircle: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: COLORS.creme,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  logoEmoji: {
    fontSize: 48,
  },
  brandTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: COLORS.branco,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 14,
    color: '#FFE4E1',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 20,
    fontWeight: '600',
  },
  abadeusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.creme,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    gap: 6,
  },
  abadeusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.preto,
  },
  footer: {
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: COLORS.creme,
    fontSize: 12,
    fontWeight: '700',
  },
});