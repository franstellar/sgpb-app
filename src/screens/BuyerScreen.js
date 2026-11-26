import React, { useState, useEffect, useCallback } from 'react';
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
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import TopBar from '../components/TopBar';
import CampaignHero from '../components/CampaignHero';
import ProductCard from '../components/ProductCard';
import HowItWorksSteps from '../components/HowItWorksSteps';
import BottomTabBar from '../components/BottomTabBar';
import CatalogCheckoutScreen from './CatalogCheckoutScreen';
import MyOrdersScreen from './MyOrdersScreen';
import EventInfoScreen from './EventInfoScreen';
import { api } from '../services/api';

const INITIAL_PRODUCTS = [
  {
    id: 1,
    category: 'Paellas',
    name: 'Paella de frutos do mar (individual)',
    price: 50.0,
    description: 'Camarão, lula e mexilhão (450g)',
    image: require('../../assets/images/paella-marinera.png'),
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
    image: require('../../assets/images/paella-valenciana.png'),
    topLeftBadge: { text: '☆ Mais pedido', bg: COLORS.tomate, color: COLORS.branco },
    bottomRightBadge: { text: 'Serve 4 pessoas (1,8kg)', bg: COLORS.branco, color: COLORS.preto },
    footerInfo: 'Economia de R$ 20',
    footerIcon: 'pricetag-outline',
  },
  {
    id: 7,
    category: 'Paellas',
    name: 'Paella veggie (individual)',
    price: 40.0,
    description: 'Cogumelos frescos, alcachofras e pimentões (450g)',
    image: require('../../assets/images/paella-vegetariana.png'),
    topLeftBadge: { text: 'Opção veggie', bg: '#E8F5E9', color: '#2E7D32' },
    topRightBadge: { text: 'Serve 1 pessoa', bg: COLORS.branco, color: COLORS.preto },
    footerInfo: 'Embalagem térmica inclusa',
    footerIcon: 'cube-outline',
  },
  {
    id: 10,
    category: 'Combos',
    name: 'Combo Paelito',
    price: 65.0,
    description: 'Porção individual + 4 minichurros artesanais + refrigerante lata ou água',
    image: 'https://images.unsplash.com/photo-1624371414361-e670edf4898d?w=800',
    topLeftBadge: { text: 'Combo Paelito', bg: COLORS.mediterraneo, color: COLORS.branco },
    topRightBadge: { text: '+ Refri grátis', bg: '#FDE6A8', color: COLORS.preto },
    footerInfo: 'Frutos do mar, carnes ou veggie',
    footerIcon: 'heart-outline',
  },
  {
    id: 13,
    category: 'Bebidas',
    name: 'Refrigerante lata (350mL)',
    price: 6.0,
    description: 'Coca-Cola, Pepsi ou Guaraná',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800',
    topLeftBadge: { text: 'Bebida gelada', bg: '#E6F2F8', color: COLORS.mediterraneo },
    footerInfo: 'Retirada no local',
    footerIcon: 'snow-outline',
  },
  {
    id: 17,
    category: 'Bebidas',
    name: 'Suco integral (300mL)',
    price: 8.0,
    description: 'Uva ou laranja',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800',
    topLeftBadge: { text: 'Bebida gelada', bg: '#E6F2F8', color: COLORS.mediterraneo },
    footerInfo: 'Retirada no local',
    footerIcon: 'snow-outline',
  },
];

const FILTERS = ['Todos', 'Paellas', 'Combos', 'Bebidas'];

