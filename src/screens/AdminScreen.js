import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
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
import { api } from '../services/api';

export default function AdminScreen({ user, onLogout }) {
  const role = user?.role ? user.role.toUpperCase() : 'ADMIN';
  const initialTab =
    role === 'VOLUNTEER'
      ? 'CHECKIN'
      : role === 'PARTNER'
      ? 'PARTNER_SALES'
      : 'DASHBOARD';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [dashboard, setDashboard] = useState({
    confirmedRevenue: 0,
    totalUnitsSold: 0,
    completedPickups: 0,
    remainingPickups: 0,
    pendingOrders: 0,
    averageTicket: 0,
  });

  // Modal de Venda Balcão / Parceiro
  const [saleModalVisible, setSaleModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(1);
  const [saleQty, setSaleQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('PIX'); // PIX | CARD | CASH

  const loadDashboard = useCallback(async () => {
    try {
      const [dash, prods] = await Promise.all([
        role === 'ADMIN' ? api.getDashboard() : Promise.resolve(null),
        api.listProducts(1),
      ]);
      if (dash) setDashboard(dash);
      if (prods?.length) {
        setProducts(prods);
        setSelectedProductId(prods[0].id);
      }
    } catch {
      // Mantém estado atual se offline
    }
  }, [role]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleRegisterManualSale = async () => {
    try {
      const order = await api.createOrder({
        eventId: 1,
        userId: user?.id || 1,
        origin: role === 'PARTNER' ? 'PARTNER' : 'BALCAO',
        donationAmount: 0,
        items: [{ productId: selectedProductId, quantity: saleQty }],
      });

      await api.confirmPayment(order.id, {
        externalId: `${paymentMethod}-${order.id}-${Date.now()}`,
        method: paymentMethod,
        provider: role === 'PARTNER' ? 'PARTNER_POS' : 'BALCAO_POS',
      });

      setSaleModalVisible(false);
      setSaleQty(1);
      Alert.alert(
        'Venda registrada!',
        `Pedido #${order.orderNumber} confirmado via ${paymentMethod} e liberado para retirada.`
      );
      loadDashboard();
    } catch (err) {
      Alert.alert('Erro ao registrar venda', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.creme} />

      <AdminTopBar user={user} onLogout={onLogout} />

      {activeTab === 'CHECKIN' && (role === 'ADMIN' || role === 'VOLUNTEER') && (
        <AdminCheckinScreen user={user} />
      )}

      {activeTab === 'ORDERS' && (role === 'ADMIN' || role === 'VOLUNTEER') && (
        <AdminOrdersScreen user={user} />
      )}

      {activeTab === 'STOCK' && role === 'ADMIN' && <AdminStockScreen user={user} />}

      {activeTab === 'PARTNER_SALES' && role === 'PARTNER' && (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.partnerHeroCard}>
            <View style={styles.partnerBadge}>
              <Feather name="award" size={14} color={COLORS.mediterraneo} />
              <Text style={styles.partnerBadgeText}>Ponto de venda parceiro</Text>
            </View>
            <Text style={styles.partnerTitle}>Portal de vendas do parceiro</Text>
            <Text style={styles.partnerDesc}>
              Registre vendas presenciais atribuídas à sua campanha ou ponto de apoio. Dados
              financeiros gerais da ABADEUS ficam restritos à coordenação.
            </Text>

            <TouchableOpacity
              style={styles.primaryQuickAction}
              onPress={() => setSaleModalVisible(true)}
            >
              <View style={styles.quickActionIconBox}>
                <Feather name="plus-circle" size={20} color={COLORS.branco} />
              </View>
              <Text style={styles.primaryQuickActionText}>
                Registrar nova venda (origem: Parceiro)
              </Text>
              <Feather name="chevron-right" size={18} color={COLORS.branco} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {activeTab === 'DASHBOARD' && role === 'ADMIN' && (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
            onPress={() => setSaleModalVisible(true)}
          >
            <Feather name="plus-circle" size={18} color={COLORS.preto} />
            <Text style={styles.secondaryQuickActionText}>
              Registrar venda balcão (Pix, Cartão ou Dinheiro)
            </Text>
          </TouchableOpacity>

          <View style={styles.revenueCard}>
            <View style={styles.revenueTopRow}>
              <Text style={styles.revenueOverline}>Arrecadação confirmada (API)</Text>
              <TouchableOpacity style={styles.goalBeatBadge} onPress={loadDashboard}>
                <Text style={styles.goalBeatText}>Atualizar</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.revenueAmount}>
              R$ {Number(dashboard.confirmedRevenue || 0).toFixed(2).replace('.', ',')}
            </Text>

            <View style={styles.revenueFooterRow}>
              <Text style={styles.revenueMetaText}>
                Pedidos pendentes: {dashboard.pendingOrders || 0}
              </Text>
              <Text style={styles.revenueExtraText}>
                Ticket médio: R$ {Number(dashboard.averageTicket || 0).toFixed(2).replace('.', ',')}
              </Text>
            </View>
          </View>

          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <Ionicons name="restaurant-outline" size={16} color={COLORS.tomate} />
                <Text style={styles.kpiTitle}>Porções vendidas</Text>
              </View>
              <Text style={styles.kpiBigValue}>{dashboard.totalUnitsSold || 0}</Text>
              <Text style={styles.kpiSubText}>Confirmadas na API</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <Feather name="check-circle" size={16} color={COLORS.mediterraneo} />
                <Text style={styles.kpiTitle}>Retiradas feitas</Text>
              </View>
              <Text style={[styles.kpiBigValue, { color: COLORS.mediterraneo }]}>
                {dashboard.completedPickups || 0}
              </Text>
              <Text style={styles.kpiSubText}>
                {dashboard.remainingPickups || 0} aguardando retirada
              </Text>
            </View>
          </View>

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

      {/* Modal Venda Balcão / Parceiro */}
      <Modal visible={saleModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {role === 'PARTNER' ? 'Registrar venda (Parceiro)' : 'Venda balcão presencial'}
            </Text>

            <Text style={styles.inputLabel}>Produto</Text>
            <ScrollView style={{ maxHeight: 140, marginBottom: 10 }}>
              {products.slice(0, 12).map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.prodSelectRow,
                    selectedProductId === p.id && styles.prodSelectRowActive,
                  ]}
                  onPress={() => setSelectedProductId(p.id)}
                >
                  <Text style={styles.prodSelectName} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text style={styles.prodSelectPrice}>
                    R$ {Number(p.price).toFixed(2).replace('.', ',')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.qtyRow}>
              <Text style={styles.inputLabel}>Quantidade:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setSaleQty((q) => Math.max(1, q - 1))}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyVal}>{saleQty}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setSaleQty((q) => q + 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.inputLabel}>Método de pagamento</Text>
            <View style={styles.methodRow}>
              {['PIX', 'CARD', 'CASH'].map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.methodPill, paymentMethod === m && styles.methodPillActive]}
                  onPress={() => setPaymentMethod(m)}
                >
                  <Text
                    style={[
                      styles.methodPillText,
                      paymentMethod === m && styles.methodPillTextActive,
                    ]}
                  >
                    {m === 'PIX' ? 'Pix' : m === 'CARD' ? 'Cartão' : 'Dinheiro'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setSaleModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleRegisterManualSale}
              >
                <Text style={styles.modalConfirmText}>Confirmar venda</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AdminBottomTabBar activeTab={activeTab} onChangeTab={setActiveTab} role={role} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.creme },
  container: { flex: 1, backgroundColor: COLORS.creme },
  scrollContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 100 },
  partnerHeroCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EADBC0',
    elevation: 2,
  },
  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E6F2F8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
    marginBottom: 10,
  },
  partnerBadgeText: { fontSize: 11, fontFamily: FONTS.bodyBold, color: COLORS.mediterraneo },
  partnerTitle: { fontSize: 22, fontFamily: FONTS.headingExtraBold, color: COLORS.preto, marginBottom: 6 },
  partnerDesc: { fontSize: 12, fontFamily: FONTS.bodyRegular, color: COLORS.cinzaTexto, lineHeight: 18, marginBottom: 16 },
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
  primaryQuickActionText: { flex: 1, color: COLORS.branco, fontSize: 13, fontFamily: FONTS.bodyBold },
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
  secondaryQuickActionText: { color: COLORS.preto, fontSize: 13, fontFamily: FONTS.bodyBold },
  revenueCard: { backgroundColor: COLORS.mediterraneo, borderRadius: 20, padding: 18, marginBottom: 14, elevation: 3 },
  revenueTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  revenueOverline: { fontSize: 10, fontFamily: FONTS.bodyBold, color: '#CFE6F2' },
  goalBeatBadge: { backgroundColor: COLORS.acafrao, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  goalBeatText: { fontSize: 10, fontFamily: FONTS.bodyBold, color: COLORS.preto },
  revenueAmount: { fontSize: 32, fontFamily: FONTS.headingExtraBold, color: COLORS.branco, lineHeight: 38, marginBottom: 10 },
  revenueFooterRow: { flexDirection: 'row', justifyContent: 'space-between' },
  revenueMetaText: { fontSize: 11, color: '#E0F0F8', fontFamily: FONTS.bodyMedium },
  revenueExtraText: { fontSize: 11, color: COLORS.acafrao, fontFamily: FONTS.bodyBold },
  kpiRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  kpiCard: { width: '48.4%', backgroundColor: COLORS.branco, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#EADBC0' },
  kpiHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  kpiTitle: { fontSize: 12, fontFamily: FONTS.bodySemiBold, color: COLORS.cinzaTexto },
  kpiBigValue: { fontSize: 22, fontFamily: FONTS.headingExtraBold, color: COLORS.tomate, marginBottom: 2 },
  kpiSubText: { fontSize: 10, color: COLORS.cinzaTexto, fontFamily: FONTS.bodyMedium },
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
  footerBannerTitle: { fontSize: 12, fontFamily: FONTS.bodyBold, color: COLORS.preto },
  footerBannerDesc: { fontSize: 11, fontFamily: FONTS.bodyRegular, color: COLORS.cinzaTexto, marginTop: 2, lineHeight: 16 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: COLORS.branco, borderRadius: 18, padding: 18 },
  modalTitle: { fontSize: 18, fontFamily: FONTS.headingExtraBold, color: COLORS.preto, marginBottom: 10 },
  inputLabel: { fontSize: 11, fontFamily: FONTS.bodySemiBold, color: COLORS.cinzaTexto, marginBottom: 6 },
  prodSelectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLORS.creme,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  prodSelectRowActive: { borderColor: COLORS.tomate, backgroundColor: '#FDE8E6' },
  prodSelectName: { flex: 1, fontSize: 12, fontFamily: FONTS.bodySemiBold, color: COLORS.preto, marginRight: 8 },
  prodSelectPrice: { fontSize: 12, fontFamily: FONTS.bodyBold, color: COLORS.tomate },
  qtyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.creme, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EADBC0' },
  qtyBtnText: { fontSize: 16, fontFamily: FONTS.bodyBold, color: COLORS.preto },
  qtyVal: { fontSize: 16, fontFamily: FONTS.headingExtraBold, color: COLORS.preto },
  methodRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  methodPill: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: COLORS.creme, alignItems: 'center', borderWidth: 1, borderColor: '#EADBC0' },
  methodPillActive: { backgroundColor: COLORS.mediterraneo, borderColor: COLORS.mediterraneo },
  methodPillText: { fontSize: 12, fontFamily: FONTS.bodyBold, color: COLORS.preto },
  methodPillTextActive: { color: COLORS.branco },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalCancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.creme, alignItems: 'center' },
  modalCancelText: { fontFamily: FONTS.bodyBold, color: COLORS.preto, fontSize: 12 },
  modalConfirmBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.tomate, alignItems: 'center' },
  modalConfirmText: { fontFamily: FONTS.bodyBold, color: COLORS.branco, fontSize: 12 },
});