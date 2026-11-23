import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function ValidatedTicketCard({ ticket, onConfirmDelivery, onReportIssue }) {
  if (!ticket) return null;

  return (
    <View style={styles.card}>
      {/* Banner verde: ticket válido e pago */}
      <View style={styles.validBanner}>
        <View style={styles.validBannerLeft}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.branco} />
          <Text style={styles.validBannerText}>Ticket válido e pago</Text>
        </View>
        <Text style={styles.validTimeText}>{ticket.validatedTime || 'Hoje, 12:44'}</Text>
      </View>

      <View style={styles.body}>
        {/* Código do pedido e cliente */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.orderCode}>{ticket.code}</Text>
            <Text style={styles.customerName}>{ticket.customerName}</Text>
            <Text style={styles.customerPhone}>{ticket.customerPhone}</Text>
          </View>

          <View style={styles.qrVerifiedBadge}>
            <Ionicons name="shield-checkmark" size={22} color="#2E7D32" />
          </View>
        </View>

        {/* Identificação do veículo */}
        <View style={styles.vehicleBox}>
          <Text style={styles.vehicleOverline}>Identificação do veículo</Text>
          <View style={styles.vehicleRow}>
            <Ionicons name="car-sport" size={18} color={COLORS.mediterraneo} />
            <Text style={styles.vehicleText}>{ticket.vehicle}</Text>
          </View>
        </View>

        {/* Itens para entrega imediata */}
        <Text style={styles.itemsSectionTitle}>Itens para entrega imediata</Text>

        <View style={styles.itemsList}>
          {ticket.items.map((item, idx) => (
            <View key={idx} style={styles.itemCard}>
              <View style={styles.qtyBox}>
                <Text style={styles.qtyText}>{item.qty}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemNote}>{item.instruction}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Botão confirmar entrega */}
        <TouchableOpacity style={styles.confirmBtn} onPress={onConfirmDelivery}>
          <Feather name="check-circle" size={18} color={COLORS.branco} />
          <Text style={styles.confirmBtnText}>Confirmar entrega (liberar)</Text>
        </TouchableOpacity>

        {/* Botão problema no pedido / suporte */}
        <TouchableOpacity style={styles.supportBtn} onPress={onReportIssue}>
          <Feather name="alert-triangle" size={15} color={COLORS.tomate} />
          <Text style={styles.supportBtnText}>Problema no pedido / chamar suporte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.branco,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    elevation: 3,
  },
  validBanner: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  validBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  validBannerText: {
    color: COLORS.branco,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  validTimeText: {
    color: '#E8F5E9',
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderCode: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.tomate,
    marginBottom: 2,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.preto,
  },
  customerPhone: {
    fontSize: 12,
    color: COLORS.cinzaTexto,
    fontWeight: '600',
    marginTop: 2,
  },
  qrVerifiedBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleBox: {
    backgroundColor: '#F0F7FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D0E2E8',
  },
  vehicleOverline: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.mediterraneo,
    marginBottom: 4,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vehicleText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.preto,
  },
  itemsSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.cinzaTexto,
    marginBottom: 8,
  },
  itemsList: {
    gap: 8,
    marginBottom: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.creme,
    borderRadius: 12,
    padding: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  qtyBox: {
    backgroundColor: COLORS.tomate,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  qtyText: {
    color: COLORS.branco,
    fontSize: 12,
    fontWeight: '900',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.preto,
  },
  itemNote: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    fontWeight: '600',
    marginTop: 1,
  },
  confirmBtn: {
    flexDirection: 'row',
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
    elevation: 2,
  },
  confirmBtnText: {
    color: COLORS.branco,
    fontSize: 15,
    fontWeight: '900',
  },
  supportBtn: {
    flexDirection: 'row',
    backgroundColor: '#FDE8E6',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  supportBtnText: {
    color: COLORS.tomate,
    fontSize: 12,
    fontWeight: '800',
  },
});