export default function BuyerScreen({ user, onLogout }) {
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [activeTab, setActiveTab] = useState('HOME');
  const [quantities, setQuantities] = useState({ 1: 1 });
  const [apiProducts, setApiProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [scrollToSummaryTrigger, setScrollToSummaryTrigger] = useState(0);

  const loadBuyerData = useCallback(async () => {
    try {
      const [prods, userOrders] = await Promise.all([
        api.listProducts(1),
        user?.id ? api.listOrders(user.id) : Promise.resolve([]),
      ]);

      setApiProducts(prods || []);

      const enrichedOrders = await Promise.all(
        (userOrders || []).map(async (o) => {
          let items = [];
          try {
            const rawItems = await api.getOrderItems(o.id);
            items = (rawItems || []).map((i) => ({
              name: i.product?.name || 'Item Paelito',
              quantity: i.quantity,
              subtotal: Number(i.subtotal),
            }));
          } catch {
            items = [];
          }

          return {
            id: o.id,
            orderNumber: o.orderNumber,
            status: o.status,
            totalAmount: Number(o.totalAmount),
            donation: Number(o.donationAmount || 0),
            pixCopyPaste: o.pixCopyPaste,
            customerName: o.user?.name || user?.name || 'Cliente',
            customerPhone: o.user?.phone || user?.phone || '(48) 99842-1082',
            createdAt: o.createdAt
              ? new Date(o.createdAt).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Hoje',
            items,
          };
        })
      );

      setOrders(enrichedOrders.reverse());
    } catch {
      // Mantém visualização local se o servidor estiver temporariamente inacessível
    }
  }, [user]);

  useEffect(() => {
    loadBuyerData();
  }, [loadBuyerData]);

  const totalCartItems = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  const handleChangeTab = (tab) => {
    setScrollToSummaryTrigger(0);
    setActiveTab(tab);
    if (tab === 'ORDERS' || tab === 'MENU') {
      loadBuyerData();
    }
  };

  const handleOpenCart = () => {
    setActiveTab('MENU');
    setScrollToSummaryTrigger((prev) => prev + 1);
  };

  const handleUpdateQty = (productId, newQty) => {
    setQuantities((prev) => ({ ...prev, [productId]: newQty }));
  };

  const handleAddAndGoToCheckout = (product) => {
    setQuantities((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
    handleChangeTab('MENU');
  };

  const handleOrderCreated = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setQuantities({});
    handleChangeTab('ORDERS');
  };

  const handleSimulatePay = async (orderId) => {
    try {
      await api.confirmPayment(orderId, {
        externalId: `PIX-${orderId}-${Date.now()}`,
        method: 'PIX',
        provider: 'PIX_PROVIDER',
      });
      Alert.alert(
        'Pagamento confirmado!',
        'Seu QR Code de retirada já foi liberado na aba "Pedidos".'
      );
      loadBuyerData();
    } catch (err) {
      Alert.alert('Erro ao confirmar pagamento', err.message);
    }
  };

  const mergedHighlightProducts = INITIAL_PRODUCTS.map((p) => {
    const fromApi = apiProducts.find((ap) => ap.id === p.id);
    return fromApi ? { ...p, price: Number(fromApi.price) } : p;
  });

  const filteredProducts =
    selectedFilter === 'Todos'
      ? mergedHighlightProducts
      : mergedHighlightProducts.filter((p) => p.category === selectedFilter);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.creme} />

      <TopBar cartCount={totalCartItems} onOpenCart={handleOpenCart} onLogout={onLogout} />

      {activeTab === 'MENU' ? (
        <CatalogCheckoutScreen
          user={user}
          apiProducts={apiProducts}
          quantities={quantities}
          onUpdateQty={handleUpdateQty}
          onBack={() => handleChangeTab('HOME')}
          onOrderCreated={handleOrderCreated}
          scrollToSummaryTrigger={scrollToSummaryTrigger}
        />
      ) : activeTab === 'ORDERS' ? (
        <MyOrdersScreen orders={orders} onSimulatePay={handleSimulatePay} />
      ) : activeTab === 'EVENT' ? (
        <EventInfoScreen onOrderNow={() => handleChangeTab('MENU')} />
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <CampaignHero onOrderPress={() => handleChangeTab('MENU')} />

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

      <BottomTabBar activeTab={activeTab} onChangeTab={handleChangeTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.creme },
  container: { flex: 1, backgroundColor: COLORS.creme },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 110 },
  menuHeaderWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 14,
    marginBottom: 12,
  },
  menuOverline: { fontSize: 10, fontFamily: FONTS.bodyBold, color: COLORS.tomate },
  sectionTitle: { fontSize: 19, fontFamily: FONTS.headingExtraBold, color: COLORS.preto },
  readyDeliveryText: { fontSize: 11, color: COLORS.cinzaTexto, fontFamily: FONTS.bodySemiBold },
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
  filterPillText: { fontSize: 12, fontFamily: FONTS.bodySemiBold, color: COLORS.preto },
  filterPillTextActive: { color: COLORS.branco },
});