import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';

export default function PixPaymentBox({ totalAmount, pixCode, onConfirmOrder, loading }) {
  const [secondsLeft, setSecondsLeft] = useState(14 * 60 + 59); // 14:59

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const defaultPixPayload =
    pixCode ||
    `00020126580014br.gov.bcb.pix0136abadeus-paelito-beneficente-20265204000053039865405${Number(
      totalAmount
    ).toFixed(2)}5802BR5925PAELITO BENEFICENTE ABADE6009CRICIUMA62070503***6304E8A2`;

  const handleCopyPix = () => {
    Alert.alert('Código Pix copiado', 'Cole no aplicativo do seu banco na opção Pix copia e cola');
  };

  return (
    <View style={styles.container}>
      {/* Timer de 15 minutos */}
      <View style={styles.timerBanner}>
        <Feather name="clock" size={15} color="#8B5E08" />
        <Text style={styles.timerText}>
          Você tem <Text style={styles.timerBold}>{formatTime(secondsLeft)} minutos</Text> para
          concluir o Pix
        </Text>
      </View>

      {/* Moldura do QR Code */}
      <View style={styles.qrOuterFrame}>
        <View style={styles.qrInnerBox}>
          <Ionicons name="qr-code" size={150} color={COLORS.preto} />
          <View style={styles.qrCenterBadge}>
            <View style={styles.qrCenterDot} />
          </View>
        </View>
      </View>

      <Text style={styles.instructions}>
        Abra o app do seu banco, escolha <Text style={styles.instructionsBold}>Pagar via Pix</Text>{' '}
        e aponte a câmera para o QR Code acima
      </Text>

      {/* Caixa do Pix copia e cola */}
      <View style={styles.copyPasteBox}>
        <Text style={styles.copyPasteCode} numberOfLines={3}>
          {defaultPixPayload}
        </Text>
      </View>

      <TouchableOpacity style={styles.copyBtn} onPress={handleCopyPix}>
        <Feather name="copy" size={16} color={COLORS.tomate} />
        <Text style={styles.copyBtnText}>Copiar código Pix copia e cola</Text>
      </TouchableOpacity>

      <View style={styles.autoNoticeRow}>
        <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.mediterraneo} />
        <Text style={styles.autoNoticeText}>
          Assim que confirmado pelo banco, seu QR Code de retirada será emitido automaticamente e
          enviado por WhatsApp e e-mail
        </Text>
      </View>

      {/* Botão principal concluir pedido com Pix */}
      <TouchableOpacity
        style={[styles.confirmBtn, loading && { opacity: 0.7 }]}
        onPress={onConfirmOrder}
        disabled={loading}
      >
        <Text style={styles.confirmBtnText}>
          {loading ? 'Processando pedido...' : 'Concluir pedido com Pix'}
        </Text>
        <Feather name="check-circle" size={18} color={COLORS.branco} />
      </TouchableOpacity>

      <View style={styles.secureRow}>
        <Feather name="lock" size={12} color={COLORS.cinzaTexto} />
        <Text style={styles.secureText}>Ambiente seguro de arrecadação ABADEUS</Text>
      </View>
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
  qrInnerBox: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCenterBadge: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.acafrao,
    borderWidth: 3,
    borderColor: COLORS.tomate,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCenterDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.tomate,
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
    marginBottom: 14,
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
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  autoNoticeText: {
    flex: 1,
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.mediterraneo,
    lineHeight: 15,
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
    fontSize: 15,
    fontFamily: FONTS.bodyBold,
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