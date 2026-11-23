import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import PanOperationCard from '../components/PanOperationCard';

const INITIAL_PANS = [
  {
    id: 1,
    code: 'Tacho 01',
    dishName: 'Paella de frutos do mar',
    chefInfo: 'Equipe de cozinha e voluntários',
    statusLabel: 'Servindo agora',
    badgeBg: '#E8F5E9',
    badgeColor: '#2E7D32',
    borderColor: '#2E7D32',
    type: 'SERVING',
    totalYield: 250,
    remaining: 35,
  },
  {
    id: 2,
    code: 'Tacho 02',
    dishName: 'Paella de carnes',
    statusLabel: 'Apuração do caldo',
    badgeBg: '#FFF3D1',
    badgeColor: '#B87D14',
    borderColor: COLORS.acafrao,
    type: 'COOKING',
    estimateText: 'Tempo estimado: ~12 minutos (150 porções)',
    progress: 0.72,
    totalYield: 150,
    remaining: 150,
  },
  {
    id: 3,
    code: 'Tacho 03',
    dishName: 'Paella veggie',
    statusLabel: 'Fogo baixo / repouso',
    badgeBg: '#E6F2F8',
    badgeColor: COLORS.mediterraneo,
    borderColor: '#EADBC0',
    type: 'RESTING',
    totalYield: 80,
    remaining: 40,
  },
  {
    id: 4,
    code: 'Tacho 04 reserva',
    dishName: '2ª rodada de frutos do mar (300 porções)',
    statusLabel: 'Programado: 13h15',
    badgeBg: COLORS.creme,
    badgeColor: COLORS.cinzaTexto,
    borderColor: '#EADBC0',
    type: 'SCHEDULED',
    scheduleNote: 'Insumos pesados e pré-aquecimento pronto',
    totalYield: 300,
    remaining: 300,
  },
];

const PRODUCT_STOCK_LIST = [
  {
    id: 1,
    name: 'Paella de frutos do mar (individual)',
    tag: '• Estoque crítico',
    tagBg: '#FDE8E6',
    tagColor: COLORS.tomate,
    sold: 186,
    max: 200,
    percent: 93,
    remainingText: 'Restam 14 un',
    barColor: COLORS.tomate,
  },
  {
    id: 2,
    name: 'Paella de carnes (4 pessoas)',
    tag: '90% esgotado',
    tagBg: '#FFF3D1',
    tagColor: '#B87D14',
    sold: 72,
    max: 80,
    percent: 90,
    remainingText: 'Restam 8 un',
    barColor: COLORS.acafrao,
  },
  {
    id: 3,
    name: 'Paella veggie (individual)',
    tag: 'Normal',
    tagBg: '#E8F5E9',
    tagColor: '#2E7D32',
    sold: 85,
    max: 100,
    percent: 85,
    remainingText: 'Restam 15 un',
    barColor: '#2E7D32',
  },
  {
    id: 4,
    name: 'Combo Paelito frutos do mar',
    tag: 'Combo',
    tagBg: '#FDE8B2',
    tagColor: '#8B5E08',
    sold: 88,
    max: 100,
    percent: 88,
    statusLabel: 'Em saída ativa',
    remainingText: 'Restam 12 combos',
    barColor: COLORS.tomate,
  },
  {
    id: 5,
    name: 'Refrigerante lata (350mL)',
    tag: 'Bebida',
    tagBg: '#E6F2F8',
    tagColor: COLORS.mediterraneo,
    sold: 160,
    max: 200,
    percent: 80,
    remainingText: 'Restam 40 un',
    barColor: COLORS.mediterraneo,
  },
];

