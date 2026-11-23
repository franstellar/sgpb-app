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
import CatalogGridItem from '../components/CatalogGridItem';
import PixPaymentBox from '../components/PixPaymentBox';

export const CHECKOUT_CATALOG = [
  // Paellas de frutos do mar
  {
    id: 1,
    shortName: 'Paella de frutos do mar (individual)',
    weight: '450g',
    price: 50.0,
    shortDesc: 'Camarão, lula e mexilhão',
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800',
    badge: { text: 'Mais pedido', bg: COLORS.tomate, color: COLORS.branco },
  },
  {
    id: 2,
    shortName: 'Paella de frutos do mar (2 pessoas)',
    weight: '900g',
    price: 95.0,
    shortDesc: 'Camarão, lula e mexilhão',
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800',
    badge: { text: '2 pessoas', bg: COLORS.acafrao, color: COLORS.preto },
  },
  {
    id: 3,
    shortName: 'Paella de frutos do mar (4 pessoas)',
    weight: '1,8kg',
    price: 180.0,
    shortDesc: 'Camarão, lula e mexilhão',
    image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800',
    badge: { text: 'Ideal família', bg: COLORS.acafrao, color: COLORS.preto },
  },

  // Paellas de carnes
  {
    id: 4,
    shortName: 'Paella de carnes (individual)',
    weight: '450g',
    price: 45.0,
    shortDesc: 'Frango, lombo suíno e linguiça',
    image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800',
    badge: { text: 'Individual', bg: COLORS.tomate, color: COLORS.branco },
  },
  {
    id: 5,
    shortName: 'Paella de carnes (2 pessoas)',
    weight: '900g',
    price: 85.0,
    shortDesc: 'Frango, lombo suíno e linguiça',
    image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800',
    badge: { text: '2 pessoas', bg: COLORS.acafrao, color: COLORS.preto },
  },
  {
    id: 6,
    shortName: 'Paella de carnes (4 pessoas)',
    weight: '1,8kg',
    price: 160.0,
    shortDesc: 'Frango, lombo suíno e linguiça',
    image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800',
    badge: { text: 'Ideal família', bg: COLORS.acafrao, color: COLORS.preto },
  },

  // Paellas veggie
  {
    id: 7,
    shortName: 'Paella veggie (individual)',
    weight: '450g',
    price: 40.0,
    shortDesc: 'Cogumelos frescos, alcachofras e pimentões',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800',
    badge: { text: 'Vegetariana', bg: '#2E7D32', color: COLORS.branco },
  },
  {
    id: 8,
    shortName: 'Paella veggie (2 pessoas)',
    weight: '900g',
    price: 75.0,
    shortDesc: 'Cogumelos frescos, alcachofras e pimentões',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800',
    badge: { text: 'Vegetariana', bg: '#2E7D32', color: COLORS.branco },
  },
  {
    id: 9,
    shortName: 'Paella veggie (4 pessoas)',
    weight: '1,8kg',
    price: 140.0,
    shortDesc: 'Cogumelos frescos, alcachofras e pimentões',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800',
    badge: { text: 'Vegetariana', bg: '#2E7D32', color: COLORS.branco },
  },

  // Combos Paelito
  {
    id: 10,
    shortName: 'Combo Paelito frutos do mar',
    weight: '',
    price: 65.0,
    shortDesc: 'Individual + 4 minichurros + refri lata grátis',
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
    badge: { text: 'Combo + refri', bg: COLORS.mediterraneo, color: COLORS.branco },
  },
  {
    id: 11,
    shortName: 'Combo Paelito carnes',
    weight: '',
    price: 60.0,
    shortDesc: 'Individual + 4 minichurros + refri lata grátis',
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
    badge: { text: 'Combo + refri', bg: COLORS.mediterraneo, color: COLORS.branco },
  },
  {
    id: 12,
    shortName: 'Combo Paelito veggie',
    weight: '',
    price: 55.0,
    shortDesc: 'Individual + 4 minichurros + refri lata grátis',
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
    badge: { text: 'Combo + refri', bg: COLORS.mediterraneo, color: COLORS.branco },
  },

  // Bebidas
  {
    id: 13,
    shortName: 'Refrigerante lata',
    weight: '350mL',
    price: 6.0,
    shortDesc: 'Coca-Cola, Pepsi ou Guaraná',
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
    badge: { text: 'Bebida', bg: '#E6F2F8', color: COLORS.mediterraneo },
  },
  {
    id: 14,
    shortName: 'Refrigerante 600mL',
    weight: '600mL',
    price: 9.0,
    shortDesc: 'Coca-Cola, Pepsi ou Guaraná',
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
    badge: { text: 'Bebida', bg: '#E6F2F8', color: COLORS.mediterraneo },
  },
  {
    id: 15,
    shortName: 'Refrigerante 2L',
    weight: '2L',
    price: 14.0,
    shortDesc: 'Coca-Cola, Pepsi ou Guaraná',
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
    badge: { text: 'Bebida', bg: '#E6F2F8', color: COLORS.mediterraneo },
  },
  {
    id: 16,
    shortName: 'Água mineral',
    weight: '500mL',
    price: 4.0,
    shortDesc: 'Com/sem gás',
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
    badge: { text: 'Bebida', bg: '#E6F2F8', color: COLORS.mediterraneo },
  },
  {
    id: 17,
    shortName: 'Suco integral',
    weight: '300mL',
    price: 8.0,
    shortDesc: 'Garrafa 300mL',
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
    badge: { text: 'Bebida', bg: '#E6F2F8', color: COLORS.mediterraneo },
  },
];

