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
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import PaidOrderTicketCard from '../components/PaidOrderTicketCard';
import PendingOrderCard from '../components/PendingOrderCard';

export default function MyOrdersScreen({ orders = [], onSimulatePay }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | PAID | PENDING

  const paidCount = orders.filter((o) => o.status === 'PAID' || o.status === 'PICKED_UP').length;
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PAID' && (order.status === 'PAID' || order.status === 'PICKED_UP')) ||
      (statusFilter === 'PENDING' && order.status === 'PENDING');

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      order.orderNumber.toLowerCase().includes(q) ||
      (order.customerPhone && order.customerPhone.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Título e Subtítulo */}
      <Text style={styles.pageTitle}>Meus Ingressos & Pedidos</Text>
      <Text style={styles.pageSubtitle}>
        Apresente o QR Code no drive-thru ou salão no dia 28/Nov.
      </Text>

      {/* Barra de Busca */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrap}>
          <Feather name="search" size={16} color={COLORS.cinzaTexto} />
          <TextInput
            style={styles.searchInput}
            placeholder="Nº do pedido (#PAE-8429) ou cel"
            placeholderTextColor={COLORS.cinzaTexto}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.searchBtnText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Pílulas de Filtro de Status */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabPill, statusFilter === 'ALL' && styles.tabPillActive]}
          onPress={() => setStatusFilter('ALL')}
        >
          <Text style={[styles.tabPillText, statusFilter === 'ALL' && styles.tabPillTextActive]}>
            Todos ({orders.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabPill, statusFilter === 'PAID' && styles.tabPillActive]}
          onPress={() => setStatusFilter('PAID')}
        >
          <Text style={[styles.tabPillText, statusFilter === 'PAID' && styles.tabPillTextActive]}>
            Pagos / Liberados ({paidCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabPill, statusFilter === 'PENDING' && styles.tabPillActive]}
          onPress={() => setStatusFilter('PENDING')}
        >
          <Text
            style={[styles.tabPillText, statusFilter === 'PENDING' && styles.tabPillTextActive]}
          >
            Pendentes ({pendingCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Pedidos */}
      {filteredOrders.map((order) =>
        order.status === 'PENDING' ? (
          <PendingOrderCard key={order.id} order={order} onSimulatePay={onSimulatePay} />
        ) : (
          <PaidOrderTicketCard key={order.id} order={order} />
        )
      )}

      {/* Bloco de Ajuda / Atendimento ABADEUS */}
      <View style={styles.helpCard}>
        <View style={styles.helpIconCircle}>
          <Ionicons name="chatbubbles-outline" size={22} color={COLORS.mediterraneo} />
        </View>
        <Text style={styles.helpTitle}>Não encontrou seu pedido?</Text>
        <Text style={styles.helpDesc}>
          Digite o WhatsApp utilizado na compra ou fale com a nossa equipe de voluntários da
          Associação ABADEUS.
        </Text>
        <TouchableOpacity
          style={styles.helpBtn}
          onPress={() =>
            Alert.alert('Suporte ABADEUS 💬', 'Redirecionando para o WhatsApp da equipe...')
          }
        >
          <Ionicons name="logo-whatsapp" size={16} color={COLORS.mediterraneo} />
          <Text style={styles.helpBtnText}>Falar com Atendimento</Text>
        </TouchableOpacity>
      </View>

      {/* Rodapé Solidário */}
      <View style={styles.solidaryFooter}>
        <Text style={styles.solidaryTitle}>
          ❤️ 100% da renda revertida para as oficinas da ABADEUS
        </Text>
        <Text style={styles.solidarySub}>
          Obrigado por temperar esta causa com amor e solidariedade!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.creme },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.preto,
    marginTop: 14,
  },
  pageSubtitle: {
    fontSize: 12,
    color: COLORS.cinzaTexto,
    marginTop: 2,
    marginBottom: 14,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.branco,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EADBC0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 12,
    color: COLORS.preto,
  },
  searchBtn: {
    backgroundColor: COLORS.tomate,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnText: {
    color: COLORS.branco,
    fontSize: 12,
    fontWeight: '800',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabPill: {
    backgroundColor: COLORS.branco,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  tabPillActive: {
    backgroundColor: COLORS.tomate,
    borderColor: COLORS.tomate,
  },
  tabPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.preto,
  },
  tabPillTextActive: {
    color: COLORS.branco,
  },
  helpCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EADBC0',
    marginBottom: 18,
  },
  helpIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6F2F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.preto,
    marginBottom: 4,
  },
  helpDesc: {
    fontSize: 12,
    color: COLORS.cinzaTexto,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 12,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.mediterraneo,
  },
  helpBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.mediterraneo,
  },
  solidaryFooter: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  solidaryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.tomate,
    textAlign: 'center',
  },
  solidarySub: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    textAlign: 'center',
    marginTop: 2,
  },
});