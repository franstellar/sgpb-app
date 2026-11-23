import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function PaidOrderTicketCard({ order }) {
  const displayName = order.customerName || 'Cliente';
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <View style={styles.card}>
      {/* Banner topo: pago e liberado */}
      <View style={styles.statusBanner}>
        <Ionicons name="checkmark-circle" size={16} color={COLORS.branco} />
        <Text style={styles.statusBannerText}>Pago e liberado para retirada</Text>
      </View>

      <View style={styles.body}>
        {/* Cabeçalho identificador e total */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.metaLabel}>Identificador</Text>
            <View style={styles.idRow}>
              <Text style={styles.orderIdText}>#{order.orderNumber}</Text>
              <Text style={styles.timeText}>{order.createdAt || 'Hoje, 14:32'}</Text>
            </View>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.metaLabel}>Total pago</Text>
            <Text style={styles.totalPaidText}>
              R$ {Number(order.totalAmount).toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>

        {/* Lista de itens confirmados */}
        <View style={styles.itemsBox}>
          <View style={styles.itemsTitleRow}>
            <Ionicons name="restaurant-outline" size={13} color={COLORS.tomate} />
            <Text style={styles.itemsTitle}>Itens confirmados no cardápio</Text>
          </View>

          {order.items?.map((item, idx) => (
            <View key={idx} style={styles.itemLine}>
              <View style={styles.qtyBadge}>
                <Text style={styles.qtyBadgeText}>{item.quantity}x</Text>
              </View>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemPrice}>
                R$ {Number(item.subtotal).toFixed(2).replace('.', ',')}
              </Text>
            </View>
          ))}

          {order.donation > 0 && (
            <View style={styles.itemLine}>
              <Ionicons
                name="heart"
                size={14}
                color={COLORS.tomate}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.itemName, { color: COLORS.tomate }]}>
                Doação pedagógica ABADEUS
              </Text>
              <Text style={[styles.itemPrice, { color: COLORS.tomate }]}>
                + R$ {Number(order.donation).toFixed(2).replace('.', ',')}
              </Text>
            </View>
          )}

          <View style={styles.receiptFooter}>
            <Text style={styles.receiptMeta}>
              Pix processado às {order.paidAt || '14:35'}
            </Text>
            <Text style={styles.receiptMeta}>Recibo #{order.receiptNumber || '92813'}</Text>
          </View>
        </View>

        {/* Linha do comprador */}
        <View style={styles.customerRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.customerName}>{displayName}</Text>
            <Text style={styles.customerPhone}>
              {order.customerPhone || '(48) 99842-1082'}
            </Text>
          </View>
          <View style={styles.driveThruTag}>
            <Text style={styles.driveThruTagText}>Drive-thru</Text>
          </View>
        </View>

        {/* Voucher digital oficial de retirada */}
        <View style={styles.voucherBox}>
          <View style={styles.voucherTopTag}>
            <Text style={styles.voucherTopTagText}>ABADEUS</Text>
          </View>
          <Text style={styles.voucherOverline}>Voucher digital oficial de retirada</Text>

          <View style={styles.qrContainer}>
            <Ionicons name="qr-code" size={145} color={COLORS.preto} />
          </View>

          <View style={styles.validationCodePill}>
            <Text style={styles.validationCodeText}>
              {order.validationCode ||
                `VAL-${order.orderNumber.replace('PAE-', '').replace('PAEL-', '')}-CRICIUMA-OK`}
            </Text>
          </View>

          <Text style={styles.voucherHint}>
            Apresente este código para o voluntário escanear no dia do evento
          </Text>

          <View style={styles.voucherActionsRow}>
            <TouchableOpacity
              style={styles.whatsBtn}
              onPress={() =>
                Alert.alert('WhatsApp', 'Voucher enviado para o seu WhatsApp cadastrado')
              }
            >
              <Ionicons name="logo-whatsapp" size={16} color={COLORS.branco} />
              <Text style={styles.whatsBtnText}>Enviar no Whats</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pdfBtn}
              onPress={() =>
                Alert.alert('PDF salvo', 'O comprovante em PDF foi salvo no seu aparelho')
              }
            >
              <Feather name="download" size={15} color={COLORS.preto} />
              <Text style={styles.pdfBtnText}>Baixar PDF</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Informações de horário e local */}
        <View style={styles.eventFootInfo}>
          <View style={styles.footInfoRow}>
            <Feather name="calendar" size={14} color={COLORS.tomate} />
            <Text style={styles.footInfoBold}>Sábado, 28 de novembro • 11h30 às 14h30</Text>
          </View>
          <View style={styles.footInfoRow}>
            <Feather name="map-pin" size={14} color={COLORS.mediterraneo} />
            <Text style={styles.footInfoText}>
              Sede ABADEUS • Bairro Cristo Redentor, Criciúma/SC
            </Text>
          </View>
          <View style={styles.priorityBadge}>
            <Ionicons name="car-sport-outline" size={14} color="#8B5E08" />
            <Text style={styles.priorityBadgeText}>
              Entrada prioritária pela via expressa de veículos
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.branco,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: COLORS.mediterraneo,
    elevation: 3,
  },
  statusBanner: {
    backgroundColor: COLORS.mediterraneo,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  statusBannerText: {
    color: COLORS.branco,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  body: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.cinzaTexto,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  orderIdText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.preto,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    fontWeight: '600',
  },
  totalPaidText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.tomate,
    marginTop: 2,
  },
  itemsBox: {
    backgroundColor: COLORS.creme,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  itemsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  itemsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.preto,
  },
  itemLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  qtyBadge: {
    backgroundColor: COLORS.branco,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  qtyBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.tomate,
  },
  itemName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.preto,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.preto,
  },
  receiptFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EADBC0',
    paddingTop: 8,
    marginTop: 4,
  },
  receiptMeta: {
    fontSize: 10,
    color: COLORS.cinzaTexto,
    fontWeight: '600',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    backgroundColor: '#F9F6F0',
    padding: 10,
    borderRadius: 12,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.tomate,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.branco,
    fontWeight: '800',
    fontSize: 13,
  },
  customerName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.preto,
  },
  customerPhone: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
  },
  driveThruTag: {
    backgroundColor: '#E6F2F8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  driveThruTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.mediterraneo,
  },
  voucherBox: {
    backgroundColor: '#FFFDF9',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.acafrao,
    marginBottom: 14,
  },
  voucherTopTag: {
    backgroundColor: '#FDE8B2',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 4,
  },
  voucherTopTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#8B5E08',
  },
  voucherOverline: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.cinzaTexto,
    marginBottom: 12,
  },
  qrContainer: {
    backgroundColor: COLORS.branco,
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#EADBC0',
    marginBottom: 10,
  },
  validationCodePill: {
    backgroundColor: COLORS.creme,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EADBC0',
    marginBottom: 8,
  },
  validationCodeText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.preto,
    letterSpacing: 0.8,
  },
  voucherHint: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    textAlign: 'center',
    marginBottom: 14,
  },
  voucherActionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  whatsBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#25D366',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  whatsBtnText: {
    color: COLORS.branco,
    fontSize: 12,
    fontWeight: '800',
  },
  pdfBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.creme,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  pdfBtnText: {
    color: COLORS.preto,
    fontSize: 12,
    fontWeight: '800',
  },
  eventFootInfo: {
    gap: 6,
  },
  footInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footInfoBold: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.preto,
  },
  footInfoText: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    fontWeight: '600',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3D1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
    marginTop: 4,
  },
  priorityBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B5E08',
  },
});