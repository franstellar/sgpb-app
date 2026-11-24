import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import AdminTopBar from '../components/AdminTopBar';
import AdminBottomTabBar from '../components/AdminBottomTabBar';
import AdminCheckinScreen from './AdminCheckinScreen';
import AdminOrdersScreen from './AdminOrdersScreen';
import AdminStockScreen from './AdminStockScreen';

const PANS_STATUS = [
  {
    id: 1,
    name: 'Tacho 1 • Paella de frutos do mar',
    badge: '95% pronto',
    badgeBg: '#E8F5E9',
    badgeColor: '#2E7D32',
    desc: 'Servindo na bancada principal',
    progress: 0.95,
    barColor: '#2E7D32',
  },
  {
    id: 2,
    name: 'Tacho 2 • Paella de carnes',
    badge: 'Cozimento (~12 min)',
    badgeBg: '#FFF3D1',
    badgeColor: '#B87D14',
    desc: 'Apuração do caldo de açafrão',
    progress: 0.65,
    barColor: COLORS.acafrao,
  },
  {
    id: 3,
    name: 'Tacho 3 • Paella veggie',
    badge: '40 restam',
    badgeBg: '#E6F2F8',
    badgeColor: COLORS.mediterraneo,
    desc: 'Pronto para servir • Demanda pontual',
    progress: 0.5,
    barColor: COLORS.mediterraneo,
  },
];

const RECENT_PICKUPS = [
  {
    seq: '#84',
    name: 'Cliente',
    code: '#PAE-8429',
    summary: '2x Paella de carnes (individual) • Há 2 min',
    channel: 'Drive-thru',
    channelBg: '#E6F2F8',
    channelColor: COLORS.mediterraneo,
  },
  {
    seq: '#83',
    name: 'Cliente',
    code: '#PAE-8428',
    summary: 'Paella de frutos do mar (4 pessoas) • Há 5 min',
    channel: 'Salão',
    channelBg: '#FFF3D1',
    channelColor: '#8B5E08',
  },
  {
    seq: '#82',
    name: 'Cliente',
    code: '#PAE-8427',
    summary: '2x Combo Paelito carnes + Paella veggie (individual) • Há 8 min',
    channel: 'Drive-thru',
    channelBg: '#E6F2F8',
    channelColor: COLORS.mediterraneo,
  },
];

