import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { COLORS } from '../theme/colors';
import TopBar from '../components/TopBar';
import CampaignHero from '../components/CampaignHero';
import ProductCard from '../components/ProductCard';
import HowItWorksSteps from '../components/HowItWorksSteps';
import BottomTabBar from '../components/BottomTabBar';

const INITIAL_PRODUCTS = [
  {
    id: 1,
    category: 'Paellas',
    name: 'Paella Tradicional Individual',
    price: 45.0,
    description:
      'Arroz bomba artesanal, açafrão espanhol, camarões médios, anéis de lula, mexilhões e lascas de frango suculento.',
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800',
    topLeftBadge: { text: 'Individual (450g)', bg: COLORS.acafrao, color: COLORS.preto },
    topRightBadge: { text: 'Serve 1 pessoa', bg: COLORS.branco, color: COLORS.preto },
    footerInfo: 'Embalagem térmica inclusa',
    footerIcon: 'cube-outline',
  },
  {
    id: 2,
    category: 'Combos Família',
    name: 'Paella Família Solidária',
    price: 150.0,
    description:
      'Perfeita para o almoço de domingo! Dobro de frutos do mar nobres, camarões pistola grelhados e tempero artesanal.',
    image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800',
    topLeftBadge: { text: '☆ Mais Pedido para Almoço', bg: COLORS.tomate, color: COLORS.branco },
    bottomRightBadge: {
      text: 'Serve até 4 pessoas (1,2kg)',
      bg: COLORS.branco,
      color: COLORS.preto,
    },
    footerInfo: 'Economia de R$ 15',
    footerIcon: 'pricetag-outline',
  },
  {
    id: 3,
    category: 'Combos Família',
    name: 'Combo Paelito + Churros',
    price: 65.0,
    description:
      '1 Porção Individual generosa (450g) + 4 Minichurros artesanais crocantes com doce de leite caseiro da ABADEUS.',
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
    topLeftBadge: { text: 'Combo Delícia', bg: COLORS.mediterraneo, color: COLORS.branco },
    topRightBadge: { text: '+ Sobremesa', bg: '#FDE6A8', color: COLORS.preto },
    footerInfo: 'Dupla doação',
    footerIcon: 'heart-outline',
  },
];

const FILTERS = ['Todos', 'Paellas', 'Combos Família', 'Bebidas'];

export default function BuyerScreen({ user, onLogout }) {
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [activeTab, setActiveTab] = useState('HOME');
  const [cart, setCart] = useState([]);

  const filteredProducts =
    selectedFilter === 'Todos'
      ? INITIAL_PRODUCTS
      : INITIAL_PRODUCTS.filter((p) => p.category === selectedFilter);

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
    Alert.alert('Adicionado! 🥘', `${product.name} foi para a sua sacola.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.creme} />

      <TopBar
        cartCount={cart.length}
        onOpenCart={() => Alert.alert('Sacola', `Você tem ${cart.length} item(ns) na sacola.`)}
        onLogout={onLogout}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CampaignHero onOrderPress={() => handleAddToCart(INITIAL_PRODUCTS[0])} />

        {/* Cabeçalho do Cardápio */}
        <View style={styles.menuHeaderWrap}>
          <View>
            <Text style={styles.menuOverline}>CARDÁPIO DO AMOR</Text>
            <Text style={styles.sectionTitle}>Escolha sua Porção</Text>
          </View>
          <Text style={styles.readyDeliveryText}>Pronta entrega</Text>
        </View>

        {/* Pílulas de Filtro */}
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

        {/* Cards de Produtos */}
        {filteredProducts.map((item) => (
          <ProductCard key={item.id} item={item} onAdd={handleAddToCart} />
        ))}

        {/* Como Funciona em 4 Passos */}
        <HowItWorksSteps />
      </ScrollView>

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