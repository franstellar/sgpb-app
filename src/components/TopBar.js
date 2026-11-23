import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';

const MASCOTE_IMG = require('../../assets/images/mascote-paelito.png');

export default function TopBar({ cartCount = 0, onOpenCart, onLogout }) {
  return (
    <View style={styles.topBar}>
      <View style={styles.brandRow}>
        <Image source={MASCOTE_IMG} style={styles.mascotImg} resizeMode="contain" />
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
    paddingVertical: 10,
    backgroundColor: COLORS.creme,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cinzaClaro,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mascotImg: {
    width: 34,
    height: 34,
  },
  brandText: {
    fontSize: 22,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.tomate,
    lineHeight: 28,
  },
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
  cartBadgeText: {
    color: COLORS.branco,
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
  },
  profileBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.tomate,
    alignItems: 'center',
    justifyContent: 'center',
  },
});