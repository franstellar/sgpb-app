import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import ValidatedTicketCard from '../components/ValidatedTicketCard';
import { api } from '../services/api';
import { validateOrderPickup } from '../db';

export default function AdminCheckinScreen({ user }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [manualQuery, setManualQuery] = useState('');
  const [currentTicket, setCurrentTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [deliveredCount, setDeliveredCount] = useState(0);
  const [offlineQueue, setOfflineQueue] = useState([]);

  const volunteerShortName = user?.name ? user.name.split(' ')[0] : 'Voluntário';

  const lookupOrder = async (rawCode, method = 'MANUAL_CODE') => {
    const cleanCode = String(rawCode || '').trim().replace('#', '').toUpperCase();
    if (!cleanCode) {
      Alert.alert('Digite um código', 'Informe o número do pedido (ex: PAEL-A1B2C3).');
      return;
    }

    setLoading(true);
    try {
      const data = await api.getOrderByNumber(cleanCode);
      const { order, items, alreadyPickedUp, pickupValidation } = data;

      if (alreadyPickedUp || order.status === 'PICKED_UP') {
        const validator = pickupValidation?.validatedBy?.name || 'Equipe ABADEUS';
        const time = pickupValidation?.validatedAt
          ? new Date(pickupValidation.validatedAt).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'anteriormente';

        Alert.alert(
          'Retirada duplicada bloqueada',
          `O pedido #${order.orderNumber} já foi retirado por ${validator} às ${time}.`
        );
        setCurrentTicket(null);
        return;
      }

      if (order.status !== 'PAID') {
        Alert.alert(
          'Pedido não liberado',
          `O pedido #${order.orderNumber} está com status "${order.status}". Apenas pedidos PAGOS podem ser retirados.`
        );
        setCurrentTicket(null);
        return;
      }

      setCurrentTicket({
        code: `#${order.orderNumber}`,
        rawOrderNumber: order.orderNumber,
        validationMethod: method,
        validatedTime: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        customerName: order.user?.name || 'Cliente',
        customerPhone: order.user?.phone || '(48) 99842-1082',
        vehicle: `Origem: ${order.origin || 'APP'} • Pago via Pix`,
        items: (items || []).map((i) => ({
          qty: `${i.quantity}x`,
          name: i.product?.name || 'Item Paelito',
          instruction: `Subtotal: R$ ${Number(i.subtotal).toFixed(2).replace('.', ',')}`,
        })),
      });
    } catch (err) {
      if (err.isNetworkError) {
        Alert.alert(
          'Modo contingência offline',
          'Sem conexão com a API. Deseja validar diretamente no banco local SQLite?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Validar offline',
              onPress: () => handleOfflineValidation(cleanCode, method),
            },
          ]
        );
      } else {
        Alert.alert('Pedido não encontrado', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOfflineValidation = (cleanCode, method) => {
    try {
      const localOrder = validateOrderPickup(cleanCode);
      setOfflineQueue((prev) => [
        ...prev,
        {
          orderNumber: cleanCode,
          volunteerUserId: user?.id || 2,
          validationMethod: method,
        },
      ]);
      setDeliveredCount((prev) => prev + 1);
      Alert.alert(
        'Validado offline!',
        `Pedido #${localOrder.order_number} baixado no SQLite local. Sincronize quando a internet voltar.`
      );
    } catch (dbErr) {
      Alert.alert('Bloqueado no modo offline', dbErr.message);
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);
    setCameraActive(false);
    lookupOrder(data, 'QR_CODE');
    setTimeout(() => setScanned(false), 2000);
  };

  const handleToggleCamera = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Câmera no navegador', 'Use a validação manual no navegador ou teste o scanner no celular.');
      return;
    }
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert('Permissão negada', 'Libere o acesso à câmera nas configurações para ler QR Codes.');
        return;
      }
    }
    setScanned(false);
    setCameraActive((prev) => !prev);
  };

  const handleConfirmDelivery = async () => {
    if (!currentTicket) return;
    setLoading(true);
    try {
      const receipt = await api.validatePickup(
        currentTicket.rawOrderNumber,
        user?.id || 2,
        currentTicket.validationMethod || 'MANUAL_CODE'
      );
      setDeliveredCount((prev) => prev + 1);
      setCurrentTicket(null);
      Alert.alert(
        'Entrega confirmada!',
        `Recibo ${receipt.receiptCode} emitido com sucesso. Próximo da fila!`
      );
    } catch (err) {
      Alert.alert('Erro na validação', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncOffline = async () => {
    if (offlineQueue.length === 0) {
      Alert.alert('Tudo sincronizado', 'Nenhuma validação offline pendente de envio.');
      return;
    }
    setLoading(true);
    try {
      const result = await api.syncOfflinePickups(offlineQueue);
      setOfflineQueue([]);
      Alert.alert(
        'Sincronização concluída',
        `Enviados: ${result.syncedCount}\nErros: ${result.errors?.length || 0}`
      );
    } catch (err) {
      Alert.alert('Falha na sincronização', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho do posto */}
      <View style={styles.stationCard}>
        <View style={styles.stationLeft}>
          <View style={styles.stationIconBox}>
            <Ionicons name="navigate-circle-outline" size={22} color={COLORS.mediterraneo} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.stationOverline}>POSTO DE ATENDIMENTO</Text>
            <Text style={styles.stationTitle}>Posto 01: Drive-Thru pista A</Text>
          </View>
        </View>

        <View style={styles.operatorPill}>
          <Feather name="user" size={12} color={COLORS.preto} />
          <Text style={styles.operatorName}>{volunteerShortName}</Text>
        </View>
      </View>

      {/* Scanner QR Code real */}
      <View style={styles.scannerWrapper}>
        <View style={styles.scannerTopRow}>
          <View style={styles.cameraActiveBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.cameraActiveText}>
              {cameraActive ? 'Câmera ativa' : 'Leitor QR Code'}
            </Text>
          </View>

          <TouchableOpacity style={styles.flashBtn} onPress={handleToggleCamera}>
            <Ionicons
              name={cameraActive ? 'close' : 'camera-outline'}
              size={18}
              color={COLORS.branco}
            />
          </TouchableOpacity>
        </View>

        {cameraActive && Platform.OS !== 'web' ? (
          <View style={styles.cameraBox}>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
          </View>
        ) : (
          <TouchableOpacity style={styles.reticleBox} onPress={handleToggleCamera}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            <Ionicons name="qr-code-outline" size={70} color="rgba(255,255,255,0.6)" />
            <Text style={styles.tapToScanText}>Toque para abrir a câmera</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.scannerHint}>
          Aponte para o QR Code no smartphone ou no voucher impresso do apoiador
        </Text>
      </View>

      {/* Validação manual */}
      <View style={styles.manualCard}>
        <Text style={styles.manualTitle}>Ou valide digitando o código do pedido</Text>
        <Text style={styles.manualLabel}>Código do pedido</Text>

        <View style={styles.manualInputRow}>
          <TextInput
            style={styles.manualInput}
            placeholder="Ex: PAEL-8429A1"
            placeholderTextColor={COLORS.cinzaTexto}
            value={manualQuery}
            onChangeText={setManualQuery}
            autoCapitalize="characters"
            onSubmitEditing={() => lookupOrder(manualQuery, 'MANUAL_CODE')}
          />
          <TouchableOpacity
            style={styles.validateBtn}
            onPress={() => lookupOrder(manualQuery, 'MANUAL_CODE')}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.branco} />
            ) : (
              <>
                <Feather name="search" size={15} color={COLORS.branco} />
                <Text style={styles.validateBtnText}>Buscar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Card do ticket validado */}
      <ValidatedTicketCard
        ticket={currentTicket}
        onConfirmDelivery={handleConfirmDelivery}
        onReportIssue={() =>
          Alert.alert('Suporte acionado', 'Coordenação ABADEUS notificada no Posto 01.')
        }
      />

      {/* Contingência offline */}
      {offlineQueue.length > 0 && (
        <TouchableOpacity style={styles.syncOfflineBtn} onPress={handleSyncOffline}>
          <Feather name="upload-cloud" size={16} color={COLORS.branco} />
          <Text style={styles.syncOfflineText}>
            Sincronizar {offlineQueue.length} retirada(s) offline
          </Text>
        </TouchableOpacity>
      )}

      {/* Produtividade */}
      <View style={styles.statsFooterCard}>
        <View style={styles.statsIconCircle}>
          <Ionicons name="trophy" size={20} color="#8B5E08" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.statsTitle}>{deliveredCount} entregas nesta sessão</Text>
          <Text style={styles.statsSub}>
            Validação única ativa: ingressos já entregues são bloqueados automaticamente.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.creme },
  scrollContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 100 },
  stationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.branco,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  stationLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  stationIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#E6F2F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationOverline: { fontSize: 9, fontFamily: FONTS.bodyBold, color: COLORS.cinzaTexto, letterSpacing: 0.5 },
  stationTitle: { fontSize: 13, fontFamily: FONTS.bodyBold, color: COLORS.preto, marginTop: 1 },
  operatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.creme,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 5,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  operatorName: { fontSize: 11, fontFamily: FONTS.bodyBold, color: COLORS.preto },
  scannerWrapper: {
    backgroundColor: '#1E242B',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 3,
  },
  scannerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  cameraActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 125, 50, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  greenDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#4CAF50' },
  cameraActiveText: { color: COLORS.branco, fontSize: 11, fontFamily: FONTS.bodyBold },
  flashBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBox: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
    marginVertical: 6,
  },
  reticleBox: {
    width: 190,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 8,
  },
  tapToScanText: {
    color: COLORS.acafrao,
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    marginTop: 8,
  },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: COLORS.acafrao },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  scannerHint: { color: '#D0D7DE', fontSize: 11, textAlign: 'center', marginTop: 8, fontFamily: FONTS.bodyMedium },
  manualCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  manualTitle: { fontSize: 14, fontFamily: FONTS.bodyBold, color: COLORS.preto, marginBottom: 6 },
  manualLabel: { fontSize: 10, fontFamily: FONTS.bodySemiBold, color: COLORS.cinzaTexto, marginBottom: 6 },
  manualInputRow: { flexDirection: 'row', gap: 8 },
  manualInput: {
    flex: 1,
    backgroundColor: COLORS.creme,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.preto,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  validateBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.tomate,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  validateBtnText: { color: COLORS.branco, fontSize: 13, fontFamily: FONTS.bodyBold },
  syncOfflineBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.mediterraneo,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },
  syncOfflineText: { color: COLORS.branco, fontSize: 13, fontFamily: FONTS.bodyBold },
  statsFooterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF1D6',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F3DFB3',
  },
  statsIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.acafrao,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsTitle: { fontSize: 15, fontFamily: FONTS.headingExtraBold, color: COLORS.preto },
  statsSub: { fontSize: 11, fontFamily: FONTS.bodyRegular, color: COLORS.cinzaTexto, marginTop: 2, lineHeight: 16 },
});