export default function AdminScreen({ user, onLogout }) {
  const initialTab = user?.role === 'VOLUNTEER' ? 'CHECKIN' : 'DASHBOARD';
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.creme} />

      <AdminTopBar user={user} onLogout={onLogout} />

      {activeTab === 'CHECKIN' && <AdminCheckinScreen user={user} />}
      {activeTab === 'ORDERS' && <AdminOrdersScreen />}
      {activeTab === 'STOCK' && <AdminStockScreen />}

      {activeTab === 'DASHBOARD' && (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Botões de ação rápida */}
          <TouchableOpacity
            style={styles.primaryQuickAction}
            onPress={() => setActiveTab('CHECKIN')}
          >
            <View style={styles.quickActionIconBox}>
              <Ionicons name="qr-code-outline" size={20} color={COLORS.branco} />
            </View>
            <Text style={styles.primaryQuickActionText}>
              Abrir leitor de QR Code (check-in expresso)
            </Text>
            <Feather name="chevron-right" size={18} color={COLORS.branco} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryQuickAction}
            onPress={() =>
              Alert.alert(
                'Venda balcão ou Pix manual',
                'Abrindo formulário rápido de venda presencial'
              )
            }
          >
            <Feather name="plus-circle" size={18} color={COLORS.preto} />
            <Text style={styles.secondaryQuickActionText}>
              Registrar venda balcão ou Pix manual
            </Text>
          </TouchableOpacity>

          {/* 2. Card principal: arrecadação solidária */}
          <View style={styles.revenueCard}>
            <View style={styles.revenueTopRow}>
              <Text style={styles.revenueOverline}>Arrecadação solidária</Text>
              <View style={styles.goalBeatBadge}>
                <Text style={styles.goalBeatText}>Meta batida 121%</Text>
              </View>
            </View>

            <Text style={styles.revenueAmount}>R$ 48.650,00</Text>

            <View style={styles.revenueProgressBg}>
              <View style={[styles.revenueProgressFill, { width: '100%' }]} />
            </View>

            <View style={styles.revenueFooterRow}>
              <Text style={styles.revenueMetaText}>Meta inicial: R$ 40.000,00</Text>
              <Text style={styles.revenueExtraText}>+18% extra</Text>
            </View>
          </View>

          {/* 3. Grid 2 colunas: porções totais e check-ins feitos */}
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <Ionicons name="restaurant-outline" size={16} color={COLORS.tomate} />
                <Text style={styles.kpiTitle}>Porções totais</Text>
              </View>
              <Text style={styles.kpiBigValue}>1.085/1.200</Text>
              <Text style={styles.kpiSubText}>90% vendidas • 115 restam</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <Feather name="check-circle" size={16} color={COLORS.mediterraneo} />
                <Text style={styles.kpiTitle}>Check-ins feitos</Text>
              </View>
              <Text style={[styles.kpiBigValue, { color: COLORS.mediterraneo }]}>
                742 (68%)
              </Text>
              <Text style={styles.kpiSubText}>343 na fila</Text>
            </View>
          </View>

          {/* 4. Barra de ticket médio beneficente */}
          <View style={styles.avgTicketCard}>
            <View style={styles.avgTicketLeft}>
              <View style={styles.avgIconCircle}>
                <Feather name="trending-up" size={16} color="#8B5E08" />
              </View>
              <Text style={styles.avgTicketLabel}>Ticket médio beneficente</Text>
            </View>
            <Text style={styles.avgTicketValue}>R$ 68,40 / pedido</Text>
          </View>

          {/* 5. Fluxo de entrega */}
          <Text style={styles.sectionTitle}>Fluxo de entrega</Text>

          <View style={styles.kpiRow}>
            <View style={styles.flowCard}>
              <View style={styles.flowTopRow}>
                <Text style={styles.flowChannelTitle}>Drive-thru</Text>
                <View style={styles.highAdhesionBadge}>
                  <Text style={styles.highAdhesionText}>Alta adesão</Text>
                </View>
              </View>
              <Text style={styles.flowNumber}>520</Text>
              <Text style={styles.flowUnitLabel}>porções entregues</Text>
              <View style={styles.flowDivider} />
              <View style={styles.flowMetricRow}>
                <Feather name="clock" size={12} color={COLORS.tomate} />
                <Text style={styles.flowMetricBold}>1 min 45s / carro</Text>
              </View>
              <Text style={styles.flowStatusNote}>Fila rápida fluindo</Text>
            </View>

            <View style={styles.flowCard}>
              <View style={styles.flowTopRow}>
                <Text style={styles.flowChannelTitle}>Salão local</Text>
                <View style={styles.liveSmallBadge}>
                  <Text style={styles.liveSmallText}>Ao vivo</Text>
                </View>
              </View>
              <Text style={[styles.flowNumber, { color: COLORS.mediterraneo }]}>222</Text>
              <Text style={styles.flowUnitLabel}>porções servidas</Text>
              <View style={styles.flowDivider} />
              <View style={styles.flowMetricRow}>
                <Ionicons name="restaurant-outline" size={12} color={COLORS.mediterraneo} />
                <Text style={styles.flowMetricBold}>Mesas cheias</Text>
              </View>
              <Text style={styles.flowStatusNote}>Confraternização ativa</Text>
            </View>
          </View>

          {/* 6. Status dos tachos de paella */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Status dos tachos de paella</Text>
            <View style={styles.pansCountBadge}>
              <Text style={styles.pansCountText}>3 em operação</Text>
            </View>
          </View>

          <View style={styles.pansContainer}>
            {PANS_STATUS.map((pan) => (
              <View key={pan.id} style={styles.panCard}>
                <View style={styles.panHeader}>
                  <Text style={styles.panTitle} numberOfLines={1}>
                    {pan.name}
                  </Text>
                  <View style={[styles.panBadge, { backgroundColor: pan.badgeBg }]}>
                    <Text style={[styles.panBadgeText, { color: pan.badgeColor }]}>
                      {pan.badge}
                    </Text>
                  </View>
                </View>
                <Text style={styles.panDesc}>{pan.desc}</Text>
                <View style={styles.panProgressBg}>
                  <View
                    style={[
                      styles.panProgressFill,
                      { width: `${pan.progress * 100}%`, backgroundColor: pan.barColor },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* 7. Últimos pedidos retirados */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Últimos pedidos retirados</Text>
            <TouchableOpacity onPress={() => setActiveTab('ORDERS')}>
              <Text style={styles.seeAllLink}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentList}>
            {RECENT_PICKUPS.map((item) => (
              <View key={item.code} style={styles.recentCard}>
                <View style={styles.seqCircle}>
                  <Text style={styles.seqText}>{item.seq}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.recentTopLine}>
                    <Text style={styles.recentName}>{item.name}</Text>
                    <Text style={styles.recentCode}>{item.code}</Text>
                  </View>
                  <Text style={styles.recentSummary}>{item.summary}</Text>
                </View>

                <View style={[styles.channelPill, { backgroundColor: item.channelBg }]}>
                  <Text style={[styles.channelPillText, { color: item.channelColor }]}>
                    {item.channel}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* 8. Rodapé solidariedade */}
          <View style={styles.footerBanner}>
            <Ionicons name="heart" size={18} color={COLORS.tomate} />
            <View style={{ flex: 1 }}>
              <Text style={styles.footerBannerTitle}>Solidariedade que alimenta vidas</Text>
              <Text style={styles.footerBannerDesc}>
                100% dos recursos vão para os programas de educação e qualificação da ABADEUS
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      <AdminBottomTabBar activeTab={activeTab} onChangeTab={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.creme },
  container: { flex: 1, backgroundColor: COLORS.creme },
  scrollContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 100 },
  primaryQuickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tomate,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    elevation: 3,
    gap: 10,
  },
  quickActionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryQuickActionText: {
    flex: 1,
    color: COLORS.branco,
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
  },
  secondaryQuickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.acafrao,
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 8,
  },
  secondaryQuickActionText: {
    color: COLORS.preto,
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
  },
  revenueCard: {
    backgroundColor: COLORS.mediterraneo,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
  },
  revenueTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  revenueOverline: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: '#CFE6F2',
    letterSpacing: 0.6,
  },
  goalBeatBadge: {
    backgroundColor: COLORS.acafrao,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  goalBeatText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  revenueAmount: {
    fontSize: 32,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.branco,
    lineHeight: 38,
    marginBottom: 10,
  },
  revenueProgressBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  revenueProgressFill: {
    height: '100%',
    backgroundColor: COLORS.acafrao,
  },
  revenueFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  revenueMetaText: {
    fontSize: 11,
    color: '#E0F0F8',
    fontFamily: FONTS.bodyMedium,
  },
  revenueExtraText: {
    fontSize: 11,
    color: COLORS.acafrao,
    fontFamily: FONTS.bodyBold,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  kpiCard: {
    width: '48.4%',
    backgroundColor: COLORS.branco,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  kpiTitle: {
    fontSize: 12,
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.cinzaTexto,
  },
  kpiBigValue: {
    fontSize: 21,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.tomate,
    lineHeight: 26,
    marginBottom: 2,
  },
  kpiSubText: {
    fontSize: 10,
    color: COLORS.cinzaTexto,
    fontFamily: FONTS.bodyMedium,
  },
  avgTicketCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FDF1D6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#F3DFB3',
  },
  avgTicketLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avgIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.acafrao,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avgTicketLabel: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  avgTicketValue: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: COLORS.tomate,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.preto,
    marginBottom: 8,
  },
  seeAllLink: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: COLORS.tomate,
  },
  flowCard: {
    width: '48.4%',
    backgroundColor: COLORS.branco,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  flowTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  flowChannelTitle: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  highAdhesionBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  highAdhesionText: {
    fontSize: 8,
    fontFamily: FONTS.bodyBold,
    color: '#2E7D32',
  },
  liveSmallBadge: {
    backgroundColor: '#FFF3D1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveSmallText: {
    fontSize: 8,
    fontFamily: FONTS.bodyBold,
    color: '#B87D14',
  },
  flowNumber: {
    fontSize: 26,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.tomate,
    lineHeight: 30,
  },
  flowUnitLabel: {
    fontSize: 10,
    color: COLORS.cinzaTexto,
    fontFamily: FONTS.bodyMedium,
  },
  flowDivider: {
    height: 1,
    backgroundColor: '#F2E4C9',
    marginVertical: 8,
  },
  flowMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  flowMetricBold: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  flowStatusNote: {
    fontSize: 10,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.cinzaTexto,
    marginTop: 2,
  },
  pansCountBadge: {
    backgroundColor: '#FDE8E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  pansCountText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: COLORS.tomate,
  },
  pansContainer: {
    marginBottom: 16,
    gap: 10,
  },
  panCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  panHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  panTitle: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
    flex: 1,
    marginRight: 8,
  },
  panBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  panBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
  },
  panDesc: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.cinzaTexto,
    marginBottom: 8,
  },
  panProgressBg: {
    height: 6,
    backgroundColor: '#F2E4C9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  panProgressFill: {
    height: '100%',
  },
  recentList: {
    gap: 8,
    marginBottom: 18,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.branco,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EADBC0',
    gap: 10,
  },
  seqCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.creme,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  seqText: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: COLORS.tomate,
  },
  recentTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recentName: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  recentCode: {
    fontSize: 11,
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.cinzaTexto,
  },
  recentSummary: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.cinzaTexto,
    marginTop: 2,
  },
  channelPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  channelPillText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
  },
  footerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF1D6',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#F3DFB3',
  },
  footerBannerTitle: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  footerBannerDesc: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.cinzaTexto,
    marginTop: 2,
    lineHeight: 16,
  },
});