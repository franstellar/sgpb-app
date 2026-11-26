import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { api } from '../services/api';

export default function AdminStockScreen() {
  const [products, setProducts] = useState([]);
  const [batches, setBatches] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Campos novo produto
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockLimit, setStockLimit] = useState('50');

  const loadData = useCallback(async () => {
    try {
      const [prods, batchList] = await Promise.all([
        api.listProducts(1),
        api.listBatches(1),
      ]);
      setProducts(prods || []);
      setBatches(batchList || []);
    } catch (err) {
      Alert.alert('Erro ao carregar estoque', err.message);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalStock = products.reduce((sum, p) => sum + Number(p.stockLimit || 0), 0);

  const handleToggleProduct = async (productId) => {
    try {
      await api.toggleProduct(productId);
      loadData();
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  const handleReleaseExtraBatch = async () => {
    try {
      const nextNum = batches.length + 1;
      await api.createBatch(1, {
        name: `${nextNum}º Lote Solidário`,
        saleStart: new Date().toISOString().slice(0, 19),
        saleEnd: '2026-11-28T14:30:00',
        isActive: true,
      });
      Alert.alert('Lote criado!', `${nextNum}º Lote Solidário ativado no servidor.`);
      loadData();
    } catch (err) {
      Alert.alert('Erro ao criar lote', err.message);
    }
  };

  const handleCreateProduct = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Campos obrigatórios', 'Informe nome e preço do produto.');
      return;
    }
    try {
      await api.createProduct(1, {
        name: name.trim(),
        description: description.trim() || 'Item oficial Paelito ABADEUS',
        price: Number(price.replace(',', '.')),
        stockLimit: Number(stockLimit) || 50,
        isActive: true,
      });
      setModalVisible(false);
      setName('');
      setDescription('');
      setPrice('');
      setStockLimit('50');
      Alert.alert('Produto cadastrado!', 'Novo item já está disponível no cardápio.');
      loadData();
    } catch (err) {
      Alert.alert('Erro ao cadastrar', err.message);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.pageTitle}>Estoque e lotes</Text>
          <Text style={styles.kitchenActiveText}>
            {products.length} itens cadastrados • {batches.length} lote(s)
          </Text>
        </View>

        <TouchableOpacity style={styles.refreshBtn} onPress={loadData}>
          <Feather name="refresh-cw" size={14} color={COLORS.preto} />
          <Text style={styles.refreshBtnText}>Atualizar</Text>
        </TouchableOpacity>
      </View>

      {/* Capacidade total */}
      <View style={styles.capacityCard}>
        <Text style={styles.capacityOverline}>Estoque disponível somado</Text>
        <Text style={styles.capacityBigText}>{totalStock} un disponíveis</Text>
        <Text style={styles.capacitySubText}>
          Lote ativo: {batches[batches.length - 1]?.name || '1º Lote Solidário'}
        </Text>
      </View>

      {/* Ações rápidas */}
      <View style={styles.quickControlsRow}>
        <TouchableOpacity style={styles.pauseSalesBtn} onPress={handleReleaseExtraBatch}>
          <Ionicons name="layers-outline" size={17} color={COLORS.preto} />
          <Text style={styles.pauseSalesText}>Novo lote</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.newItemBtn} onPress={() => setModalVisible(true)}>
          <Feather name="plus" size={16} color={COLORS.branco} />
          <Text style={styles.newItemText}>Novo item</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de produtos reais */}
      <Text style={styles.sectionTitle}>Produtos no cardápio</Text>
      <View style={styles.productStockList}>
        {products.map((prod) => {
          const active = prod.isActive !== false;
          return (
            <View key={prod.id} style={styles.prodStockCard}>
              <View style={styles.prodTopRow}>
                <Text style={styles.prodName}>{prod.name}</Text>
                <TouchableOpacity
                  style={[
                    styles.prodTag,
                    { backgroundColor: active ? '#E8F5E9' : '#FDE8E6' },
                  ]}
                  onPress={() => handleToggleProduct(prod.id)}
                >
                  <Text
                    style={[
                      styles.prodTagText,
                      { color: active ? '#2E7D32' : COLORS.tomate },
                    ]}
                  >
                    {active ? 'Ativo (pausar)' : 'Pausado (ativar)'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.prodBottomRow}>
                <Text style={styles.prodMetricsLine}>
                  Preço: R$ {Number(prod.price).toFixed(2).replace('.', ',')}
                </Text>
                <Text style={styles.prodRemainingText}>
                  Restam {prod.stockLimit} un
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Modal novo produto */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Novo produto no cardápio</Text>

            <Text style={styles.inputLabel}>Nome do item</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Churros solidário (4 un)"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Descrição</Text>
            <TextInput
              style={styles.input}
              placeholder="Detalhes do item"
              value={description}
              onChangeText={setDescription}
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Preço (R$)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="25.00"
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Estoque inicial</Text>
                <TextInput
                  style={styles.input}
                  placeholder="50"
                  keyboardType="number-pad"
                  value={stockLimit}
                  onChangeText={setStockLimit}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleCreateProduct}>
                <Text style={styles.modalConfirmText}>Salvar item</Text>
              </TouchableOpacity>
            </View>
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
  kitchenActiveText: { fontSize: 11, color: COLORS.cinzaTexto, fontFamily: FONTS.bodyMedium },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.branco,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  refreshBtnText: { fontSize: 11, fontFamily: FONTS.bodyBold, color: COLORS.preto },
  capacityCard: { backgroundColor: COLORS.preto, borderRadius: 18, padding: 16, marginBottom: 12 },
  capacityOverline: { fontSize: 10, fontFamily: FONTS.bodyBold, color: '#D0D7DE' },
  capacityBigText: { fontSize: 26, fontFamily: FONTS.headingExtraBold, color: COLORS.branco, marginVertical: 4 },
  capacitySubText: { fontSize: 11, color: COLORS.acafrao, fontFamily: FONTS.bodySemiBold },
  quickControlsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  pauseSalesBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.branco,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  pauseSalesText: { fontSize: 12, fontFamily: FONTS.bodyBold, color: COLORS.preto },
  newItemBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.mediterraneo,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  newItemText: { fontSize: 12, fontFamily: FONTS.bodyBold, color: COLORS.branco },
  sectionTitle: { fontSize: 18, fontFamily: FONTS.headingExtraBold, color: COLORS.preto, marginBottom: 10 },
  productStockList: { gap: 10 },
  prodStockCard: { backgroundColor: COLORS.branco, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#EADBC0' },
  prodTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  prodName: { fontSize: 13, fontFamily: FONTS.bodyBold, color: COLORS.preto, flex: 1, marginRight: 8 },
  prodTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  prodTagText: { fontSize: 10, fontFamily: FONTS.bodyBold },
  prodBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prodMetricsLine: { fontSize: 12, color: COLORS.cinzaTexto, fontFamily: FONTS.bodySemiBold },
  prodRemainingText: { fontSize: 12, fontFamily: FONTS.bodyBold, color: COLORS.tomate },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: COLORS.branco, borderRadius: 18, padding: 18 },
  modalTitle: { fontSize: 18, fontFamily: FONTS.headingExtraBold, color: COLORS.preto, marginBottom: 10 },
  inputLabel: { fontSize: 11, fontFamily: FONTS.bodySemiBold, color: COLORS.cinzaTexto, marginTop: 8, marginBottom: 4 },
  input: {
    backgroundColor: COLORS.creme,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EADBC0',
    fontFamily: FONTS.bodySemiBold,
    fontSize: 13,
  },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  modalCancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.creme, alignItems: 'center' },
  modalCancelText: { fontFamily: FONTS.bodyBold, color: COLORS.preto, fontSize: 12 },
  modalConfirmBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.tomate, alignItems: 'center' },
  modalConfirmText: { fontFamily: FONTS.bodyBold, color: COLORS.branco, fontSize: 12 },
});