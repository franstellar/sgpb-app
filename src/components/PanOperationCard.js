import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

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

      {pan.chefInfo && <Text style={styles.chefText}>👨‍🍳 {pan.chefInfo}</Text>}

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
          <Text style={styles.estimateText}>⏱️ {pan.estimateText}</Text>
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
          <Text style={styles.estimateText}>📅 {pan.scheduleNote}</Text>
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
    fontWeight: '900',
    color: COLORS.tomate,
    textTransform: 'uppercase',
  },
  panDishName: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.preto,
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  chefText: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    fontWeight: '600',
    marginBottom: 10,
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
    fontWeight: '700',
  },
  metricBoldValue: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.preto,
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
    fontWeight: '900',
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
    fontWeight: '800',
  },
  estimateText: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    fontWeight: '600',
    marginBottom: 8,
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
    fontWeight: '900',
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
    fontWeight: '700',
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
    fontWeight: '800',
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
    fontWeight: '800',
    color: COLORS.mediterraneo,
  },
});