export default function AdminStockScreen() {
  const [pans, setPans] = useState(INITIAL_PANS);
  const [maxCapacity, setMaxCapacity] = useState(1200);
  const [extraBatchReleased, setExtraBatchReleased] = useState(false);
  const [salesPaused, setSalesPaused] = useState(false);

  const soldUnits = 1085;
  const remainingUnits = maxCapacity - soldUnits;
  const soldPercent = ((soldUnits / maxCapacity) * 100).toFixed(1).replace('.', ',');

  const handleReleaseExtraBatch = () => {
    setMaxCapacity((prev) => prev + 200);
    setExtraBatchReleased(true);
    Alert.alert(
      'Lote extra liberado',
      '+200 porções solidárias adicionadas ao estoque disponível no aplicativo'
    );
  };

  const handleAdjustPortion = (panId, delta) => {
    setPans((prev) =>
      prev.map((p) =>
        p.id === panId ? { ...p, remaining: Math.max(0, p.remaining + delta) } : p
      )
    );
  };

  const handleMarkPanReady = (panId) => {
    setPans((prev) =>
      prev.map((p) =>
        p.id === panId
          ? {
              ...p,
              type: 'SERVING',
              statusLabel: 'Servindo agora',
              badgeBg: '#E8F5E9',
              badgeColor: '#2E7D32',
              borderColor: '#2E7D32',
            }
          : p
      )
    );
    Alert.alert('Tacho pronto', 'Tacho liberado para servir na bancada');
  };

  const handleStartPanPrep = (panId) => {
    setPans((prev) =>
      prev.map((p) =>
        p.id === panId
          ? {
              ...p,
              type: 'COOKING',
              statusLabel: 'Apuração do caldo',
              badgeBg: '#FFF3D1',
              badgeColor: '#B87D14',
              borderColor: COLORS.acafrao,
              estimateText: 'Tempo estimado: ~25 minutos (300 porções)',
              progress: 0.25,
            }
          : p
      )
    );
    Alert.alert('Preparo iniciado', 'Preparo do tacho iniciado pela equipe de cozinha');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Cabeçalho estoque e tachos */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.pageTitle}>Estoque e tachos</Text>
          <View style={styles.kitchenActiveRow}>
            <View style={styles.greenDot} />
            <Text style={styles.kitchenActiveText}>Cozinha solidária em operação</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={() => Alert.alert('Sincronizado', 'Estoque atualizado com o banco central')}
        >
          <Feather name="refresh-cw" size={14} color={COLORS.preto} />
          <Text style={styles.refreshBtnText}>Atualizar</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Card de capacidade total do evento */}
      <View style={styles.capacityCard}>
        <View style={styles.capacityTopRow}>
          <Text style={styles.capacityOverline}>Capacidade total do evento</Text>
          <View style={styles.soldPercentBadge}>
            <Text style={styles.soldPercentText}>{soldPercent}% vendido</Text>
          </View>
        </View>

        <Text style={styles.capacityBigText}>
          1.085 / {maxCapacity} un
        </Text>

        <View style={styles.capacityBarBg}>
          <View
            style={[
              styles.capacityBarFill,
              { width: `${Math.min(100, (soldUnits / maxCapacity) * 100)}%` },
            ]}
          />
        </View>

        <Text style={styles.capacitySubText}>
          {remainingUnits} restantes no {extraBatchReleased ? 'lote extra' : '1º lote'}
        </Text>
      </View>

      {/* 3. Banner de alerta: 1º lote prestes a esgotar */}
      {!extraBatchReleased && (
        <View style={styles.lotAlertCard}>
          <View style={styles.lotAlertHeader}>
            <Ionicons name="warning" size={18} color="#B87D14" />
            <Text style={styles.lotAlertTitle}>1º lote prestes a esgotar</Text>
          </View>
          <Text style={styles.lotAlertDesc}>
            Restam 115 fichas. Deseja liberar o lote extra com +200 porções beneficentes?
          </Text>
          <View style={styles.lotAlertActions}>
            <TouchableOpacity style={styles.laterBtn}>
              <Text style={styles.laterBtnText}>Mais tarde</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.releaseLotBtn}
              onPress={handleReleaseExtraBatch}
            >
              <Text style={styles.releaseLotBtnText}>Liberar lote extra</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 4. Botões de controle: pausar vendas e novo item */}
      <View style={styles.quickControlsRow}>
        <TouchableOpacity
          style={[styles.pauseSalesBtn, salesPaused && styles.pauseSalesBtnActive]}
          onPress={() => setSalesPaused((prev) => !prev)}
        >
          <Ionicons
            name={salesPaused ? 'play-circle-outline' : 'pause-circle-outline'}
            size={18}
            color={salesPaused ? COLORS.branco : COLORS.preto}
          />
          <Text
            style={[
              styles.pauseSalesText,
              salesPaused && { color: COLORS.branco },
            ]}
          >
            {salesPaused ? 'Retomar vendas' : 'Pausar vendas'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.newItemBtn}
          onPress={() =>
            Alert.alert('Novo item no cardápio', 'Abrindo cadastro de produto ou lote')
          }
        >
          <Feather name="plus" size={16} color={COLORS.branco} />
          <Text style={styles.newItemText}>Novo item</Text>
        </TouchableOpacity>
      </View>

      {/* 5. Tachos em operação */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Tachos em operação</Text>
        <View style={styles.pansCountPill}>
          <Text style={styles.pansCountPillText}>{pans.length} tachos alocados</Text>
        </View>
      </View>

      {pans.map((pan) => (
        <PanOperationCard
          key={pan.id}
          pan={pan}
          onDecrementPortion={() => handleAdjustPortion(pan.id, -1)}
          onIncrementPortion={() => handleAdjustPortion(pan.id, 1)}
          onMarkReady={() => handleMarkPanReady(pan.id)}
          onStartPrep={() => handleStartPanPrep(pan.id)}
        />
      ))}

      {/* 6. Estoque por produto */}
      <View style={[styles.sectionHeaderRow, { marginTop: 8 }]}>
        <View>
          <Text style={styles.overline}>Cardápio oficial</Text>
          <Text style={styles.sectionTitle}>Estoque por produto</Text>
        </View>
      </View>

      <View style={styles.productStockList}>
        {PRODUCT_STOCK_LIST.map((prod) => (
          <View key={prod.id} style={styles.prodStockCard}>
            <View style={styles.prodTopRow}>
              <Text style={styles.prodName}>{prod.name}</Text>
              <View style={[styles.prodTag, { backgroundColor: prod.tagBg }]}>
                <Text style={[styles.prodTagText, { color: prod.tagColor }]}>
                  {prod.tag}
                </Text>
              </View>
            </View>

            <Text style={styles.prodMetricsLine}>
              Vendidas: {prod.sold} un {prod.max ? `| Estoque máx: ${prod.max} un` : ''}
            </Text>

            <View style={styles.prodProgressBg}>
              <View
                style={[
                  styles.prodProgressFill,
                  { width: `${prod.percent}%`, backgroundColor: prod.barColor },
                ]}
              />
            </View>

            <View style={styles.prodBottomRow}>
              <Text style={styles.prodConsumptionText}>
                {prod.statusLabel || `Consumo: ${prod.percent}%`}
              </Text>
              <Text style={[styles.prodRemainingText, { color: prod.barColor }]}>
                {prod.remainingText}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* 7. Insumos e doações */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Insumos e doações</Text>
        <View style={styles.solidaryPill}>
          <Text style={styles.solidaryPillText}>100% solidário</Text>
        </View>
      </View>

      <View style={styles.inputsGrid}>
        <View style={styles.inputBox}>
          <Text style={styles.inputBigVal}>120 kg</Text>
          <Text style={styles.inputTitle}>Arroz bomba especial</Text>
          <Text style={styles.inputSub}>100% doado por cooperativa local</Text>
        </View>

        <View style={styles.inputBox}>
          <Text style={[styles.inputBigVal, { color: COLORS.mediterraneo }]}>180 kg</Text>
          <Text style={styles.inputTitle}>Frutos do mar</Text>
          <Text style={styles.inputSub}>100% doado por parceiro local</Text>
        </View>

        <View style={styles.inputBox}>
          <Text style={[styles.inputBigVal, { color: '#B87D14' }]}>Legítimo</Text>
          <Text style={styles.inputTitle}>Açafrão espanhol</Text>
          <Text style={styles.inputSub}>Lote especial garantido</Text>
        </View>

        <View style={styles.inputBox}>
          <Text style={[styles.inputBigVal, { color: '#2E7D32' }]}>95,8%</Text>
          <Text style={styles.inputTitle}>Embalagens seladas</Text>
          <Text style={styles.inputSub}>1.150/1.200 utilizadas</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.creme },
  scrollContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 100 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.preto,
  },
  kitchenActiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#2E7D32',
  },
  kitchenActiveText: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    fontWeight: '600',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.branco,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  refreshBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.preto,
  },
  capacityCard: {
    backgroundColor: COLORS.preto,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  capacityTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  capacityOverline: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D0D7DE',
    letterSpacing: 0.5,
  },
  soldPercentBadge: {
    backgroundColor: COLORS.tomate,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  soldPercentText: {
    color: COLORS.branco,
    fontSize: 10,
    fontWeight: '800',
  },
  capacityBigText: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.branco,
    marginBottom: 8,
  },
  capacityBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  capacityBarFill: {
    height: '100%',
    backgroundColor: COLORS.acafrao,
  },
  capacitySubText: {
    fontSize: 11,
    color: COLORS.acafrao,
    fontWeight: '700',
  },
  lotAlertCard: {
    backgroundColor: '#FFF3D1',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: COLORS.acafrao,
  },
  lotAlertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  lotAlertTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#7A4F08',
  },
  lotAlertDesc: {
    fontSize: 12,
    color: '#7A4F08',
    lineHeight: 17,
    marginBottom: 12,
  },
  lotAlertActions: {
    flexDirection: 'row',
    gap: 8,
  },
  laterBtn: {
    flex: 1,
    backgroundColor: COLORS.branco,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  laterBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.preto,
  },
  releaseLotBtn: {
    flex: 1.4,
    backgroundColor: COLORS.tomate,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  releaseLotBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.branco,
  },
  quickControlsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  pauseSalesBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.branco,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  pauseSalesBtnActive: {
    backgroundColor: COLORS.tomate,
    borderColor: COLORS.tomate,
  },
  pauseSalesText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.preto,
  },
  newItemBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.mediterraneo,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  newItemText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.branco,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  overline: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.tomate,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.preto,
  },
  pansCountPill: {
    backgroundColor: '#FDE8E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  pansCountPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.tomate,
  },
  productStockList: {
    gap: 10,
    marginBottom: 18,
  },
  prodStockCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  prodTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  prodName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.preto,
    flex: 1,
    marginRight: 8,
  },
  prodTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  prodTagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  prodMetricsLine: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    fontWeight: '600',
    marginBottom: 6,
  },
  prodProgressBg: {
    height: 6,
    backgroundColor: '#F2E4C9',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  prodProgressFill: {
    height: '100%',
  },
  prodBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prodConsumptionText: {
    fontSize: 10,
    color: COLORS.cinzaTexto,
    fontWeight: '700',
  },
  prodRemainingText: {
    fontSize: 10,
    fontWeight: '800',
  },
  solidaryPill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  solidaryPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2E7D32',
  },
  inputsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inputBox: {
    width: '48.4%',
    backgroundColor: COLORS.branco,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  inputBigVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.tomate,
    marginBottom: 2,
  },
  inputTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.preto,
  },
  inputSub: {
    fontSize: 10,
    color: COLORS.cinzaTexto,
    marginTop: 2,
    lineHeight: 14,
  },
});