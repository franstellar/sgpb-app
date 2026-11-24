import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import PixPaymentBox from '../components/PixPaymentBox';

export const CHECKOUT_CATALOG = [
  // Paellas de frutos do mar
  { id: 1, name: 'Paella de frutos do mar (individual)', label: 'Individual', weight: '450g', price: 50.0 },
  { id: 2, name: 'Paella de frutos do mar (2 pessoas)', label: 'Para 2 pessoas', weight: '900g', price: 95.0 },
  { id: 3, name: 'Paella de frutos do mar (4 pessoas)', label: 'Para 4 pessoas', weight: '1,8kg', price: 180.0 },

  // Paellas de carnes
  { id: 4, name: 'Paella de carnes (individual)', label: 'Individual', weight: '450g', price: 45.0 },
  { id: 5, name: 'Paella de carnes (2 pessoas)', label: 'Para 2 pessoas', weight: '900g', price: 85.0 },
  { id: 6, name: 'Paella de carnes (4 pessoas)', label: 'Para 4 pessoas', weight: '1,8kg', price: 160.0 },

  // Paellas veggie
  { id: 7, name: 'Paella veggie (individual)', label: 'Individual', weight: '450g', price: 40.0 },
  { id: 8, name: 'Paella veggie (2 pessoas)', label: 'Para 2 pessoas', weight: '900g', price: 75.0 },
  { id: 9, name: 'Paella veggie (4 pessoas)', label: 'Para 4 pessoas', weight: '1,8kg', price: 140.0 },

  // Combos Paelito
  { id: 10, name: 'Combo Paelito frutos do mar', label: 'Frutos do mar', weight: '', price: 65.0 },
  { id: 11, name: 'Combo Paelito carnes', label: 'Carnes', weight: '', price: 60.0 },
  { id: 12, name: 'Combo Paelito veggie', label: 'Veggie', weight: '', price: 55.0 },

  // Bebidas
  { id: 13, name: 'Refrigerante lata (350mL)', label: 'Refrigerante lata (350mL)', sub: 'Coca-Cola, Pepsi ou Guaraná', price: 6.0 },
  { id: 14, name: 'Refrigerante 600mL', label: 'Refrigerante 600mL', sub: 'Coca-Cola, Pepsi ou Guaraná', price: 9.0 },
  { id: 15, name: 'Refrigerante 2L', label: 'Refrigerante 2L', sub: 'Coca-Cola, Pepsi ou Guaraná', price: 14.0 },
  { id: 16, name: 'Água mineral (500mL)', label: 'Água mineral (500mL)', sub: 'Com ou sem gás', price: 4.0 },
  { id: 17, name: 'Suco integral (300mL)', label: 'Suco integral (300mL)', sub: 'Uva ou laranja', price: 8.0 },
];

const PAELLA_GROUPS = [
  {
    key: 'seafood',
    title: 'Paella de frutos do mar',
    desc: 'Camarão, lula e mexilhão no arroz ao açafrão espanhol',
    badge: { text: 'Mais pedido', bg: COLORS.tomate, color: COLORS.branco },
    image: require('../../assets/images/paella-marinera.png'),
    itemIds: [1, 2, 3],
  },
  {
    key: 'meat',
    title: 'Paella de carnes',
    desc: 'Frango, lombo suíno e linguiça artesanal bem temperados',
    badge: { text: 'Tradicional', bg: COLORS.acafrao, color: COLORS.preto },
    image: require('../../assets/images/paella-valenciana.png'),
    itemIds: [4, 5, 6],
  },
  {
    key: 'veggie',
    title: 'Paella veggie',
    desc: 'Cogumelos frescos, alcachofras e pimentões selecionados',
    badge: { text: 'Vegetariana', bg: '#2E7D32', color: COLORS.branco },
    image: require('../../assets/images/paella-vegetariana.png'),
    itemIds: [7, 8, 9],
  },
];

const COMBO_GROUP = {
  title: 'Combo Paelito',
  desc: 'Porção individual + 4 minichurros artesanais + refrigerante lata ou água grátis',
  badge: { text: '+ Refri grátis', bg: COLORS.mediterraneo, color: COLORS.branco },
  image: 'https://images.unsplash.com/photo-1624371414361-e670edf4898d?w=900',
  itemIds: [10, 11, 12],
};

