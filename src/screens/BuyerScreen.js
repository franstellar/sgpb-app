import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import TopBar from '../components/TopBar';
import CampaignHero from '../components/CampaignHero';
import ProductCard from '../components/ProductCard';
import HowItWorksSteps from '../components/HowItWorksSteps';
import BottomTabBar from '../components/BottomTabBar';
import CatalogCheckoutScreen from './CatalogCheckoutScreen';
import MyOrdersScreen from './MyOrdersScreen';
import EventInfoScreen from './EventInfoScreen';

const INITIAL_PRODUCTS = [
  {
    id: 1,
    category: 'Paellas',
    name: 'Paella de frutos do mar (individual)',
    price: 50.0,
    description: 'Camarão, lula e mexilhão (450g)',
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800',
    topLeftBadge: { text: 'Individual (450g)', bg: COLORS.acafrao, color: COLORS.preto },
    topRightBadge: { text: 'Serve 1 pessoa', bg: COLORS.branco, color: COLORS.preto },
    footerInfo: 'Embalagem térmica inclusa',
    footerIcon: 'cube-outline',
  },
  {
    id: 6,
    category: 'Paellas',
    name: 'Paella de carnes (4 pessoas)',
    price: 160.0,
    description: 'Frango, lombo suíno e linguiça (1,8kg)',
    image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800',
    topLeftBadge: { text: '☆ Mais pedido', bg: COLORS.tomate, color: COLORS.branco },
    bottomRightBadge: {
      text: 'Serve 4 pessoas (1,8kg)',
      bg: COLORS.branco,
      color: COLORS.preto,
    },
    footerInfo: 'Economia de R$ 20',
    footerIcon: 'pricetag-outline',
  },
  {
    id: 7,
    category: 'Paellas',
    name: 'Paella veggie (individual)',
    price: 40.0,
    description: 'Cogumelos frescos, alcachofras e pimentões (450g)',
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800',
    topLeftBadge: { text: 'Opção veggie', bg: '#E8F5E9', color: '#2E7D32' },
    topRightBadge: { text: 'Serve 1 pessoa', bg: COLORS.branco, color: COLORS.preto },
    footerInfo: 'Embalagem térmica inclusa',
    footerIcon: 'cube-outline',
  },
  {
    id: 10,
    category: 'Combos',
    name: 'Combo Paelito frutos do mar',
    price: 65.0,
    description: 'Porção individual + 4 minichurros artesanais + refrigerante lata grátis',
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
    topLeftBadge: { text: 'Combo Paelito', bg: COLORS.mediterraneo, color: COLORS.branco },
    topRightBadge: { text: '+ Refri grátis', bg: '#FDE6A8', color: COLORS.preto },
    footerInfo: 'Dupla doação',
    footerIcon: 'heart-outline',
  },
  {
    id: 11,
    category: 'Combos',
    name: 'Combo Paelito carnes',
    price: 60.0,
    description: 'Porção individual + 4 minichurros artesanais + refrigerante lata grátis',
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
    topLeftBadge: { text: 'Combo Paelito', bg: COLORS.mediterraneo, color: COLORS.branco },
    topRightBadge: { text: '+ Refri grátis', bg: '#FDE6A8', color: COLORS.preto },
    footerInfo: 'Dupla doação',
    footerIcon: 'heart-outline',
  },
  {
    id: 13,
    category: 'Bebidas',
    name: 'Refrigerante lata (350mL)',
    price: 6.0,
    description: 'Coca-Cola, Pepsi ou Guaraná',
    // Trocar pela imagem de refrigerante quando tiver o asset
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
    topLeftBadge: { text: 'Bebida gelada', bg: '#E6F2F8', color: COLORS.mediterraneo },
    footerInfo: 'Retirada no local',
    footerIcon: 'snow-outline',
  },
  {
    id: 17,
    category: 'Bebidas',
    name: 'Suco integral',
    price: 8.0,
    description: 'Garrafa 300mL',
    // Trocar pela imagem de suco quando tiver o asset
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
    topLeftBadge: { text: 'Bebida gelada', bg: '#E6F2F8', color: COLORS.mediterraneo },
    footerInfo: 'Retirada no local',
    footerIcon: 'snow-outline',
  },
];