export default function CatalogCheckoutScreen({
  user,
  quantities,
  onUpdateQty,
  onBack,
  onOrderCreated,
}) {
  const [includeDonation, setIncludeDonation] = useState(true);
  const [fullName, setFullName] = useState(user?.name || 'Cliente');
  const [email, setEmail] = useState(user?.email || 'cliente@email.com');
  const [whatsapp, setWhatsapp] = useState(user?.phone || '(48) 99842-1082');
  const [loading, setLoading] = useState(false);

  const selectedItems = CHECKOUT_CATALOG.filter((p) => (quantities[p.id] || 0) > 0);

  const productsTotal = selectedItems.reduce(
    (acc, item) => acc + item.price * (quantities[item.id] || 0),
    0
  );
  const donationAmount = includeDonation ? 5.0 : 0.0;
  const grandTotal = productsTotal + donationAmount;

  const handleConfirmOrder = () => {
    if (selectedItems.length === 0) {
      Alert.alert('Sacola vazia', 'Selecione pelo menos 1 item para continuar');
      return;
    }
    if (!fullName.trim() || !whatsapp.trim()) {
      Alert.alert('Dados incompletos', 'Preencha seu nome e WhatsApp para retirada');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newOrder = {
        id: Math.floor(1000 + Math.random() * 9000),
        orderNumber: `PAEL-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'PAID',
        totalAmount: grandTotal,
        customerName: fullName,
        items: selectedItems.map((i) => ({
          name: i.shortName,
          quantity: quantities[i.id],
          subtotal: i.price * quantities[i.id],
        })),
        donation: includeDonation ? 5.0 : 0,
        createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      Alert.alert(
        'Pedido confirmado',
        `Código de retirada: ${newOrder.orderNumber}\nSeu QR Code já está disponível na aba "Pedidos"`,
        [{ text: 'Ver meu QR Code', onPress: () => onOrderCreated && onOrderCreated(newOrder) }]
      );
    }, 600);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Sub-header da tela de catálogo e checkout */}
      <View style={styles.subHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Feather name="chevron-left" size={20} color={COLORS.preto} />
        </TouchableOpacity>
        <View style={styles.subHeaderBadge}>
          <Ionicons name="heart" size={12} color={COLORS.tomate} />
          <Text style={styles.subHeaderBadgeText}>100% da renda revertida para a ABADEUS</Text>
        </View>
      </View>

      {/* 1. Escolha sua paella */}
      <View style={styles.titleRow}>
        <Text style={styles.mainTitle}>Escolha sua paella</Text>
        <View style={styles.editionBadge}>
          <Text style={styles.editionBadgeText}>Edição 2026</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>
        Ingredientes frescos preparados pelos voluntários da cozinha solidária
      </Text>

      {/* Grade 2x2 de produtos */}
      <View style={styles.grid}>
        {CHECKOUT_CATALOG.map((item) => (
          <CatalogGridItem
            key={item.id}
            item={item}
            quantity={quantities[item.id] || 0}
            onIncrement={() => onUpdateQty(item.id, (quantities[item.id] || 0) + 1)}
            onDecrement={() =>
              onUpdateQty(item.id, Math.max(0, (quantities[item.id] || 0) - 1))
            }
          />
        ))}
      </View>

      {/* 2. Doação pedagógica ABADEUS */}
      <TouchableOpacity
        style={[styles.donationCard, includeDonation && styles.donationCardActive]}
        onPress={() => setIncludeDonation(!includeDonation)}
        activeOpacity={0.85}
      >
        <View style={styles.donationIconCircle}>
          <Ionicons name="school" size={20} color="#8B5E08" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.donationTitle}>Doação pedagógica ABADEUS</Text>
          <Text style={styles.donationSub}>Apoie com 1 kit escolar infantil (+ R$ 5,00)</Text>
        </View>
        <View style={[styles.donationPill, !includeDonation && styles.donationPillOff]}>
          <Ionicons
            name={includeDonation ? 'checkmark-circle' : 'add-circle-outline'}
            size={14}
            color={includeDonation ? COLORS.branco : COLORS.cinzaTexto}
          />
          <Text
            style={[
              styles.donationPillText,
              !includeDonation && { color: COLORS.cinzaTexto },
            ]}
          >
            {includeDonation ? 'Incluso' : 'Adicionar'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* 3. Dados para retirada */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionTitleRow}>
          <Feather name="user-check" size={18} color={COLORS.tomate} />
          <Text style={styles.sectionTitle}>Dados para retirada</Text>
        </View>

        <Text style={styles.inputLabel}>Nome completo</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Seu nome completo"
        />

        <Text style={styles.inputLabel}>E-mail para recibo e QR Code</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="seu@email.com"
        />

        <Text style={styles.inputLabel}>WhatsApp (aviso de pedido pronto)</Text>
        <TextInput
          style={styles.input}
          value={whatsapp}
          onChangeText={setWhatsapp}
          keyboardType="phone-pad"
          placeholder="(48) 99999-9999"
        />
      </View>

      {/* 4. Forma de pagamento */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Forma de pagamento</Text>

        <View style={styles.pixMethodRow}>
          <View style={styles.pixMethodCardActive}>
            <Ionicons name="flash" size={18} color={COLORS.mediterraneo} />
            <Text style={styles.pixMethodTitle}>Pix instantâneo</Text>
            <Text style={styles.pixMethodSub}>Sem taxas extras</Text>
          </View>

          <View style={styles.pixMethodCardInfo}>
            <Feather name="zap" size={18} color="#2E7D32" />
            <Text style={styles.pixMethodTitle}>Aprovação imediata</Text>
            <Text style={styles.pixMethodSub}>Liberação do ticket em menos de 10 segundos</Text>
          </View>
        </View>
      </View>

      {/* 5. Resumo do pedido */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.sectionTitle}>Resumo do pedido</Text>
          <View style={styles.pavilionBadge}>
            <Text style={styles.pavilionBadgeText}>Retirada no pavilhão</Text>
          </View>
        </View>

        {selectedItems.map((item) => {
          const qty = quantities[item.id] || 0;
          const sub = item.price * qty;
          return (
            <View key={item.id} style={styles.summaryLine}>
              <Text style={styles.summaryItemText}>
                {item.shortName} (x{qty})
              </Text>
              <Text style={styles.summaryItemValue}>
                R$ {sub.toFixed(2).replace('.', ',')}
              </Text>
            </View>
          );
        })}

        {includeDonation && (
          <View style={styles.summaryLine}>
            <Text style={styles.summaryItemText}>Doação pedagógica ABADEUS</Text>
            <Text style={styles.summaryItemValue}>R$ 5,00</Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>Total geral solidário</Text>
            <View style={styles.hundredDonationBadge}>
              <Text style={styles.hundredDonationText}>100% doação</Text>
            </View>
          </View>
          <Text style={styles.totalValue}>
            R$ {grandTotal.toFixed(2).replace('.', ',')}
          </Text>
        </View>
      </View>

      {/* 6. Bloco Pix e QR Code */}
      <PixPaymentBox
        totalAmount={grandTotal}
        onConfirmOrder={handleConfirmOrder}
        loading={loading}
      />

      {/* 7. Card final de local de retirada */}
      <View style={styles.pickupLocationCard}>
        <View style={styles.pickupIconBox}>
          <Feather name="map-pin" size={20} color={COLORS.tomate} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.pickupCardOverline}>Local de retirada (drive-thru e salão)</Text>
          <Text style={styles.pickupCardTitle}>
            Centro Comunitário ABADEUS • Bairro Cristo Redentor, Criciúma/SC
          </Text>
          <Text style={styles.pickupCardTime}>🕒 Sábado, das 11h30 às 14h30</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.creme },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 12,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE8E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  subHeaderBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.tomate,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.preto,
  },
  editionBadge: {
    backgroundColor: COLORS.acafrao,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  editionBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.preto,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.cinzaTexto,
    marginBottom: 14,
    lineHeight: 17,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  donationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF1D6',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#EADBC0',
    gap: 10,
  },
  donationCardActive: {
    borderColor: COLORS.acafrao,
  },
  donationIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.acafrao,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donationTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.preto,
  },
  donationSub: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    marginTop: 2,
  },
  donationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  donationPillOff: {
    backgroundColor: COLORS.branco,
  },
  donationPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.branco,
  },
  sectionCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.preto,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cinzaTexto,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: COLORS.creme,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.preto,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  pixMethodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
  },
  pixMethodCardActive: {
    flex: 1,
    backgroundColor: '#F0F7FA',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: COLORS.mediterraneo,
  },
  pixMethodCardInfo: {
    flex: 1,
    backgroundColor: COLORS.creme,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  pixMethodTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.preto,
    marginTop: 6,
  },
  pixMethodSub: {
    fontSize: 10,
    color: COLORS.cinzaTexto,
    marginTop: 2,
    lineHeight: 14,
  },
  summaryCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pavilionBadge: {
    backgroundColor: '#FFF3D1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  pavilionBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B5E08',
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryItemText: {
    fontSize: 13,
    color: COLORS.cinzaTexto,
    fontWeight: '600',
  },
  summaryItemValue: {
    fontSize: 13,
    color: COLORS.preto,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#EADBC0',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.preto,
  },
  hundredDonationBadge: {
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  hundredDonationText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2E7D32',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.tomate,
  },
  pickupLocationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.branco,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  pickupIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FDE8E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupCardOverline: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.tomate,
  },
  pickupCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.preto,
    marginVertical: 2,
  },
  pickupCardTime: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    fontWeight: '600',
  },
});