import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import ValidatedTicketCard from '../components/ValidatedTicketCard';

const DEFAULT_TICKET = {
  code: '#PAE-8429',
  validatedTime: 'Hoje, 12:44',
  customerName: 'Maria Clara Silveira',
  customerPhone: '(48) 99842-1082',
  vehicle: 'Drive-Thru • Creta Prata (ABC-1D23)',
  items: [
    {
      qty: '1x',
      name: 'Paella Tradicional Individual (450g)',
      instruction: 'Embalagem Térmica Vermelha',
    },
    {
      qty: '1x',
      name: 'Combo Bebida: Suco Natural Laranja',
      instruction: 'Garrafinha 300ml gelada',
    },
    {
      qty: '1x',
      name: 'Kit Pedagógico ABADEUS',
      instruction: 'Entregar brinde adesivo comemorativo',
    },
  ],
};

export default function AdminCheckinScreen({ user }) {
  const [manualQuery, setManualQuery] = useState('');
  const [currentTicket, setCurrentTicket] = useState(DEFAULT_TICKET);
  const [deliveredCount, setDeliveredCount] = useState(84);
  const [cameraFlash, setCameraFlash] = useState(false);

  const volunteerShortName = user?.name ? user.name.split(' ')[0] : 'Carlos M.';

  const handleManualValidate = () => {
    const formatted = manualQuery.trim().toUpperCase();
    if (!formatted) {
      Alert.alert('Digite um código', 'Informe o número do pedido (ex: #PAE-8429) ou telefone.');
      return;
    }

    setCurrentTicket({
      ...DEFAULT_TICKET,
      code: formatted.startsWith('#') ? formatted : `#${formatted}`,
      validatedTime: 'Agora mesmo',
    });
    setManualQuery('');
  };

  const handleConfirmDelivery = () => {
    setDeliveredCount((prev) => prev + 1);
    Alert.alert(
      'Entrega Confirmada! ✅',
      `Recibo REC-${currentTicket.code.replace('#', '')} emitido com sucesso. Próximo veículo da fila!`
    );
  };

  const handleReportIssue = () => {
    Alert.alert(
      'Chamar Suporte 🚨',
      'Um alerta foi enviado para a Coordenação ABADEUS vir até o Posto 01: Drive-Thru Pista A.'
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. CABEÇALHO DO POSTO DE ATENDIMENTO */}
      <View style={styles.stationCard}>
        <View style={styles.stationLeft}>
          <View style={styles.stationIconBox}>
            <Ionicons name="navigate-circle-outline" size={22} color={COLORS.mediterraneo} />
          </View>
          <View>
            <Text style={styles.stationOverline}>POSTO DE ATENDIMENTO</Text>
            <Text style={styles.stationTitle}>Posto 01: Drive-Thru Pista A</Text>
          </View>
        </View>

        <View style={styles.operatorPill}>
          <Feather name="user" size={12} color={COLORS.preto} />
          <Text style={styles.operatorName}>{volunteerShortName}</Text>
        </View>
      </View>

      {/* 2. VISOR DA CÂMERA ATIVA (SCANNER QR CODE) */}
      <View style={styles.scannerWrapper}>
        <View style={styles.scannerTopRow}>
          <View style={styles.cameraActiveBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.cameraActiveText}>Câmera Ativa</Text>
          </View>

          <TouchableOpacity
            style={styles.flashBtn}
            onPress={() => setCameraFlash((prev) => !prev)}
          >
            <Ionicons
              name={cameraFlash ? 'flash' : 'flash-off-outline'}
              size={16}
              color={COLORS.branco}
            />
          </TouchableOpacity>
        </View>

        {/* Mira do QR Code */}
        <View style={styles.reticleBox}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
          <Ionicons name="qr-code-outline" size={76} color="rgba(255,255,255,0.45)" />
          <View style={styles.scanLaserLine} />
        </View>

        <Text style={styles.scannerHint}>
          Aponte para o QR Code no smartphone ou no voucher impresso
        </Text>
      </View>

      {/* 3. VALIDAÇÃO MANUAL POR CÓDIGO OU TELEFONE */}
      <View style={styles.manualCard}>
        <Text style={styles.manualTitle}>Ou valide digitando o código</Text>
        <Text style={styles.manualLabel}>Código ou Telefone</Text>

        <View style={styles.manualInputRow}>
          <TextInput
            style={styles.manualInput}
            placeholder="Ex: #PAE-8429 ou 48 99842"
            placeholderTextColor={COLORS.cinzaTexto}
            value={manualQuery}
            onChangeText={setManualQuery}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.validateBtn} onPress={handleManualValidate}>
            <Feather name="search" size={15} color={COLORS.branco} />
            <Text style={styles.validateBtnText}>Validar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. CARD DO TICKET VALIDADO */}
      <ValidatedTicketCard
        ticket={currentTicket}
        onConfirmDelivery={handleConfirmDelivery}
        onReportIssue={handleReportIssue}
      />

      {/* 5. BANNER DE PRODUTIVIDADE DA PISTA */}
      <View style={styles.statsFooterCard}>
        <View style={styles.statsIconCircle}>
          <Ionicons name="trophy" size={20} color="#8B5E08" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.statsTitle}>{deliveredCount} pedidos entregues</Text>
          <Text style={styles.statsSub}>
            Pista A liderando a solidariedade hoje. Obrigado pelo seu carinho, Carlos!
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
    backgroundColor: COLORS.branco,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  stationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stationIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#E6F2F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationOverline: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.cinzaTexto,
    letterSpacing: 0.5,
  },
  stationTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.preto,
    marginTop: 1,
  },
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
  operatorName: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.preto,
  },
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
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#4CAF50',
  },
  cameraActiveText: {
    color: COLORS.branco,
    fontSize: 11,
    fontWeight: '800',
  },
  flashBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticleBox: {
    width: 170,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 8,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: COLORS.acafrao,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  scanLaserLine: {
    position: 'absolute',
    width: '82%',
    height: 2,
    backgroundColor: COLORS.tomate,
  },
  scannerHint: {
    color: '#D0D7DE',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  manualCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  manualTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.preto,
    marginBottom: 6,
  },
  manualLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cinzaTexto,
    marginBottom: 6,
  },
  manualInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  manualInput: {
    flex: 1,
    backgroundColor: COLORS.creme,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '700',
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
  validateBtnText: {
    color: COLORS.branco,
    fontSize: 13,
    fontWeight: '800',
  },
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
  statsTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.preto,
  },
  statsSub: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    marginTop: 2,
    lineHeight: 15,
  },
});