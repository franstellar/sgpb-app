import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { getProducts, getUserOrders, createOrderOffline } from '../db';

export default function BuyerScreen({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [buyerTab, setBuyerTab] = useState('CATALOG');

  const loadBuyerData = () => {
    setProducts(getProducts());
    setMyOrders(getUserOrders(user.id));
  };

  useEffect(() => {
    loadBuyerData();
  }, []);

  const handleConfirmPurchase = () => {
    try {
      const code = createOrderOffline(user, selectedProduct, quantity);
      loadBuyerData();
      setSelectedProduct(null);
      setQuantity(1);
      setBuyerTab('MY_ORDERS');
      Alert.alert(
        'Pagamento confirmado! 🥘',
        `Seu pedido ${code} foi confirmado e o QR Code de retirada já está disponível!`
      );
    } catch (err) {
      Alert.alert('Erro no pedido', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerBrand}>PAELITO • Comprador</Text>
          <Text style={styles.headerUser}>Olá, {user.name}</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, buyerTab === 'CATALOG' && styles.tabActive]}
          onPress={() => setBuyerTab('CATALOG')}
        >
          <Text style={[styles.tabText, buyerTab === 'CATALOG' && styles.tabTextActive]}>
            Cardápio Solidário
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, buyerTab === 'MY_ORDERS' && styles.tabActive]}
          onPress={() => setBuyerTab('MY_ORDERS')}
        >
          <Text style={[styles.tabText, buyerTab === 'MY_ORDERS' && styles.tabTextActive]}>
            Meus Pedidos ({myOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {buyerTab === 'CATALOG' && !selectedProduct && (
          <>
            <View style={styles.heroBanner}>
              <Text style={styles.heroTitle}>Paella feita para compartilhar 🥘</Text>
              <Text style={styles.heroDesc}>
                Escolha sua porção abaixo e apoie os projetos sociais da ABADEUS
                Retirada: 15/11 das 11h30 às 14h00 na Sede da ABADEUS
              </Text>
            </View>

            {products.map((prod) => (
              <View key={prod.id} style={styles.productCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{prod.name}</Text>
                  <Text style={styles.productDesc}>{prod.description}</Text>
                  <Text style={styles.productStock}>
                    Disponível no lote: {prod.stock_limit} un.
                  </Text>
                  <Text style={styles.productPrice}>R$ {prod.price.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.buyBtn}
                  onPress={() => {
                    setSelectedProduct(prod);
                    setQuantity(1);
                  }}
                >
                  <Text style={styles.buyBtnText}>Fazer pedido</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {buyerTab === 'CATALOG' && selectedProduct && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Resumo e pagamento Pix</Text>
            <Text style={styles.productName}>{selectedProduct.name}</Text>
            <Text style={styles.productDesc}>{selectedProduct.description}</Text>

            <View style={styles.qtyRow}>
              <Text style={styles.qtyLabel}>Quantidade:</Text>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total a pagar (Reserva 15 min):</Text>
              <Text style={styles.totalValue}>
                R$ {(selectedProduct.price * quantity).toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleConfirmPurchase}>
              <Text style={styles.primaryButtonText}>CONFIRMAR PAGAMENTO PIX</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setSelectedProduct(null)}
            >
              <Text style={styles.secondaryButtonText}>VOLTAR AO CARDÁPIO</Text>
            </TouchableOpacity>
          </View>
        )}

        {buyerTab === 'MY_ORDERS' && (
          <>
            {myOrders.length === 0 ? (
              <Text style={styles.emptyText}>Você ainda não realizou pedidos</Text>
            ) : (
              myOrders.map((ord) => (
                <View key={ord.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderCode}>{ord.order_number}</Text>
                    <Text
                      style={[
                        styles.badge,
                        { backgroundColor: ord.picked_up ? COLORS.blue : COLORS.success },
                      ]}
                    >
                      {ord.picked_up ? 'RETIRADO' : 'PAGO • LIBERADO'}
                    </Text>
                  </View>
                  <Text style={styles.orderItemText}>
                    {ord.quantity}x {ord.product_name} — R$ {ord.total_amount.toFixed(2)}
                  </Text>
                  <View style={styles.qrPlaceholder}>
                    <Text style={styles.qrCodeSymbol}>▣ QR CODE DIGITAL ▣</Text>
                    <Text style={styles.qrCodeSub}>Apresente o código {ord.order_number} na fila</Text>
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBrand: { color: COLORS.yellow, fontSize: 12, fontWeight: '800' },
  headerUser: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
  tabBar: { flexDirection: 'row', backgroundColor: COLORS.white, elevation: 2 },
  tabItem: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderBottomColor: COLORS.red },
  tabText: { fontWeight: '600', color: '#777' },
  tabTextActive: { color: COLORS.red, fontWeight: '800' },
  scrollContent: { padding: 16 },
  heroBanner: {
    backgroundColor: COLORS.yellow,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  heroTitle: { fontSize: 18, fontWeight: '900', color: COLORS.black },
  heroDesc: { fontSize: 13, color: COLORS.black, marginTop: 4, lineHeight: 18 },
  productCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  productName: { fontSize: 17, fontWeight: '800', color: COLORS.black },
  productDesc: { fontSize: 13, color: '#555', marginVertical: 4 },
  productStock: { fontSize: 12, color: COLORS.blue, fontWeight: '700' },
  productPrice: { fontSize: 18, fontWeight: '900', color: COLORS.red, marginTop: 4 },
  buyBtn: {
    backgroundColor: COLORS.red,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: 12,
  },
  buyBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 13 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.black, marginBottom: 14 },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  qtyLabel: { fontSize: 16, fontWeight: '700', color: COLORS.black },
  qtyBtn: {
    backgroundColor: COLORS.yellow,
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 20, fontWeight: '900', color: COLORS.black },
  qtyValue: { fontSize: 18, fontWeight: '800', marginHorizontal: 16 },
  totalBox: {
    backgroundColor: COLORS.cream,
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  totalLabel: { fontSize: 13, color: '#555' },
  totalValue: { fontSize: 22, fontWeight: '900', color: COLORS.red, marginTop: 2 },
  primaryButton: {
    backgroundColor: COLORS.red,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: { color: COLORS.white, fontWeight: '800', fontSize: 15 },
  secondaryButton: {
    borderWidth: 2,
    borderColor: COLORS.red,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: { color: COLORS.red, fontWeight: '800', fontSize: 14 },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderCode: { fontSize: 15, fontWeight: '800', color: COLORS.black },
  badge: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  orderItemText: { fontSize: 14, color: '#444', marginTop: 8, fontWeight: '600' },
  qrPlaceholder: {
    marginTop: 12,
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.black,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  qrCodeSymbol: { fontSize: 18, fontWeight: '900', color: COLORS.black, letterSpacing: 2 },
  qrCodeSub: { fontSize: 12, color: '#555', marginTop: 4 },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 32, fontSize: 15 },
});