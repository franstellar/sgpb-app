import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function TopBar({ cartCount = 0, onOpenCart, onLogout }) {
  return (
    <View style={styles.topBar}>
      <View style={styles.brandRow}>
        <View style={styles.mascotCircle}>
          <Text style={{ fontSize: 18 }}>🐂</Text>
        </View>
        <Text style={styles.brandText}>Paelito</Text>
      </View>

      <View style={styles.topActions}>
        <TouchableOpacity style={styles.cartBtn} onPress={onOpenCart}>
          <Feather name="shopping-bag" size={20} color={COLORS.preto} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileBtn} onPress={onLogout}>
          <Feather name="user" size={18} color={COLORS.branco} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.creme,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cinzaClaro,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  mascotCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE4B5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  brandText: { fontSize: 20, fontWeight: '800', color: COLORS.tomate },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cartBtn: { position: 'relative', padding: 6 },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.tomate,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: { color: COLORS.branco, fontSize: 10, fontWeight: '700' },
  profileBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.tomate,
    alignItems: 'center',
    justifyContent: 'center',
  },
});