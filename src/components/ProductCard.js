import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';

export default function ProductCard({ item, onAdd }) {
  return (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={styles.productImage}
        />

        {item.topLeftBadge && (
          <View style={[styles.badgeTopLeft, { backgroundColor: item.topLeftBadge.bg }]}>
            <Text style={[styles.badgeText, { color: item.topLeftBadge.color }]}>
              {item.topLeftBadge.text}
            </Text>
          </View>
        )}

        {item.topRightBadge && (
          <View style={[styles.badgeTopRight, { backgroundColor: item.topRightBadge.bg }]}>
            <Text style={[styles.badgeText, { color: item.topRightBadge.color }]}>
              {item.topRightBadge.text}
            </Text>
          </View>
        )}

        {item.bottomRightBadge && (
          <View style={[styles.badgeBottomRight, { backgroundColor: item.bottomRightBadge.bg }]}>
            <Text style={[styles.badgeText, { color: item.bottomRightBadge.color }]}>
              {item.bottomRightBadge.text}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.productBody}>
        <View style={styles.titlePriceRow}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>
            R$ {Number(item.price).toFixed(2).replace('.', ',')}
          </Text>
        </View>

        <Text style={styles.productDesc}>{item.description}</Text>

        <View style={styles.footerRow}>
          <View style={styles.perksRow}>
            <Ionicons name={item.footerIcon || 'cube-outline'} size={15} color={COLORS.cinzaTexto} />
            <Text style={styles.perkText}>{item.footerInfo || 'Pronta entrega'}</Text>
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={() => onAdd && onAdd(item)}>
            <Text style={styles.addBtnText}>+ Pedir agora</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
  },
  productImageContainer: { height: 170, position: 'relative' },
  productImage: { width: '100%', height: '100%' },
  badgeTopLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  badgeTopRight: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  badgeBottomRight: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  badgeText: { fontSize: 10, fontFamily: FONTS.bodyBold },
  productBody: { padding: 14 },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  productName: {
    fontSize: 16,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.preto,
    lineHeight: 21,
    flex: 1,
    marginRight: 8,
  },
  productPrice: {
    fontSize: 17,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.tomate,
    lineHeight: 21,
  },
  productDesc: {
    fontSize: 12,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.cinzaTexto,
    lineHeight: 17,
    marginBottom: 14,
  },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  perksRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  perkText: { fontSize: 11, color: COLORS.cinzaTexto, fontFamily: FONTS.bodyMedium },
  addBtn: {
    backgroundColor: COLORS.tomate,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
  },
  addBtnText: { color: COLORS.branco, fontSize: 12, fontFamily: FONTS.bodyBold },
});