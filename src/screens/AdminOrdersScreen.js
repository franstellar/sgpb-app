import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import AdminOrderCard from '../components/AdminOrderCard';

const INITIAL_ADMIN_ORDERS = [
  {
    id: 8430,
    code: '#PAE-8430',
    status: 'PAID_WAITING',
    amount: 90.0,
    timeLabel: 'Há 4 min',
    customer: 'Cliente',
    phone: '(48) 99124-5511',
    itemsSummary: '2x Paella tradicional (450g)',
    unitPriceNote: 'R$ 45,00 un',
    channelTag: 'Drive-thru pista A • Sem fila',
    channelIcon: 'car-sport-outline',
  },
  {
    id: 8429,
    code: '#PAE-8429',
    status: 'DELIVERED_DRIVE',
    amount: 102.0,
    timeLabel: 'Hoje, 12:44',
    customer: 'Cliente',
    phone: '(48) 99842-1082',
    itemsSummary: 'Paella tradicional individual + Combo Paelito + Kit pedagógico ABADEUS',
    channelTag: 'Drive-thru • Creta prata (QIX-4920)',
    channelIcon: 'car-sport-outline',
    validatedBy: 'Validado no posto 01',
    pixId: 'Pix ID: e81b...902a',
  },
  {
    id: 8435,
    code: '#PAE-8435',
    status: 'PENDING_PIX',
    amount: 120.0,
    timeLabel: 'Expira em 08:35 min',
    customer: 'Cliente',
    phone: '(48) 98811-2049',
    itemsSummary: 'Paella tradicional para compartilhar',
    channelTag: 'Retirada balcão geral',
    channelIcon: 'storefront-outline',
  },
  {
    id: 8420,
    code: '#PAE-8420',
    status: 'DELIVERED_SALON',
    amount: 138.0,
    timeLabel: 'Hoje, 12:15',
    customer: 'Cliente',
    phone: '(48) 99650-3321',
    itemsSummary: '2x Combo Paelito + Churros artesanais + Doação extra R$ 10',
    channelTag: 'Mesa 12 • Salão principal',
    channelIcon: 'restaurant-outline',
    extraBadge: '+ R$ 10,00 Robótica ABADEUS',
    validatedBy: 'Validado no posto salão',
  },
];

