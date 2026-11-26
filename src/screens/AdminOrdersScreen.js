import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import AdminOrderCard from '../components/AdminOrderCard';
import { api } from '../services/api';

export default function AdminOrdersScreen({ user }) {
  const isAdmin = user?.role === 'ADMIN';
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({ confirmedRevenue: 0, totalOrders: 0, averageTicket: 0 });
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Modal de reembolso com justificativa obrigatória
  const [refundOrderId, setRefundOrderId] = useState(null);
  const [refundReason, setRefundReason] = useState('');

  // Modal de auditoria
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);

  const loadOrders = useCallback(async () => {
    try {
      const [rawOrders, dash] = await Promise.all([
        api.listOrders(),
        isAdmin ? api.getDashboard() : Promise.resolve(null),
      ]);

      if (dash) setMetrics(dash);

      const mapped = (rawOrders || []).map((o) => {
        const uiStatus =
          o.status === 'PAID'
            ? 'PAID_WAITING'
            : o.status === 'PICKED_UP'
            ? 'DELIVERED_DRIVE'
            : o.status === 'PENDING'
            ? 'PENDING_PIX'
            : o.status;

        return {
          id: o.id,
          rawOrderNumber: o.orderNumber,
          code: `#${o.orderNumber}`,
          status: uiStatus,
          rawStatus: o.status,
          amount: Number(o.totalAmount || 0),
          timeLabel: o.createdAt
            ? new Date(o.createdAt).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Hoje',
          customer: o.user?.name || 'Cliente',
          phone: o.user?.phone || '(48) 99842-1082',
          itemsSummary: `Pedido #${o.orderNumber} (${o.origin || 'APP'})`,
          channelTag: `Origem: ${o.origin || 'APP'}`,
          channelIcon: 'storefront-outline',
          extraBadge:
            Number(o.donationAmount) > 0
              ? `+ R$ ${Number(o.donationAmount).toFixed(2).replace('.', ',')} doação`
              : null,
          validatedBy: o.status === 'PICKED_UP' ? 'Retirada validada' : null,
          pixId: `Status API: ${o.status}`,
        };
      });

      setOrders(mapped.reverse());
    } catch (err) {
      Alert.alert('Erro ao carregar pedidos', err.message);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleMarkDelivered = async (orderId) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    try {
      await api.validatePickup(target.rawOrderNumber, user?.id || 1, 'MANUAL_CODE');
      Alert.alert('Entrega registrada', `Pedido ${target.code} marcado como entregue.`);
      loadOrders();
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  const handleCancelOrder = (orderId) => {
    if (!isAdmin) {
      Alert.alert('Acesso restrito', 'Apenas o Administrador pode cancelar pedidos.');
      return;
    }
    Alert.alert('Cancelar pedido pendente?', 'As porções voltam automaticamente ao estoque.', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Confirmar cancelamento',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.cancelOrder(orderId, user?.id || 1, 'Cancelado pelo administrador');
            loadOrders();
          } catch (err) {
            Alert.alert('Erro', err.message);
          }
        },
      },
    ]);
  };

  const handleOpenRefund = (orderId) => {
    if (!isAdmin) {
      Alert.alert('Acesso restrito', 'Apenas o Administrador pode reembolsar pedidos.');
      return;
    }
    setRefundOrderId(orderId);
    setRefundReason('');
  };

  const handleConfirmRefund = async () => {
    if (!refundReason.trim()) {
      Alert.alert('Justificativa obrigatória', 'Informe o motivo do reembolso para auditoria.');
      return;
    }
    try {
      await api.refundOrder(refundOrderId, user?.id || 1, refundReason.trim());
      setRefundOrderId(null);
      Alert.alert('Reembolso registrado', 'Pedido estornado e estoque devolvido.');
      loadOrders();
    } catch (err) {
      Alert.alert('Erro no reembolso', err.message);
    }
  };

  const handleViewHistory = async (orderId) => {
    try {
      const history = await api.getOrderHistory(orderId);
      setHistoryItems(history || []);
      setHistoryModalVisible(true);
    } catch (err) {
      Alert.alert('Auditoria', err.message);
    }
  };

  const handleExportCsv = async () => {
    const header = 'Codigo;Cliente;Telefone;Status;Valor;Origem\n';
    const rows = orders
      .map(
        (o) =>
          `${o.rawOrderNumber};${o.customer};${o.phone};${o.rawStatus};${o.amount.toFixed(2)};${o.channelTag}`
      )
      .join('\n');
    const csv = header + rows;

    if (Platform.OS === 'web') {
      Alert.alert('CSV gerado', `${orders.length} pedidos prontos para exportação.`);
      return;
    }

    try {
      const fileUri = `${FileSystem.cacheDirectory}pedidos_paelito_abadeus.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: 'text/csv' });
      } else {
        Alert.alert('CSV salvo', `Arquivo salvo em: ${fileUri}`);
      }
    } catch (err) {
      Alert.alert('Erro ao exportar CSV', err.message);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesTab =
      activeFilter === 'ALL' ||
      (activeFilter === 'PAID' && (o.rawStatus === 'PAID' || o.rawStatus === 'PICKED_UP')) ||
      (activeFilter === 'PENDING' && o.rawStatus === 'PENDING');

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
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.pageTitle}>Gestão de pedidos</Text>
          <Text style={styles.pageSub}>Festival Solidário ABADEUS 2026</Text>
        </View>
        <TouchableOpacity style={styles.refreshPill} onPress={loadOrders}>
          <Feather name="refresh-cw" size={13} color={COLORS.mediterraneo} />
          <Text style={styles.pixDirectText}>Atualizar</Text>
        </TouchableOpacity>
      </View>

      {/* Cards financeiros restritos ao ADMIN */}
      {isAdmin && (
        <View style={styles.topStatsRow}>
          <View style={[styles.statBox, styles.statBoxPrimary]}>
            <Text style={styles.statOverlineLight}>Arrecadação confirmada</Text>
            <Text style={styles.statBigValueLight}>
              R$ {Number(metrics.confirmedRevenue || 0).toFixed(2).replace('.', ',')}
            </Text>
            <Text style={styles.statFootLight}>100% revertido para ABADEUS</Text>
          </View>

          <View style={styles.statSideCol}>
            <View style={styles.statSmallBox}>
              <Text style={styles.statSmallLabel}>Total de pedidos</Text>
              <Text style={styles.statSmallValue}>{orders.length}</Text>
            </View>

            <View style={styles.statSmallBox}>
              <Text style={styles.statSmallLabel}>Ticket médio</Text>
              <Text style={[styles.statSmallValue, { color: COLORS.mediterraneo }]}>
                R$ {Number(metrics.averageTicket || 0).toFixed(2).replace('.', ',')}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Barra exportar CSV (apenas ADMIN) */}
      <View style={styles.toolbarRow}>
        {isAdmin ? (
          <TouchableOpacity style={styles.csvBtn} onPress={handleExportCsv}>
            <Feather name="download" size={14} color={COLORS.preto} />
            <Text style={styles.csvBtnText}>Exportar CSV</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <View style={styles.liveDayPill}>
          <View style={styles.greenDot} />
          <Text style={styles.liveDayText}>Sincronizado com a API</Text>
        </View>
      </View>

      {/* Busca */}
      <View style={styles.searchWrap}>
        <Feather name="search" size={16} color={COLORS.cinzaTexto} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por #PAEL-, comprador ou telefone"
          placeholderTextColor={COLORS.cinzaTexto}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={{ gap: 8, paddingRight: 16 }}
      >
        {[
          { key: 'ALL', label: `Todos (${orders.length})` },
          {
            key: 'PAID',
            label: `Pagos (${orders.filter((o) => o.rawStatus === 'PAID' || o.rawStatus === 'PICKED_UP').length})`,
          },
          {
            key: 'PENDING',
            label: `Pendentes (${orders.filter((o) => o.rawStatus === 'PENDING').length})`,
          },
        ].map((tab) => {
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

      {filteredOrders.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Nenhum pedido encontrado para este filtro.</Text>
        </View>
      ) : (
        filteredOrders.map((order) => (
          <View key={order.id}>
            <AdminOrderCard
              order={order}
              onMarkDelivered={handleMarkDelivered}
              onCancelOrder={handleCancelOrder}
              onRefundOrder={handleOpenRefund}
            />
            {isAdmin && (
              <TouchableOpacity
                style={styles.auditLink}
                onPress={() => handleViewHistory(order.id)}
              >
                <Feather name="clock" size={12} color={COLORS.mediterraneo} />
                <Text style={styles.auditLinkText}>Ver trilha de auditoria ({order.code})</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}

      {/* Modal de justificativa de reembolso */}
      <Modal visible={refundOrderId !== null} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Justificativa de reembolso</Text>
            <Text style={styles.modalSub}>
              Obrigatório para registro na trilha de auditoria (order_status_history).
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ex: Solicitação do comprador por duplicidade"
              value={refundReason}
              onChangeText={setRefundReason}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setRefundOrderId(null)}
              >
                <Text style={styles.modalCancelText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleConfirmRefund}>
                <Text style={styles.modalConfirmText}>Confirmar estorno</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de trilha de auditoria */}
      <Modal visible={historyModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Trilha de auditoria</Text>
            <ScrollView style={{ maxHeight: 260, marginVertical: 10 }}>
              {historyItems.map((h) => (
                <View key={h.id} style={styles.historyRow}>
                  <Text style={styles.historyStatus}>
                    {h.oldStatus || 'CRIADO'} → {h.newStatus}
                  </Text>
                  <Text style={styles.historyMeta}>
                    Por: {h.changedBy?.name || 'Sistema'} •{' '}
                    {h.changedAt ? new Date(h.changedAt).toLocaleString('pt-BR') : ''}
                  </Text>
                  {!!h.justification && (
                    <Text style={styles.historyNote}>{h.justification}</Text>
                  )}
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalConfirmBtn}
              onPress={() => setHistoryModalVisible(false)}
            >
              <Text style={styles.modalConfirmText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.creme },
  scrollContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  pageTitle: { fontSize: 23, fontFamily: FONTS.headingExtraBold, color: COLORS.preto, lineHeight: 28 },
  pageSub: { fontSize: 11, color: COLORS.cinzaTexto, fontFamily: FONTS.bodyMedium },
  refreshPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F2F8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 5,
  },
  pixDirectText: { fontSize: 10, fontFamily: FONTS.bodyBold, color: COLORS.mediterraneo },
  topStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, gap: 10 },
  statBox: { flex: 1.15, borderRadius: 16, padding: 14, justifyContent: 'space-between' },
  statBoxPrimary: { backgroundColor: COLORS.tomate },
  statOverlineLight: { fontSize: 10, fontFamily: FONTS.bodyBold, color: '#FFE4E1' },
  statBigValueLight: { fontSize: 22, fontFamily: FONTS.headingExtraBold, color: COLORS.branco, marginVertical: 4 },
  statFootLight: { fontSize: 10, fontFamily: FONTS.bodySemiBold, color: COLORS.acafrao },
  statSideCol: { flex: 1, gap: 8 },
  statSmallBox: { backgroundColor: COLORS.branco, borderRadius: 14, padding: 10, borderWidth: 1, borderColor: '#EADBC0' },
  statSmallLabel: { fontSize: 10, fontFamily: FONTS.bodySemiBold, color: COLORS.cinzaTexto },
  statSmallValue: { fontSize: 18, fontFamily: FONTS.headingExtraBold, color: COLORS.preto, marginTop: 2 },
  toolbarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
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
  csvBtnText: { fontSize: 11, fontFamily: FONTS.bodyBold, color: COLORS.preto },
  liveDayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2E7D32' },
  liveDayText: { fontSize: 11, fontFamily: FONTS.bodyBold, color: '#2E7D32' },
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
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 12, fontFamily: FONTS.bodyRegular, color: COLORS.preto },
  filtersScroll: { marginBottom: 12 },
  filterPill: { backgroundColor: COLORS.branco, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: '#EADBC0' },
  filterPillActive: { backgroundColor: COLORS.preto, borderColor: COLORS.preto },
  filterPillText: { fontSize: 11, fontFamily: FONTS.bodyBold, color: COLORS.preto },
  filterPillTextActive: { color: COLORS.branco },
  emptyBox: { backgroundColor: COLORS.branco, borderRadius: 14, padding: 20, alignItems: 'center' },
  emptyText: { fontSize: 12, fontFamily: FONTS.bodyMedium, color: COLORS.cinzaTexto },
  auditLink: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: -6, marginBottom: 14, paddingLeft: 6 },
  auditLinkText: { fontSize: 11, fontFamily: FONTS.bodySemiBold, color: COLORS.mediterraneo },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: COLORS.branco, borderRadius: 18, padding: 18 },
  modalTitle: { fontSize: 18, fontFamily: FONTS.headingExtraBold, color: COLORS.preto },
  modalSub: { fontSize: 12, fontFamily: FONTS.bodyRegular, color: COLORS.cinzaTexto, marginTop: 4, marginBottom: 12 },
  modalInput: {
    backgroundColor: COLORS.creme,
    borderRadius: 12,
    padding: 12,
    minHeight: 70,
    borderWidth: 1,
    borderColor: '#EADBC0',
    fontFamily: FONTS.bodyRegular,
    marginBottom: 14,
  },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalCancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.creme, alignItems: 'center' },
  modalCancelText: { fontFamily: FONTS.bodyBold, color: COLORS.preto, fontSize: 12 },
  modalConfirmBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.tomate, alignItems: 'center' },
  modalConfirmText: { fontFamily: FONTS.bodyBold, color: COLORS.branco, fontSize: 12 },
  historyRow: { borderBottomWidth: 1, borderBottomColor: '#F2E4C9', paddingVertical: 8 },
  historyStatus: { fontSize: 12, fontFamily: FONTS.bodyBold, color: COLORS.preto },
  historyMeta: { fontSize: 10, fontFamily: FONTS.bodyRegular, color: COLORS.cinzaTexto },
  historyNote: { fontSize: 11, fontFamily: FONTS.bodyMedium, color: COLORS.mediterraneo, marginTop: 2 },
});