import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';

export default function CatalogGridItem({ item, quantity = 0, onIncrement, onDecrement }) {
  return (
    <View style={[styles.card, quantity > 0 && styles.cardSelected]}>
      <View style={styles.imageWrap}>
        <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.image} />

        {item.badge && (
          <View style={[styles.badge, { backgroundColor: item.badge.bg }]}>
            <Text style={[styles.badgeText, { color: item.badge.color }]}>
              {item.badge.text}
            </Text>
          </View>
        )}

        {!!item.weight && (
          <View style={styles.weightBadge}>
            <Text style={styles.weightBadgeText}>{item.weight}</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <View>
          <Text style={styles.name} numberOfLines={2}>
            {item.shortName || item.name}
          </Text>

          <Text style={styles.desc} numberOfLines={2}>
            {item.shortDesc || item.description}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>
            R$ {Number(item.price).toFixed(2).replace('.', ',')}
          </Text>

          <View style={styles.stepper}>
            <TouchableOpacity
              style={[styles.stepBtn, quantity === 0 && styles.stepBtnDisabled]}
              onPress={onDecrement}
              disabled={quantity === 0}
            >
              <Text style={styles.stepBtnText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyText}>{quantity}</Text>

            <TouchableOpacity style={styles.stepBtnPlus} onPress={onIncrement}>
              <Text style={styles.stepBtnPlusText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48.2%',
    backgroundColor: COLORS.branco,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#EADBC0',
    elevation: 2,
  },
  cardSelected: {
    borderColor: COLORS.tomate,
  },
  imageWrap: {
    height: 105,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  weightBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  weightBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.preto,
  },
  body: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.preto,
    lineHeight: 16,
    minHeight: 32,
    marginBottom: 4,
  },
  desc: {
    fontSize: 10,
    color: COLORS.cinzaTexto,
    lineHeight: 14,
    marginBottom: 10,
    minHeight: 28,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.tomate,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.creme,
    borderRadius: 14,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 6,
  },
  stepBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    opacity: 0.4,
  },
  stepBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.preto,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.preto,
    minWidth: 12,
    textAlign: 'center',
  },
  stepBtnPlus: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.tomate,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnPlusText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.branco,
  },
});