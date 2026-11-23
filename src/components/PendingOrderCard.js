import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function PendingOrderCard({ order, onSimulatePay }) {
  const handleCopyPix = () => {
    Alert.alert(
      'Código Pix copiado',
      'Cole no aplicativo do seu banco para liberar seu QR Code de retirada',
      [
        { text: 'OK' },
        ...(onSimulatePay
          ? [{ text: 'Simular pagamento agora', onPress: () => onSimulatePay(order.id) }]
          : []),
      ]
    );
  };

  return (
    <View style={styles.card}>
      {/* Banner amarelo: aguardando pagamento Pix */}
      <View style={styles.pendingBanner}>
        <Feather name="clock" size={14} color="#7A4F08" />
        <Text style={styles.pendingBannerText}>
          Aguardando pagamento Pix ({order.expiresIn || 'Expira em 12:40'})
        </Text>
      </View>

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.metaLabel}>Pedido</Text>
            <View style={styles.idRow}>
              <Text style={styles.orderIdText}>#{order.orderNumber}</Text>
              <Text style={styles.timeText}>{order.createdAt || 'Hoje, 14:48'}</Text>
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
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>
                {item.quantity}x {item.name}
              </Text>
              {item.subtitle && <Text style={styles.itemSub}>{item.subtitle}</Text>}
            </View>
            <Text style={styles.itemPrice}>
              R$ {Number(item.subtotal).toFixed(2).replace('.', ',')}
            </Text>
          </View>
        ))}

        <View style={styles.noticeRow}>
          <Ionicons name="information-circle-outline" size={16} color="#8B5E08" />
          <Text style={styles.noticeText}>
            O QR Code de retirada será liberado automaticamente após a confirmação do pagamento via
            Pix
          </Text>
        </View>

        <TouchableOpacity style={styles.copyPixBtn} onPress={handleCopyPix}>
          <Feather name="copy" size={16} color={COLORS.branco} />
          <Text style={styles.copyPixBtnText}>Copiar código Pix (copia e cola)</Text>
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
    fontWeight: '800',
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
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.preto,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
  },
  totalPendingText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#B87D14',
    marginTop: 2,
  },
  itemBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.creme,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.preto,
  },
  itemSub: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '800',
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
    color: '#7A4F08',
    lineHeight: 15,
  },
  copyPixBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.tomate,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  copyPixBtnText: {
    color: COLORS.branco,
    fontSize: 13,
    fontWeight: '800',
  },
});