const FILTER_TABS = [
  { key: 'ALL', label: 'Todos 712' },
  { key: 'PAID', label: 'Pagos e liberados 589' },
  { key: 'PENDING', label: 'Aguardando Pix 42' },
];

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState(INITIAL_ADMIN_ORDERS);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  const handleMarkDelivered = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'DELIVERED_DRIVE',
              timeLabel: 'Agora mesmo',
              validatedBy: 'Validado pela coordenação',
              pixId: 'Pix ID: a94f...331c',
            }
          : o
      )
    );
    Alert.alert('Entrega registrada', 'Pedido marcado como entregue e recibo emitido');
  };

  const handleCancelOrder = (orderId) => {
    Alert.alert(
      'Cancelar pedido pendente?',
      'As porções reservadas voltam para o estoque disponível',
      [
        { text: 'Voltar', style: 'cancel' },
        {
          text: 'Confirmar cancelamento',
          style: 'destructive',
          onPress: () => {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === orderId
                  ? { ...o, status: 'CANCELLED', timeLabel: 'Cancelado pelo admin' }
                  : o
              )
            );
          },
        },
      ]
    );
  };

  const handleRefundOrder = (orderId) => {
    Alert.alert(
      'Reembolsar pedido pago',
      'Confirma o estorno via Pix com justificativa e devolução ao estoque?',
      [
        { text: 'Voltar', style: 'cancel' },
        {
          text: 'Confirmar reembolso',
          style: 'destructive',
          onPress: () => {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === orderId
                  ? { ...o, status: 'REFUNDED', timeLabel: 'Reembolsado pelo admin' }
                  : o
              )
            );
          },
        },
      ]
    );
  };

  const filteredOrders = orders.filter((o) => {
    const matchesTab =
      activeFilter === 'ALL' ||
      (activeFilter === 'PAID' && o.status !== 'PENDING_PIX') ||
      (activeFilter === 'PENDING' && o.status === 'PENDING_PIX');

    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      o.code.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.phone.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Cabeçalho da página */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.pageTitle}>Gestão de pedidos</Text>
          <Text style={styles.pageSub}>Festival Solidário ABADEUS 2026</Text>
        </View>
        <View style={styles.pixDirectBadge}>
          <Ionicons name="flash" size={12} color={COLORS.mediterraneo} />
          <Text style={styles.pixDirectText}>100% Pix direto</Text>
        </View>
      </View>

      {/* 2. Mini cards financeiros do topo */}
      <View style={styles.topStatsRow}>
        <View style={[styles.statBox, styles.statBoxPrimary]}>
          <Text style={styles.statOverlineLight}>Arrecadação total</Text>
          <Text style={styles.statBigValueLight}>R$ 48.650,00</Text>
          <Text style={styles.statFootLight}>Meta: R$ 50k • 97,3% concluído</Text>
        </View>

        <View style={styles.statSideCol}>
          <View style={styles.statSmallBox}>
            <View style={styles.statSmallHeader}>
              <Text style={styles.statSmallLabel}>Pedidos</Text>
              <Text style={styles.statSmallDate}>Hoje</Text>
            </View>
            <Text style={styles.statSmallValue}>712</Text>
          </View>

         <View style={styles.statSmallBox}>
            <Text style={styles.statSmallLabel}>Ticket médio</Text>
            <Text style={[styles.statSmallValue, { color: COLORS.mediterraneo }]}>
              R$ 68,30
            </Text>
            <Text style={styles.statSmallGain}>+14% vs meta</Text>
          </View>
        </View>
      </View>

      {/* 3. Barra exportar CSV e filtro de data */}
      <View style={styles.toolbarRow}>
        <TouchableOpacity
          style={styles.csvBtn}
          onPress={() =>
            Alert.alert('Exportar CSV', 'Planilha de pedidos e conciliação Pix gerada')
          }
        >
          <Feather name="download" size={14} color={COLORS.preto} />
          <Text style={styles.csvBtnText}>Exportar CSV</Text>
        </TouchableOpacity>

        <View style={styles.liveDayPill}>
          <View style={styles.greenDot} />
          <Text style={styles.liveDayText}>Hoje (ao vivo)</Text>
        </View>
      </View>

      {/* 4. Campo de busca */}
      <View style={styles.searchWrap}>
        <Feather name="search" size={16} color={COLORS.cinzaTexto} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por #PAE-, comprador ou telefone"
          placeholderTextColor={COLORS.cinzaTexto}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* 5. Pílulas de filtro */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={{ gap: 8, paddingRight: 16 }}
      >
        {FILTER_TABS.map((tab) => {
          const active = activeFilter === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterPill, active && styles.filterPillActive]}
              onPress={() => setActiveFilter(tab.key)}
            >
              <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.syncStatusRow}>
        <View style={styles.syncDot} />
        <Text style={styles.syncStatusText}>Fluxo em tempo real • Sincronizado agora</Text>
      </View>

      {/* 6. Lista de cards de pedidos */}
      {filteredOrders.map((order) => (
        <AdminOrderCard
          key={order.id}
          order={order}
          onMarkDelivered={handleMarkDelivered}
          onCancelOrder={handleCancelOrder}
          onRefundOrder={handleRefundOrder}
        />
      ))}

      {/* Botão carregar mais */}
      <TouchableOpacity
        style={styles.loadMoreBtn}
        onPress={() => Alert.alert('Paginação', 'Carregando próximo lote de pedidos da API')}
      >
        <Feather name="refresh-cw" size={14} color={COLORS.preto} />
        <Text style={styles.loadMoreText}>Carregar mais pedidos (692 restantes)</Text>
      </TouchableOpacity>

      {/* 7. Card balanço e repasse ABADEUS */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceTopRow}>
          <View>
            <Text style={styles.balanceTitle}>Balanço e repasse ABADEUS</Text>
            <Text style={styles.balanceSub}>Transparência solidária oficial</Text>
          </View>
          <View style={styles.auditedBadge}>
            <Ionicons name="shield-checkmark" size={13} color="#2E7D32" />
            <Text style={styles.auditedBadgeText}>Auditado</Text>
          </View>
        </View>

        <View style={styles.balanceLine}>
          <Text style={styles.balanceLabel}>Arrecadação bruta operada:</Text>
          <Text style={styles.balanceValue}>R$ 48.650,00</Text>
        </View>

        <View style={styles.balanceLine}>
          <Text style={styles.balanceLabel}>Custo de insumos e embalagens:</Text>
          <Text style={[styles.balanceValue, { color: '#2E7D32' }]}>
            R$ 0,00 (100% patrocinado)
          </Text>
        </View>

        <View style={styles.balanceDivider} />

        <View style={styles.balanceLine}>
          <Text style={styles.balanceNetLabel}>Destinação a projetos sociais:</Text>
          <Text style={styles.balanceNetValue}>R$ 48.650,00</Text>
        </View>

        {/* Pílulas dos projetos */}
        <View style={styles.projectsRow}>
          <View style={styles.projectPill}>
            <Ionicons name="hardware-chip-outline" size={12} color={COLORS.mediterraneo} />
            <Text style={styles.projectPillText}>Oficinas de robótica</Text>
          </View>
          <View style={styles.projectPill}>
            <Ionicons name="musical-notes-outline" size={12} color="#8B5E08" />
            <Text style={styles.projectPillText}>Música juvenil</Text>
          </View>
          <View style={styles.projectPill}>
            <Ionicons name="heart" size={12} color={COLORS.tomate} />
            <Text style={styles.projectPillText}>Assistência às famílias</Text>
          </View>
        </View>

        <View style={styles.pixInstitutionFooter}>
          <Text style={styles.pixInstitutionLabel}>Chave Pix oficial da instituição:</Text>
          <Text style={styles.pixInstitutionKey}>abadeus@abadeus.org.br</Text>
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
    fontSize: 23,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.preto,
    lineHeight: 28,
  },
  pageSub: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    fontFamily: FONTS.bodyMedium,
  },
  pixDirectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F2F8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  pixDirectText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: COLORS.mediterraneo,
  },
  topStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10,
  },
  statBox: {
    flex: 1.15,
    borderRadius: 16,
    padding: 14,
    justifyContent: 'space-between',
  },
  statBoxPrimary: {
    backgroundColor: COLORS.tomate,
  },
  statOverlineLight: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: '#FFE4E1',
  },
  statBigValueLight: {
    fontSize: 23,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.branco,
    lineHeight: 28,
    marginVertical: 4,
  },
  statFootLight: {
    fontSize: 10,
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.acafrao,
  },
  statSideCol: {
    flex: 1,
    gap: 8,
  },
  statSmallBox: {
    backgroundColor: COLORS.branco,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  statSmallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statSmallLabel: {
    fontSize: 10,
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.cinzaTexto,
  },
  statSmallDate: {
    fontSize: 9,
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.cinzaTexto,
  },
  statSmallGain: {
    fontSize: 9,
    fontFamily: FONTS.bodyBold,
    color: '#2E7D32',
  },
  statSmallValue: {
    fontSize: 18,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.preto,
    marginTop: 2,
  },
  toolbarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  csvBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.branco,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  csvBtnText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  liveDayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
  },
  liveDayText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: '#2E7D32',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.branco,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EADBC0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 12,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.preto,
  },
  filtersScroll: {
    marginBottom: 10,
  },
  filterPill: {
    backgroundColor: COLORS.branco,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  filterPillActive: {
    backgroundColor: COLORS.preto,
    borderColor: COLORS.preto,
  },
  filterPillText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  filterPillTextActive: {
    color: COLORS.branco,
  },
  syncStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.mediterraneo,
  },
  syncStatusText: {
    fontSize: 11,
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.mediterraneo,
  },
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.branco,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#EADBC0',
    marginBottom: 18,
  },
  loadMoreText: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  balanceCard: {
    backgroundColor: '#FDF1D6',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.acafrao,
  },
  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  balanceTitle: {
    fontSize: 17,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.preto,
  },
  balanceSub: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    fontFamily: FONTS.bodyMedium,
  },
  auditedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  auditedBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: '#2E7D32',
  },
  balanceLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  balanceLabel: {
    flex: 1,
    fontSize: 12,
    color: COLORS.cinzaTexto,
    fontFamily: FONTS.bodyMedium,
    lineHeight: 17,
  },
  balanceValue: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
    textAlign: 'right',
    flexShrink: 1,
    maxWidth: '48%',
    lineHeight: 17,
  },
  balanceDivider: {
    height: 1,
    backgroundColor: '#E6D2A8',
    marginVertical: 8,
  },
  balanceNetLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  balanceNetValue: {
    fontSize: 18,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.tomate,
    textAlign: 'right',
  },
  pixInstitutionFooter: {
    backgroundColor: COLORS.branco,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2,
  },
  pixInstitutionLabel: {
    fontSize: 10,
    color: COLORS.cinzaTexto,
    fontFamily: FONTS.bodySemiBold,
  },
  pixInstitutionKey: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    color: COLORS.mediterraneo,
  },
});