import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';

export default function PixPaymentBox({
  totalAmount,
  pendingOrder,
  onCreatePendingOrder,
  onConfirmPayment,
  onPayLater,
  loading,
}) {
  const [secondsLeft, setSecondsLeft] = useState(14 * 60 + 59);

  useEffect(() => {
    if (!pendingOrder) {
      setSecondsLeft(14 * 60 + 59);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [pendingOrder]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const pixPayload =
    pendingOrder?.pixCopyPaste ||
    `00020126580014BR.GOV.BCB.PIX0136abadeus-paelito@pix.org.br5204000053039865406${Number(
      totalAmount
    ).toFixed(2)}5802BR5915ABADEUS PAELITO6008CRICIUMA62070503***6304ABCD`;

  const handleCopyPix = async () => {
    await Clipboard.setStringAsync(pixPayload);
    Alert.alert('Código Pix copiado', 'Cole no aplicativo do seu banco na opção Pix copia e cola');
  };

  // Antes de gerar o pedido: botão para reservar estoque por 15 min
  if (!pendingOrder) {
    return (
      <View style={styles.container}>
        <View style={styles.autoNoticeRow}>
          <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.mediterraneo} />
          <Text style={styles.autoNoticeText}>
            Ao gerar o Pix, suas porções ficam reservadas no estoque por 15 minutos aguardando a
            confirmação do pagamento.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.confirmBtn, loading && { opacity: 0.7 }]}
          onPress={onCreatePendingOrder}
          disabled={loading}
        >
          <Text style={styles.confirmBtnText}>
            {loading ? 'Reservando estoque...' : 'Gerar pedido e código Pix'}
          </Text>
          <Feather name="arrow-right" size={18} color={COLORS.branco} />
        </TouchableOpacity>

        <View style={styles.secureRow}>
          <Feather name="lock" size={12} color={COLORS.cinzaTexto} />
          <Text style={styles.secureText}>Ambiente seguro de arrecadação ABADEUS</Text>
        </View>
      </View>
    );
  }

  // PENDING: QR Code real + timer + confirmação
  return (
    <View style={styles.container}>
      <View style={styles.timerBanner}>
        <Feather name="clock" size={15} color="#8B5E08" />
        <Text style={styles.timerText}>
          Pedido <Text style={styles.timerBold}>#{pendingOrder.orderNumber}</Text> reservado por{' '}
          <Text style={styles.timerBold}>{formatTime(secondsLeft)}</Text>
        </Text>
      </View>

      <View style={styles.qrOuterFrame}>
        <QRCode value={pixPayload} size={160} color={COLORS.preto} backgroundColor={COLORS.branco} />
      </View>

      <Text style={styles.instructions}>
        Abra o app do seu banco, escolha <Text style={styles.instructionsBold}>Pagar via Pix</Text>{' '}
        e escaneie o QR Code ou copie o código abaixo
      </Text>

      <View style={styles.copyPasteBox}>
        <Text style={styles.copyPasteCode} numberOfLines={3}>
          {pixPayload}
        </Text>
      </View>

      <TouchableOpacity style={styles.copyBtn} onPress={handleCopyPix}>
        <Feather name="copy" size={16} color={COLORS.tomate} />
        <Text style={styles.copyBtnText}>Copiar código Pix copia e cola</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.confirmBtn, { backgroundColor: '#2E7D32' }, loading && { opacity: 0.7 }]}
        onPress={onConfirmPayment}
        disabled={loading}
      >
        <Feather name="check-circle" size={18} color={COLORS.branco} />
        <Text style={styles.confirmBtnText}>
          {loading ? 'Confirmando pagamento...' : 'Confirmar pagamento Pix'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.payLaterBtn} onPress={onPayLater} disabled={loading}>
        <Text style={styles.payLaterText}>Pagar depois (ver em Meus Pedidos)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.branco,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  timerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3D1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
    marginBottom: 16,
  },
  timerText: {
    fontSize: 12,
    fontFamily: FONTS.bodyMedium,
    color: '#8B5E08',
  },
  timerBold: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.tomate,
  },
  qrOuterFrame: {
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: COLORS.acafrao,
    borderRadius: 18,
    padding: 14,
    backgroundColor: COLORS.branco,
    marginBottom: 12,
  },
  instructions: {
    fontSize: 12,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.cinzaTexto,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 12,
  },
  instructionsBold: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  copyPasteBox: {
    backgroundColor: COLORS.creme,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EADBC0',
    marginBottom: 10,
  },
  copyPasteCode: {
    fontSize: 10,
    color: COLORS.cinzaTexto,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.tomate,
    marginBottom: 12,
  },
  copyBtnText: {
    color: COLORS.tomate,
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
  },
  autoNoticeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F0F7FA',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  autoNoticeText: {
    flex: 1,
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.mediterraneo,
    lineHeight: 16,
  },
  confirmBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.tomate,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
  },
  confirmBtnText: {
    color: COLORS.branco,
    fontSize: 14,
    fontFamily: FONTS.bodyBold,
  },
  payLaterBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 6,
  },
  payLaterText: {
    fontSize: 12,
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.mediterraneo,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  secureText: {
    fontSize: 10,
    color: COLORS.cinzaTexto,
    fontFamily: FONTS.bodyMedium,
  },
});