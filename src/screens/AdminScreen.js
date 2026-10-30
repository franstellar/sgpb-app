import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { getAllOrders, validateOrderPickup } from '../db';

export default function AdminScreen({ user, onLogout }) {
  const [allOrders, setAllOrders] = useState([]);
  const [pickupCodeInput, setPickupCodeInput] = useState('');

  const loadAdminData = () => {
    setAllOrders(getAllOrders());
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleValidatePickup = (codeToValidate) => {
    const code = codeToValidate || pickupCodeInput;
    if (!code) {
      Alert.alert('Atenção', 'Informe ou selecione o código do pedido (Ex: PAEL-1001).');
      return;
    }
    try {
      const updated = validateOrderPickup(code);
      setPickupCodeInput('');
      loadAdminData();
      Alert.alert(
        'Retirada validada com sucesso! ✅',
        `Comprovante REC-${updated.order_number} emitido para ${updated.buyer_name}.`
      );
    } catch (err) {
      Alert.alert('Bloqueio de retirada ⚠️', err.message);
    }
  };

  const totalRevenue = allOrders.reduce((acc, o) => acc + o.total_amount, 0);
  const totalPickedUp = allOrders.filter((o) => o.picked_up === 1).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerBrand}>VISÃO DO ADMINISTRADOR</Text>
          <Text style={styles.headerUser}>Operador: {user.name}</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{allOrders.length}</Text>
            <Text style={styles.metricLabel}>Pedidos Pagos</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: COLORS.success }]}>
              R$ {totalRevenue.toFixed(0)}
            </Text>
            <Text style={styles.metricLabel}>Arrecadação</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: COLORS.blue }]}>
              {totalPickedUp} / {allOrders.length}
            </Text>
            <Text style={styles.metricLabel}>Retiradas</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Validar retirada (QR Code/Código)</Text>
          <Text style={styles.descText}>
            Digite o código do comprovante ou valide diretamente na lista abaixo:
          </Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Ex: PAEL-1001"
              autoCapitalize="characters"
              value={pickupCodeInput}
              onChangeText={setPickupCodeInput}
            />
            <TouchableOpacity
              style={styles.validateButton}
              onPress={() => handleValidatePickup()}
            >
              <Text style={styles.validateButtonText}>VALIDAR</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
          Pedidos no banco local (SQLite)
        </Text>
        {allOrders.map((ord) => (
          <View key={ord.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderCode}>
                {ord.order_number} • {ord.buyer_name}
              </Text>
              <Text
                style={[
                  styles.badge,
                  { backgroundColor: ord.picked_up ? COLORS.blue : COLORS.success },
                ]}
              >
                {ord.picked_up ? `RETIRADO (${ord.picked_up_at})` : 'AGUARDANDO RETIRADA'}
              </Text>
            </View>
            <Text style={styles.orderItemText}>
              {ord.quantity}x {ord.product_name} — R$ {ord.total_amount.toFixed(2)}
            </Text>

            {!ord.picked_up && (
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => handleValidatePickup(ord.order_number)}
              >
                <Text style={styles.confirmBtnText}>Confirmar Entrega Agora</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.black,
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
  scrollContent: { padding: 16 },
  metricsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
  },
  metricValue: { fontSize: 20, fontWeight: '900', color: COLORS.red },
  metricLabel: { fontSize: 11, color: '#555', marginTop: 4, fontWeight: '700' },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.black, marginBottom: 8 },
  descText: { fontSize: 13, color: '#555', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: '#E0D4B8',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: COLORS.black,
    marginRight: 8,
  },
  validateButton: {
    backgroundColor: COLORS.red,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  validateButtonText: { color: COLORS.white, fontWeight: '800', fontSize: 14 },
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
  confirmBtn: {
    backgroundColor: COLORS.red,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  confirmBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 13 },
});