const DRINK_IDS = [13, 14, 15, 16, 17];

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

  const getItemById = (id) => CHECKOUT_CATALOG.find((p) => p.id === id);

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
          name: i.name,
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

  const renderOptionRow = (item, isLast) => {
    const qty = quantities[item.id] || 0;
    return (
      <View
        key={item.id}
        style={[
          styles.optionRow,
          !isLast && styles.optionRowBorder,
          qty > 0 && styles.optionRowSelected,
        ]}
      >
        <View style={{ flex: 1, marginRight: 10 }}>
          <View style={styles.optionLabelWrap}>
            <Text style={styles.optionLabel}>{item.label}</Text>
            {!!item.weight && (
              <View style={styles.weightPill}>
                <Text style={styles.weightPillText}>{item.weight}</Text>
              </View>
            )}
          </View>
          {!!item.sub && <Text style={styles.optionSub}>{item.sub}</Text>}
        </View>

        <Text style={styles.optionPrice}>
          R$ {item.price.toFixed(2).replace('.', ',')}
        </Text>

        <View style={styles.stepper}>
          <TouchableOpacity
            style={[styles.stepBtn, qty === 0 && styles.stepBtnDisabled]}
            onPress={() => onUpdateQty(item.id, Math.max(0, qty - 1))}
            disabled={qty === 0}
          >
            <Text style={styles.stepBtnText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qtyText}>{qty}</Text>

          <TouchableOpacity
            style={styles.stepBtnPlus}
            onPress={() => onUpdateQty(item.id, qty + 1)}
          >
            <Text style={styles.stepBtnPlusText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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

      {/* Seção Paellas (3 cards agrupados por sabor) */}
      <View style={styles.catalogSectionHeader}>
        <Text style={styles.catalogSectionTitle}>Paellas</Text>
        <Text style={styles.catalogSectionCount}>3 sabores</Text>
      </View>

      {PAELLA_GROUPS.map((group) => {
        const hasSelected = group.itemIds.some((id) => (quantities[id] || 0) > 0);
        return (
          <View
            key={group.key}
            style={[styles.groupCard, hasSelected && styles.groupCardSelected]}
          >
            <View style={styles.groupImageWrap}>
              <Image
                source={typeof group.image === 'string' ? { uri: group.image } : group.image}
                style={styles.groupImage}
              />
              <View style={[styles.groupBadge, { backgroundColor: group.badge.bg }]}>
                <Text style={[styles.groupBadgeText, { color: group.badge.color }]}>
                  {group.badge.text}
                </Text>
              </View>
            </View>

            <View style={styles.groupHeader}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <Text style={styles.groupDesc}>{group.desc}</Text>
            </View>

            <View style={styles.optionsList}>
              {group.itemIds.map((id, idx) =>
                renderOptionRow(getItemById(id), idx === group.itemIds.length - 1)
              )}
            </View>
          </View>
        );
      })}

      {/* Seção Combos Paelito (1 card agrupado) */}
      <View style={styles.catalogSectionHeader}>
        <Text style={styles.catalogSectionTitle}>Combos Paelito</Text>
        <Text style={styles.catalogSectionCount}>Refri ou água grátis</Text>
      </View>

      <View
        style={[
          styles.groupCard,
          COMBO_GROUP.itemIds.some((id) => (quantities[id] || 0) > 0) && styles.groupCardSelected,
        ]}
      >
        <View style={styles.groupImageWrap}>
          <Image
            source={typeof COMBO_GROUP.image === 'string' ? { uri: COMBO_GROUP.image } : COMBO_GROUP.image}
            style={styles.groupImage}
          />
          <View style={[styles.groupBadge, { backgroundColor: COMBO_GROUP.badge.bg }]}>
            <Text style={[styles.groupBadgeText, { color: COMBO_GROUP.badge.color }]}>
              {COMBO_GROUP.badge.text}
            </Text>
          </View>
        </View>

        <View style={styles.groupHeader}>
          <Text style={styles.groupTitle}>{COMBO_GROUP.title}</Text>
          <Text style={styles.groupDesc}>{COMBO_GROUP.desc}</Text>
        </View>

        <View style={styles.optionsList}>
          {COMBO_GROUP.itemIds.map((id, idx) =>
            renderOptionRow(getItemById(id), idx === COMBO_GROUP.itemIds.length - 1)
          )}
        </View>
      </View>

      {/* Seção Bebidas (lista compacta sem repetição de fotos) */}
      <View style={styles.catalogSectionHeader}>
        <Text style={styles.catalogSectionTitle}>Bebidas</Text>
        <Text style={styles.catalogSectionCount}>Retirada gelada no local</Text>
      </View>

      <View
        style={[
          styles.drinksCard,
          DRINK_IDS.some((id) => (quantities[id] || 0) > 0) && styles.groupCardSelected,
        ]}
      >
        {DRINK_IDS.map((id, idx) =>
          renderOptionRow(getItemById(id), idx === DRINK_IDS.length - 1)
        )}
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
                {item.name} (x{qty})
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
  scrollContent: { paddingHorizontal: 16, paddingBottom: 110 },
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
    marginBottom: 16,
    lineHeight: 17,
  },
  catalogSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EADBC0',
  },
  catalogSectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.preto,
  },
  catalogSectionCount: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cinzaTexto,
  },
  groupCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#EADBC0',
    elevation: 2,
  },
  groupCardSelected: {
    borderColor: COLORS.tomate,
  },
  groupImageWrap: {
    height: 145,
    position: 'relative',
  },
  groupImage: {
    width: '100%',
    height: '100%',
  },
  groupBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  groupBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  groupHeader: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.preto,
  },
  groupDesc: {
    fontSize: 12,
    color: COLORS.cinzaTexto,
    marginTop: 2,
    lineHeight: 16,
  },
  optionsList: {
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
  drinksCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#EADBC0',
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
  },
  optionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3E7CE',
  },
  optionRowSelected: {
    backgroundColor: '#FFFDF8',
  },
  optionLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.preto,
  },
  weightPill: {
    backgroundColor: '#F6EBD4',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  weightPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7A5410',
  },
  optionSub: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    marginTop: 2,
  },
  optionPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.tomate,
    marginRight: 10,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.creme,
    borderRadius: 14,
    paddingHorizontal: 4,
    paddingVertical: 3,
    gap: 8,
  },
  stepBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    opacity: 0.4,
  },
  stepBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.preto,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.preto,
    minWidth: 14,
    textAlign: 'center',
  },
  stepBtnPlus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.tomate,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnPlusText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.branco,
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