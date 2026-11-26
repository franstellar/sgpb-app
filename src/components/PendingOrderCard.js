import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';

export default function PendingOrderCard({ order, onSimulatePay }) {
  const handleCopyPix = async () => {
    const code =
      order.pixCopyPaste ||
      `00020126580014BR.GOV.BCB.PIX0136abadeus-paelito@pix.org.br5406${Number(
        order.totalAmount
      ).toFixed(2)}`;
    await Clipboard.setStringAsync(code);
    Alert.alert(
      'Código Pix copiado',
      'Cole no aplicativo do seu banco para liberar seu QR Code de retirada'
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.pendingBanner}>
        <Feather name="clock" size={14} color="#7A4F08" />
        <Text style={styles.pendingBannerText}>
          Aguardando pagamento Pix (reserva de 15 min)
        </Text>
      </View>

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.metaLabel}>Pedido</Text>
            <View style={styles.idRow}>
              <Text style={styles.orderIdText}>#{order.orderNumber}</Text>
              <Text style={styles.timeText}>{order.createdAt || 'Hoje'}</Text>
            </View>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.metaLabel}>Total pendente</Text>
            <Text style={styles.totalPendingText}>
              R$ {Number(order.totalAmount).toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>

        {order.items?.map((item, idx) => (
          <View key={idx} style={styles.itemBox}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.itemTitle}>
                {item.quantity}x {item.name}
              </Text>
            </View>
            <Text style={styles.itemPrice}>
              R$ {Number(item.subtotal).toFixed(2).replace('.', ',')}
            </Text>
          </View>
        ))}

        {Number(order.donation) > 0 && (
          <View style={styles.itemBox}>
            <Text style={[styles.itemTitle, { color: COLORS.tomate }]}>
              Doação pedagógica ABADEUS
            </Text>
            <Text style={[styles.itemPrice, { color: COLORS.tomate }]}>
              + R$ {Number(order.donation).toFixed(2).replace('.', ',')}
            </Text>
          </View>
        )}

        <View style={styles.noticeRow}>
          <Ionicons name="information-circle-outline" size={16} color="#8B5E08" />
          <Text style={styles.noticeText}>
            O QR Code de retirada será liberado automaticamente após a confirmação do pagamento via
            Pix.
          </Text>
        </View>

        <TouchableOpacity style={styles.copyPixBtn} onPress={handleCopyPix}>
          <Feather name="copy" size={15} color={COLORS.tomate} />
          <Text style={styles.copyPixBtnText}>Copiar código Pix</Text>
        </TouchableOpacity>

        {onSimulatePay && (
          <TouchableOpacity
            style={styles.confirmPayBtn}
            onPress={() => onSimulatePay(order)}
          >
            <Feather name="check-circle" size={16} color={COLORS.branco} />
            <Text style={styles.confirmPayBtnText}>Confirmar pagamento Pix</Text>
          </TouchableOpacity>
        )}
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
    borderColor: COLORS.acafrao,
    elevation: 2,
  },
  pendingBanner: {
    backgroundColor: COLORS.acafrao,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  pendingBannerText: {
    color: '#4A3000',
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
  },
  body: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    fontSize: 18,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.preto,
    lineHeight: 23,
  },
  timeText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.cinzaTexto,
  },
  totalPendingText: {
    fontSize: 18,
    fontFamily: FONTS.headingExtraBold,
    color: '#B87D14',
    lineHeight: 23,
    marginTop: 2,
  },
  itemBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.creme,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  itemPrice: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF8E6',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  noticeText: {
    flex: 1,
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: '#7A4F08',
    lineHeight: 15,
  },
  copyPixBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.branco,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: COLORS.tomate,
    marginBottom: 8,
  },
  copyPixBtnText: {
    color: COLORS.tomate,
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
  },
  confirmPayBtn: {
    flexDirection: 'row',
    backgroundColor: '#2E7D32',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmPayBtnText: {
    color: COLORS.branco,
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
  },
});