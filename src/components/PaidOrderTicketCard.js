import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Share } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';

export default function PaidOrderTicketCard({ order }) {
  const displayName = order.customerName || 'Cliente';
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const isPickedUp = order.status === 'PICKED_UP';
  const isCancelledOrRefunded =
    order.status === 'CANCELLED' || order.status === 'REFUNDED' || order.status === 'EXPIRED';

  const bannerBg = isPickedUp
    ? '#2E7D32'
    : isCancelledOrRefunded
    ? COLORS.tomate
    : COLORS.mediterraneo;

  const bannerText = isPickedUp
    ? 'Pedido já retirado com sucesso'
    : order.status === 'REFUNDED'
    ? 'Pedido reembolsado'
    : order.status === 'CANCELLED'
    ? 'Pedido cancelado'
    : order.status === 'EXPIRED'
    ? 'Reserva expirada (15 min)'
    : 'Pago e liberado para retirada';

  const handleShareVoucher = async () => {
    try {
      await Share.share({
        message: `Voucher Paelito ABADEUS\nPedido: #${order.orderNumber}\nCliente: ${displayName}\nTotal: R$ ${Number(
          order.totalAmount
        )
          .toFixed(2)
          .replace('.', ',')}\nRetirada: Sábado, 28/11 das 11h30 às 14h30 na Sede ABADEUS.`,
      });
    } catch {
      Alert.alert('Voucher', `Código do pedido: #${order.orderNumber}`);
    }
  };

  return (
    <View style={[styles.card, { borderColor: bannerBg }]}>
      {/* Banner topo */}
      <View style={[styles.statusBanner, { backgroundColor: bannerBg }]}>
        <Ionicons
          name={isCancelledOrRefunded ? 'close-circle' : 'checkmark-circle'}
          size={16}
          color={COLORS.branco}
        />
        <Text style={styles.statusBannerText}>{bannerText}</Text>
      </View>

      <View style={styles.body}>
        {/* Cabeçalho identificador e total */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.metaLabel}>Identificador</Text>
            <View style={styles.idRow}>
              <Text style={styles.orderIdText}>#{order.orderNumber}</Text>
              <Text style={styles.timeText}>{order.createdAt || 'Hoje'}</Text>
            </View>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.metaLabel}>Total</Text>
            <Text style={styles.totalPaidText}>
              R$ {Number(order.totalAmount).toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>

        {/* Lista de itens confirmados */}
        <View style={styles.itemsBox}>
          <View style={styles.itemsTitleRow}>
            <Ionicons name="restaurant-outline" size={13} color={COLORS.tomate} />
            <Text style={styles.itemsTitle}>Itens do pedido</Text>
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

          {Number(order.donation) > 0 && (
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
              Origem: {order.origin || 'APP'}
            </Text>
            <Text style={styles.receiptMeta}>Recibo #{order.receiptNumber || order.orderNumber}</Text>
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

        {/* Voucher digital oficial com QR Code real (só para pedidos pagos/retirados) */}
        {!isCancelledOrRefunded && (
          <View style={styles.voucherBox}>
            <View style={styles.voucherTopTag}>
              <Text style={styles.voucherTopTagText}>ABADEUS</Text>
            </View>
            <Text style={styles.voucherOverline}>
              {isPickedUp ? 'Voucher já validado na entrega' : 'Voucher digital oficial de retirada'}
            </Text>

            <View style={[styles.qrContainer, isPickedUp && { opacity: 0.45 }]}>
              <QRCode value={order.orderNumber} size={150} color={COLORS.preto} backgroundColor={COLORS.branco} />
            </View>

            <View style={styles.validationCodePill}>
              <Text style={styles.validationCodeText}>{order.orderNumber}</Text>
            </View>

            <Text style={styles.voucherHint}>
              {isPickedUp
                ? 'Este código já foi utilizado e não pode ser retirado novamente.'
                : 'Apresente este QR Code para o voluntário escanear no dia do evento'}
            </Text>

            <View style={styles.voucherActionsRow}>
              <TouchableOpacity style={styles.whatsBtn} onPress={handleShareVoucher}>
                <Ionicons name="share-social-outline" size={16} color={COLORS.branco} />
                <Text style={styles.whatsBtnText}>Compartilhar voucher</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
    elevation: 3,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  statusBannerText: {
    color: COLORS.branco,
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
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
    fontFamily: FONTS.bodyBold,
    color: COLORS.cinzaTexto,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  orderIdText: {
    fontSize: 19,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.preto,
    lineHeight: 24,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    fontFamily: FONTS.bodyMedium,
  },
  totalPaidText: {
    fontSize: 19,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.tomate,
    lineHeight: 24,
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
    fontFamily: FONTS.bodyBold,
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
    fontFamily: FONTS.bodyBold,
    color: COLORS.tomate,
  },
  itemName: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.preto,
    marginRight: 6,
  },
  itemPrice: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
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
    fontFamily: FONTS.bodyMedium,
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
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
  },
  customerName: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  customerPhone: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
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
    fontFamily: FONTS.bodyBold,
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
    fontFamily: FONTS.bodyBold,
    color: '#8B5E08',
  },
  voucherOverline: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
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
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
    letterSpacing: 0.8,
  },
  voucherHint: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
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
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  whatsBtnText: {
    color: COLORS.branco,
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
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
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  footInfoText: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    fontFamily: FONTS.bodyMedium,
    flex: 1,
  },
});