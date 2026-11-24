import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';

export default function PanOperationCard({
  pan,
  onDecrementPortion,
  onIncrementPortion,
  onMarkReady,
  onStartPrep,
}) {
  return (
    <View style={[styles.card, { borderColor: pan.borderColor || '#EADBC0' }]}>
      {/* Cabeçalho do tacho */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.panCode}>{pan.code}</Text>
          <Text style={styles.panDishName}>{pan.dishName}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: pan.badgeBg }]}>
          <Text style={[styles.statusBadgeText, { color: pan.badgeColor }]}>
            {pan.statusLabel}
          </Text>
        </View>
      </View>

      {pan.chefInfo && (
        <View style={styles.metaIconRow}>
          <Ionicons name="people-outline" size={13} color={COLORS.cinzaTexto} />
          <Text style={styles.chefText}>{pan.chefInfo}</Text>
        </View>
      )}

      {/* Tacho servindo agora com controle de porções */}
      {pan.type === 'SERVING' && (
        <View style={styles.servingBox}>
          <View style={styles.metricsCols}>
            <View>
              <Text style={styles.metricSmallLabel}>Rendimento</Text>
              <Text style={styles.metricBoldValue}>{pan.totalYield} porções</Text>
            </View>
            <View>
              <Text style={styles.metricSmallLabel}>Restam no tacho</Text>
              <Text style={[styles.metricBoldValue, { color: COLORS.tomate }]}>
                {pan.remaining} porções
              </Text>
            </View>
          </View>

          <View style={styles.portionControls}>
            <TouchableOpacity style={styles.stepBtn} onPress={onDecrementPortion}>
              <Text style={styles.stepBtnText}>-1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.portionMainBtn} onPress={onDecrementPortion}>
              <Text style={styles.portionMainBtnText}>Porcionar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.stepBtn} onPress={onIncrementPortion}>
              <Text style={styles.stepBtnText}>+1</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Tacho em apuração do caldo */}
      {pan.type === 'COOKING' && (
        <View>
          <View style={styles.metaIconRow}>
            <Feather name="clock" size={12} color={COLORS.cinzaTexto} />
            <Text style={styles.estimateText}>{pan.estimateText}</Text>
          </View>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                { width: `${pan.progress * 100}%`, backgroundColor: COLORS.acafrao },
              ]}
            />
          </View>
          <TouchableOpacity style={styles.readyActionBtn} onPress={onMarkReady}>
            <Feather name="check-circle" size={15} color={COLORS.preto} />
            <Text style={styles.readyActionBtnText}>Marcar como pronto para servir</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tacho em fogo baixo / repouso */}
      {pan.type === 'RESTING' && (
        <View style={styles.restingRow}>
          <Text style={styles.restingMeta}>Rendimento: {pan.totalYield} un</Text>
          <View style={styles.availablePill}>
            <Text style={styles.availablePillText}>{pan.remaining} porções disponíveis</Text>
          </View>
        </View>
      )}

      {/* Tacho reserva programado */}
      {pan.type === 'SCHEDULED' && (
        <View>
          <View style={styles.metaIconRow}>
            <Feather name="calendar" size={12} color={COLORS.cinzaTexto} />
            <Text style={styles.estimateText}>{pan.scheduleNote}</Text>
          </View>
          <TouchableOpacity style={styles.startPrepBtn} onPress={onStartPrep}>
            <Ionicons name="play" size={15} color={COLORS.mediterraneo} />
            <Text style={styles.startPrepBtnText}>Iniciar preparo ({pan.code})</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.branco,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  titleWrap: {
    flex: 1,
    marginRight: 8,
  },
  panCode: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: COLORS.tomate,
    textTransform: 'uppercase',
  },
  panDishName: {
    fontSize: 16,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.preto,
    lineHeight: 21,
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
  },
  metaIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 9,
  },
  chefText: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    fontFamily: FONTS.bodyMedium,
    flex: 1,
  },
  servingBox: {
    backgroundColor: COLORS.creme,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  metricsCols: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metricSmallLabel: {
    fontSize: 10,
    color: COLORS.cinzaTexto,
    fontFamily: FONTS.bodySemiBold,
  },
  metricBoldValue: {
    fontSize: 17,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.preto,
    lineHeight: 22,
    marginTop: 2,
  },
  portionControls: {
    flexDirection: 'row',
    gap: 8,
  },
  stepBtn: {
    backgroundColor: COLORS.branco,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EADBC0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  portionMainBtn: {
    flex: 1,
    backgroundColor: COLORS.tomate,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
  },
  portionMainBtnText: {
    color: COLORS.branco,
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
  },
  estimateText: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    fontFamily: FONTS.bodyMedium,
    flex: 1,
  },
  progressBg: {
    height: 7,
    backgroundColor: '#F2E4C9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
  },
  readyActionBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.acafrao,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  readyActionBtnText: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  restingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.creme,
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  restingMeta: {
    fontSize: 12,
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.cinzaTexto,
  },
  availablePill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  availablePillText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: '#2E7D32',
  },
  startPrepBtn: {
    flexDirection: 'row',
    backgroundColor: '#E6F2F8',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.mediterraneo,
  },
  startPrepBtnText: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: COLORS.mediterraneo,
  },
});