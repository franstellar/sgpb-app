import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { COLORS } from '../theme/colors';

export default function SplashScreen() {
  return (
    <View style={styles.splashContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />
      <Text style={styles.splashMascot}>🥘🐂</Text>
      <Text style={styles.splashTitle}>PAELITO</Text>
      <Text style={styles.splashSubtitle}>Paella feita para compartilhar</Text>
      <Text style={styles.splashTag}>ABADEUS • SGPB Offline</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  splashMascot: { fontSize: 68, marginBottom: 12 },
  splashTitle: { fontSize: 42, fontWeight: '900', color: COLORS.cream, letterSpacing: 2 },
  splashSubtitle: { fontSize: 16, color: COLORS.yellow, fontWeight: '600', marginTop: 4 },
  splashTag: {
    marginTop: 32,
    color: COLORS.white,
    backgroundColor: COLORS.black,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
  },
});