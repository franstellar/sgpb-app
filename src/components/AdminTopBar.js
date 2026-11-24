import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';

const LOGO_HORIZONTAL = require('../../assets/images/logo-horizontal.png');
const ABADEUS_LOGO = require('../../assets/images/logo-abadeus.png');

export default function AdminTopBar({ user, onLogout }) {
  return (
    <View style={styles.container}>
      {/* Linha Superior: Logos + Badge Ao Vivo + Sair */}
      <View style={styles.topRow}>
        <View style={styles.brandGroup}>
          <Image source={LOGO_HORIZONTAL} style={styles.brandLogo} resizeMode="contain" />
          <View style={styles.abadeusTag}>
            <Image source={ABADEUS_LOGO} style={styles.abadeusLogo} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.rightActions}>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Ao vivo</Text>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Feather name="log-out" size={16} color={COLORS.preto} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Linha de Saudação + Botão Relatório */}
      <View style={styles.greetingRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greetingTitle} numberOfLines={1}>
            Olá, {user?.name || 'Coordenação'}
          </Text>
          <View style={styles.subStatusRow}>
            <Text style={styles.editionSub}>12ª Edição Paelito • Sábado, 28/Nov</Text>
            <View style={styles.activeOpWrap}>
              <View style={styles.greenDot} />
              <Text style={styles.activeOpText}>Operação Ativa</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.reportBtn}
          onPress={() =>
            Alert.alert('Relatório geral', 'Exportando prestação de contas parcial em PDF...')
          }
        >
          <Feather name="file-text" size={14} color={COLORS.mediterraneo} />
          <Text style={styles.reportBtnText}>Relatório</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.creme,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EADBC0',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogo: {
    width: 112,
    height: 32,
  },
  abadeusTag: {
    backgroundColor: '#FDE8B2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  abadeusLogo: {
    width: 56,
    height: 15,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
  },
  liveText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: '#2E7D32',
  },
  logoutBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.branco,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  greetingTitle: {
    fontSize: 20,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.preto,
    lineHeight: 26,
  },
  subStatusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  editionSub: {
    fontSize: 11,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.cinzaTexto,
  },
  activeOpWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
  },
  activeOpText: {
    fontSize: 11,
    fontFamily: FONTS.bodySemiBold,
    color: '#2E7D32',
  },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.branco,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0E2E8',
    gap: 5,
  },
  reportBtnText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: COLORS.mediterraneo,
  },
});