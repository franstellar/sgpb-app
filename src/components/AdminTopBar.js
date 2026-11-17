import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function AdminTopBar({ user, onLogout }) {
  return (
    <View style={styles.container}>
      {/* Linha Superior: Marca + Badge Ao Vivo + Sair */}
      <View style={styles.topRow}>
        <View style={styles.brandGroup}>
          <View style={styles.logoBadge}>
            <Text style={{ fontSize: 15 }}>🥘</Text>
          </View>
          <Text style={styles.brandTitle}>Paelito</Text>
          <View style={styles.abadeusTag}>
            <Text style={styles.abadeusTagText}>ABADEUS</Text>
          </View>
        </View>

        <View style={styles.rightActions}>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Ao Vivo</Text>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Feather name="log-out" size={16} color={COLORS.preto} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Linha de Saudação + Botão Relatório */}
      <View style={styles.greetingRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greetingTitle}>
            Olá, {user?.name || 'Coordenação ABADEUS'}
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
            Alert.alert('Relatório Geral 📊', 'Exportando prestação de contas parcial em PDF...')
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
    gap: 6,
  },
  logoBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFE4B5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.tomate,
  },
  abadeusTag: {
    backgroundColor: '#FDE8B2',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  abadeusTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#8B5E08',
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
    fontWeight: '800',
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
    fontWeight: '900',
    color: COLORS.preto,
  },
  subStatusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  editionSub: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    fontWeight: '600',
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
    fontWeight: '700',
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
    fontWeight: '800',
    color: COLORS.mediterraneo,
  },
});