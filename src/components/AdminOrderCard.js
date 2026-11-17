import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function AdminOrderCard({
  order,
  onMarkDelivered,
  onCancelOrder,
  onRefundOrder,
}) {
  const getBadgeConfig = () => {
    switch (order.status) {
      case 'PAID_WAITING':
        return {
          text: 'Pago • Aguarda Retirada',
          bg: '#E6F2F8',
          color: COLORS.mediterraneo,
          border: COLORS.mediterraneo,
        };
      case 'DELIVERED_DRIVE':
        return {
          text: 'Entregue com Sucesso',
          bg: '#E8F5E9',
          color: '#2E7D32',
          border: '#C8E6C9',
        };
      case 'PENDING_PIX':
        return {
          text: 'Aguardando Pagamento Pix',
          bg: '#FFF3D1',
          color: '#B87D14',
          border: COLORS.acafrao,
        };
      case 'DELIVERED_SALON':
        return {
          text: 'Entregue • Salão Solidário',
          bg: '#E8F5E9',
          color: '#2E7D32',
          border: '#C8E6C9',
        };
      case 'CANCELLED':
        return {
          text: 'Cancelado • Estoque Devolvido',
          bg: '#FDE8E6',
          color: COLORS.tomate,
          border: COLORS.tomate,
        };
      case 'REFUNDED':
        return {
          text: 'Reembolsado • Estornado',
          bg: '#FDE8E6',
          color: COLORS.tomate,
          border: COLORS.tomate,
        };
      default:
        return {
          text: order.statusLabel || 'Processando',
          bg: COLORS.creme,
          color: COLORS.preto,
          border: '#EADBC0',
        };
    }
  };

  const badge = getBadgeConfig();

  const handleMoreOptions = () => {
    if (order.status === 'PAID_WAITING') {
      Alert.alert(
        `Opções do Pedido ${order.code}`,
        'Selecione uma ação administrativa (registrada no histórico de auditoria):',
        [
          { text: 'Fechar', style: 'cancel' },
          {
            text: 'Reembolsar Pedido (Devolver Estoque)',
            style: 'destructive',
            onPress: () => onRefundOrder && onRefundOrder(order.id),
          },
        ]
      );
    } else {
      Alert.alert('Auditoria do Pedido', `Código: ${order.code}\nCliente: ${order.customer}`);
    }
  };

  return (
    <View style={[styles.card, { borderColor: badge.border }]}>
      {/* Linha 1: Código, Badge de Status e Valor */}
      <View style={styles.topRow}>
        <View style={styles.codeBadgeGroup}>
          <Text style={styles.orderCode}>{order.code}</Text>
          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.statusBadgeText, { color: badge.color }]}>{badge.text}</Text>
          </View>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.amountText}>
            R$ {Number(order.amount).toFixed(2).replace('.', ',')}
          </Text>
          <Text
            style={[
              styles.timeText,
              order.status === 'PENDING_PIX' && { color: COLORS.tomate, fontWeight: '800' },
            ]}
          >
            {order.timeLabel}
          </Text>
        </View>
      </View>

      {/* Linha 2: Nome do Comprador e Telefone */}
      <View style={styles.customerRow}>
        <Text style={styles.customerName}>{order.customer}</Text>
        <Text style={styles.dotSeparator}>•</Text>
        <Text style={styles.customerPhone}>{order.phone}</Text>
      </View>

      {/* Linha 3: Resumo dos Itens */}
      <View style={styles.itemsBox}>
        <Text style={styles.itemsSummaryText}>{order.itemsSummary}</Text>
        {order.unitPriceNote && (
          <Text style={styles.unitPriceNote}>{order.unitPriceNote}</Text>
        )}
      </View>

      {/* Linha 4: Metadados de Logística / Veículo / Mesa / Doação */}
      <View style={styles.tagsRow}>
        {order.channelTag && (
          <View style={styles.infoTag}>
            <Ionicons
              name={order.channelIcon || 'car-sport-outline'}
              size={13}
              color={COLORS.mediterraneo}
            />
            <Text style={styles.infoTagText}>{order.channelTag}</Text>
          </View>
        )}

        {order.extraBadge && (
          <View style={styles.extraDonationTag}>
            <Ionicons name="heart" size={12} color={COLORS.tomate} />
            <Text style={styles.extraDonationText}>{order.extraBadge}</Text>
          </View>
        )}
      </View>

      {/* Linha 5: Rodapé de Ações conforme o Status */}
      {order.status === 'PAID_WAITING' && (
        <View style={styles.actionsFooter}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() =>
              Alert.alert('Comprovante Pix 💠', `Chave de transação confirmada para ${order.code}`)
            }
          >
            <Text style={styles.secondaryBtnText}>Ver Pix</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryDeliverBtn}
            onPress={() => onMarkDelivered && onMarkDelivered(order.id)}
          >
            <Feather name="check" size={15} color={COLORS.branco} />
            <Text style={styles.primaryDeliverBtnText}>Marcar Entregue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.moreIconBtn} onPress={handleMoreOptions}>
            <Feather name="more-vertical" size={16} color={COLORS.preto} />
          </TouchableOpacity>
        </View>
      )}

      {order.status === 'DELIVERED_DRIVE' && (
        <View style={styles.auditFooter}>
          <View>
            <Text style={styles.validatorText}>✅ {order.validatedBy}</Text>
            <Text style={styles.pixIdText}>{order.pixId}</Text>
          </View>
          <TouchableOpacity
            style={styles.receiptLinkBtn}
            onPress={() =>
              Alert.alert('Recibo Oficial 🧾', `Recibo REC-${order.code.replace('#', '')} emitido.`)
            }
          >
            <Feather name="file-text" size={13} color={COLORS.mediterraneo} />
            <Text style={styles.receiptLinkText}>Ver Recibo</Text>
          </TouchableOpacity>
        </View>
      )}

      {order.status === 'PENDING_PIX' && (
        <View style={styles.actionsFooter}>
          <TouchableOpacity
            style={styles.whatsappRemindBtn}
            onPress={() =>
              Alert.alert(
                'Chave Pix Reenviada 📲',
                `Lembrete com código Copia e Cola enviado para ${order.customer}.`
              )
            }
          >
            <Ionicons name="logo-whatsapp" size={15} color="#2E7D32" />
            <Text style={styles.whatsappRemindText}>Reenviar Chave Pix no WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => onCancelOrder && onCancelOrder(order.id)}
          >
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {order.status === 'DELIVERED_SALON' && (
        <View style={styles.auditFooter}>
          <Text style={styles.validatorText}>✅ {order.validatedBy}</Text>
          <TouchableOpacity onPress={handleMoreOptions}>
            <Text style={styles.detailsLinkText}>Detalhes {'>'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.branco,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  codeBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  orderCode: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.preto,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.tomate,
  },
  timeText: {
    fontSize: 10,
    color: COLORS.cinzaTexto,
    marginTop: 2,
    fontWeight: '600',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  customerName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.preto,
  },
  dotSeparator: {
    color: COLORS.cinzaTexto,
    fontSize: 12,
  },
  customerPhone: {
    fontSize: 12,
    color: COLORS.cinzaTexto,
    fontWeight: '600',
  },
  itemsBox: {
    backgroundColor: COLORS.creme,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  itemsSummaryText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.preto,
  },
  unitPriceNote: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cinzaTexto,
    marginLeft: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  infoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FA',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  infoTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.mediterraneo,
  },
  extraDonationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE8E6',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  extraDonationText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.tomate,
  },
  actionsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F2E4C9',
  },
  secondaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: COLORS.creme,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.preto,
  },
  primaryDeliverBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },
  primaryDeliverBtnText: {
    color: COLORS.branco,
    fontSize: 12,
    fontWeight: '800',
  },
  moreIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.creme,
    alignItems: 'center',
    justifyContent: 'center',
  },
  auditFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2E4C9',
  },
  validatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },
  pixIdText: {
    fontSize: 10,
    color: COLORS.cinzaTexto,
    marginTop: 2,
  },
  receiptLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F2F8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  receiptLinkText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.mediterraneo,
  },
  whatsappRemindBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  whatsappRemindText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2E7D32',
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#FDE8E6',
  },
  cancelBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.tomate,
  },
  detailsLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.mediterraneo,
  },
});