const INITIAL_ORDERS = [
  {
    id: 8429,
    orderNumber: 'PAE-8429',
    status: 'PAID',
    totalAmount: 115.0,
    createdAt: 'Hoje, 14:32',
    paidAt: '14:35',
    receiptNumber: '92813',
    customerName: 'Cliente',
    customerPhone: '(48) 99842-1082',
    validationCode: 'VAL-8429-CRICIUMA-OK',
    items: [
      { name: 'Paella de carnes (individual)', quantity: 1, subtotal: 45.0 },
      { name: 'Combo Paelito frutos do mar', quantity: 1, subtotal: 65.0 },
    ],
    donation: 5.0,
  },
  {
    id: 8435,
    orderNumber: 'PAE-8435',
    status: 'PENDING',
    totalAmount: 160.0,
    createdAt: 'Hoje, 14:48',
    expiresIn: 'Expira em 12:40',
    customerName: 'Cliente',
    customerPhone: '(48) 99842-1082',
    items: [
      {
        name: 'Paella de carnes (4 pessoas)',
        subtitle: 'Serve 4 pessoas',
        quantity: 1,
        subtotal: 160.0,
      },
    ],
    donation: 0,
  },
];

const FILTERS = ['Todos', 'Paellas', 'Combos', 'Bebidas'];

export default function BuyerScreen({ user, onLogout }) {
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [activeTab, setActiveTab] = useState('HOME');
  const [quantities, setQuantities] = useState({ 1: 1, 10: 1 });
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const totalCartItems = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  const handleUpdateQty = (productId, newQty) => {
    setQuantities((prev) => ({ ...prev, [productId]: newQty }));
  };

  const handleAddAndGoToCheckout = (product) => {
    setQuantities((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
    setActiveTab('MENU');
  };

  const handleOrderCreated = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveTab('ORDERS');
  };

  const handleSimulatePay = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'PAID', paidAt: 'Agora' } : o))
    );
  };

  const filteredProducts =
    selectedFilter === 'Todos'
      ? INITIAL_PRODUCTS
      : INITIAL_PRODUCTS.filter((p) => p.category === selectedFilter);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.creme} />

      <TopBar
        cartCount={totalCartItems}
        onOpenCart={() => setActiveTab('MENU')}
        onLogout={onLogout}
      />

      {activeTab === 'MENU' ? (
        <CatalogCheckoutScreen
          user={user}
          quantities={quantities}
          onUpdateQty={handleUpdateQty}
          onBack={() => setActiveTab('HOME')}
          onOrderCreated={handleOrderCreated}
        />
      ) : activeTab === 'ORDERS' ? (
        <MyOrdersScreen orders={orders} onSimulatePay={handleSimulatePay} />
      ) : activeTab === 'EVENT' ? (
        <EventInfoScreen onOrderNow={() => setActiveTab('MENU')} />
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <CampaignHero onOrderPress={() => setActiveTab('MENU')} />

          <View style={styles.menuHeaderWrap}>
            <View>
              <Text style={styles.menuOverline}>Cardápio solidário</Text>
              <Text style={styles.sectionTitle}>Escolha sua porção</Text>
            </View>
            <Text style={styles.readyDeliveryText}>Pronta entrega</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersScroll}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {FILTERS.map((filter) => {
              const active = selectedFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterPill, active && styles.filterPillActive]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {filteredProducts.map((item) => (
            <ProductCard key={item.id} item={item} onAdd={handleAddAndGoToCheckout} />
          ))}

          <HowItWorksSteps />
        </ScrollView>
      )}

      <BottomTabBar activeTab={activeTab} onChangeTab={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.creme },
  container: { flex: 1, backgroundColor: COLORS.creme },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 95 },
  menuHeaderWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 14,
    marginBottom: 12,
  },
  menuOverline: { fontSize: 10, fontWeight: '800', color: COLORS.tomate },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.preto },
  readyDeliveryText: { fontSize: 11, color: COLORS.cinzaTexto, fontWeight: '600' },
  filtersScroll: { marginBottom: 14 },
  filterPill: {
    backgroundColor: COLORS.branco,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  filterPillActive: { backgroundColor: COLORS.tomate, borderColor: COLORS.tomate },
  filterPillText: { fontSize: 12, fontWeight: '600', color: COLORS.preto },
  filterPillTextActive: { color: COLORS.branco },
});