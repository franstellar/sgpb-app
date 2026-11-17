import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const DEMO_USERS = {
  BUYER: {
    id: 4,
    name: 'Maria Clara Silveira',
    email: 'mariaclara.silveira@email.com',
    phone: '(48) 99842-1082',
    role: 'BUYER',
  },
  ADMIN: {
    id: 1,
    name: 'Coordenação ABADEUS',
    email: 'admin@abadeus.com.br',
    phone: '(48) 99999-0000',
    role: 'ADMIN',
  },
  VOLUNTEER: {
    id: 2,
    name: 'Carlos M. (Voluntário)',
    email: 'voluntario@abadeus.com.br',
    phone: '(48) 99999-1111',
    role: 'VOLUNTEER',
  },
  PARTNER: {
    id: 3,
    name: 'Parceiro Ponto de Venda',
    email: 'parceiro@abadeus.com.br',
    phone: '(48) 99999-2222',
    role: 'PARTNER',
  },
};

export default function AuthScreen({ onLoginSuccess }) {
  const [mode, setMode] = useState('BUYER'); // BUYER | STAFF
  const [isRegistering, setIsRegistering] = useState(false);

  // Campos Apoiador / Comprador
  const [buyerName, setBuyerName] = useState('Maria Clara Silveira');
  const [buyerEmail, setBuyerEmail] = useState('mariaclara.silveira@email.com');
  const [buyerPhone, setBuyerPhone] = useState('(48) 99842-1082');

  // Campos Equipe (Admin / Voluntário / Parceiro)
  const [staffEmail, setStaffEmail] = useState('admin@abadeus.com.br');
  const [staffPassword, setStaffPassword] = useState('ADM123');
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleBuyerSubmit = () => {
    if (!buyerEmail.trim() || (isRegistering && !buyerName.trim())) {
      Alert.alert('Campos obrigatórios', 'Preencha seu nome e e-mail para continuar.');
      return;
    }

    onLoginSuccess({
      id: 4,
      name: buyerName.trim() || 'Maria Clara Silveira',
      email: buyerEmail.trim(),
      phone: buyerPhone.trim() || '(48) 99842-1082',
      role: 'BUYER',
    });
  };

  const handleStaffLogin = () => {
    if (failedAttempts >= 5) {
      Alert.alert(
        'Acesso Bloqueado (NF3.1) 🔒',
        'Limite de 5 tentativas excedido. Sua conta está temporariamente bloqueada por 5 minutos.'
      );
      return;
    }

    const emailClean = staffEmail.trim().toLowerCase();
    const passClean = staffPassword.trim();

    if (emailClean === 'admin@abadeus.com.br' && passClean === 'ADM123') {
      setFailedAttempts(0);
      onLoginSuccess(DEMO_USERS.ADMIN);
      return;
    }

    if (emailClean === 'voluntario@abadeus.com.br' && passClean === 'VOL123') {
      setFailedAttempts(0);
      onLoginSuccess(DEMO_USERS.VOLUNTEER);
      return;
    }

    if (emailClean === 'parceiro@abadeus.com.br' && passClean === 'PAR123') {
      setFailedAttempts(0);
      onLoginSuccess(DEMO_USERS.PARTNER);
      return;
    }

    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);

    if (nextAttempts >= 5) {
      Alert.alert(
        'Alerta de Segurança (NF3.1) 🚨',
        '5 tentativas inválidas registradas. O acesso foi bloqueado por 5 minutos.'
      );
    } else {
      Alert.alert(
        'Credenciais Inválidas',
        `Senha ou e-mail incorretos. Tentativa ${nextAttempts} de 5.`
      );
    }
  };

  const fillAndLoginStaff = (profileKey) => {
    const target = DEMO_USERS[profileKey];
    onLoginSuccess(target);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.creme} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. CABEÇALHO DA MARCA PAELITO */}
        <View style={styles.headerCenter}>
          <View style={styles.topBadgesRow}>
            <View style={styles.editionPill}>
              <View style={styles.redDot} />
              <Text style={styles.editionPillText}>12ª EDIÇÃO SOLIDÁRIA</Text>
            </View>
            <View style={styles.abadeusPill}>
              <Text style={styles.abadeusPillText}>🎉 ABADEUS</Text>
            </View>
          </View>

          <View style={styles.brandRow}>
            <View style={styles.mascotCircle}>
              <Text style={{ fontSize: 24 }}>🥘</Text>
            </View>
            <Text style={styles.brandTitle}>Paelito</Text>
          </View>

          <Text style={styles.heroSubtitle}>
            Mais que uma paella, uma boa causa para aquecer corações em Criciúma/SC!
          </Text>
        </View>

        {/* 2. SELETOR DE PERFIL: APOIADOR vs EQUIPE ABADEUS */}
        <View style={styles.modeSwitchContainer}>
          <TouchableOpacity
            style={[styles.modeTab, mode === 'BUYER' && styles.modeTabActive]}
            onPress={() => setMode('BUYER')}
          >
            <Ionicons
              name="heart-outline"
              size={16}
              color={mode === 'BUYER' ? COLORS.branco : COLORS.preto}
            />
            <Text style={[styles.modeTabText, mode === 'BUYER' && styles.modeTabTextActive]}>
              Sou Apoiador
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTab, mode === 'STAFF' && styles.modeTabActiveStaff]}
            onPress={() => setMode('STAFF')}
          >
            <Feather
              name="shield"
              size={15}
              color={mode === 'STAFF' ? COLORS.branco : COLORS.preto}
            />
            <Text style={[styles.modeTabText, mode === 'STAFF' && styles.modeTabTextActive]}>
              Equipe / Operação
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3A. VISÃO DO APOIADOR / COMPRADOR (F3 - AUTOCADASTRO) */}
        {mode === 'BUYER' ? (
          <View style={styles.formCard}>
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={styles.cardOverline}>ACESSO RÁPIDO DO CLIENTE</Text>
                <Text style={styles.cardTitle}>
                  {isRegistering ? 'Criar Conta Solidária' : 'Garanta sua Paella'}
                </Text>
              </View>
              <View style={styles.pixFastBadge}>
                <Ionicons name="flash" size={12} color={COLORS.mediterraneo} />
                <Text style={styles.pixFastText}>Pix + QR Code</Text>
              </View>
            </View>

            <Text style={styles.cardDesc}>
              Identifique-se rapidamente para escolher suas porções e receber seu Voucher Digital de
              retirada no Drive-Thru ou Salão.
            </Text>

            <Text style={styles.inputLabel}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              value={buyerName}
              onChangeText={setBuyerName}
              placeholder="Ex: Maria Clara Silveira"
              placeholderTextColor={COLORS.cinzaTexto}
            />

            <Text style={styles.inputLabel}>E-mail para Recibo e QR Code</Text>
            <TextInput
              style={styles.input}
              value={buyerEmail}
              onChangeText={setBuyerEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="seu@email.com"
              placeholderTextColor={COLORS.cinzaTexto}
            />

            <Text style={styles.inputLabel}>WhatsApp (Notificação de Pedido Pronto)</Text>
            <TextInput
              style={styles.input}
              value={buyerPhone}
              onChangeText={setBuyerPhone}
              keyboardType="phone-pad"
              placeholder="(48) 99999-9999"
              placeholderTextColor={COLORS.cinzaTexto}
            />

            <TouchableOpacity style={styles.primaryBuyerBtn} onPress={handleBuyerSubmit}>
              <Text style={styles.primaryBuyerBtnText}>
                {isRegistering ? 'Cadastrar e Ver Cardápio' : 'Entrar e Ver Cardápio Solidário'}
              </Text>
              <Feather name="arrow-right" size={18} color={COLORS.branco} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchRegisterLink}
              onPress={() => setIsRegistering((prev) => !prev)}
            >
              <Text style={styles.switchRegisterText}>
                {isRegistering
                  ? 'Já comprou em edições anteriores? Entrar direto'
                  : 'Primeira vez no Paelito? Autocadastro rápido em 1 clique'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* 3B. VISÃO DA EQUIPE (ADMIN, VOLUNTÁRIO, PARCEIRO - F3 & NF3.1) */
          <View style={styles.formCard}>
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={[styles.cardOverline, { color: COLORS.mediterraneo }]}>
                  ACESSO RESTRITO • SGPB
                </Text>
                <Text style={styles.cardTitle}>Portal da Equipe ABADEUS</Text>
              </View>
              <View style={styles.securityBadge}>
                <Feather name="lock" size={12} color="#2E7D32" />
                <Text style={styles.securityBadgeText}>NF3.1 Ativo</Text>
              </View>
            </View>

            <Text style={styles.cardDesc}>
              Exclusivo para Coordenação (Admin), Voluntários do Check-in Express e Parceiros
              cadastrados pelo organizador (Req. F3).
            </Text>

            <Text style={styles.inputLabel}>E-mail Institucional / Operador</Text>
            <TextInput
              style={styles.input}
              value={staffEmail}
              onChangeText={setStaffEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="admin@abadeus.com.br"
              placeholderTextColor={COLORS.cinzaTexto}
            />

            <Text style={styles.inputLabel}>Código / Senha de Acesso</Text>
            <TextInput
              style={styles.input}
              value={staffPassword}
              onChangeText={setStaffPassword}
              secureTextEntry
              placeholder="Digite sua credencial (ex: ADM123)"
              placeholderTextColor={COLORS.cinzaTexto}
            />

            {failedAttempts > 0 && (
              <View style={styles.lockoutWarningBox}>
                <Feather name="alert-circle" size={14} color={COLORS.tomate} />
                <Text style={styles.lockoutWarningText}>
                  Atenção: {failedAttempts}/5 tentativas utilizadas (Bloqueio de 5 min após 5 erros).
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.primaryStaffBtn} onPress={handleStaffLogin}>
              <Feather name="log-in" size={17} color={COLORS.branco} />
              <Text style={styles.primaryBuyerBtnText}>Acessar Painel Operacional</Text>
            </TouchableOpacity>

            {/* Atalhos Rápidos de Demonstração para os Perfis da Equipe */}
            <View style={styles.quickProfilesBox}>
              <Text style={styles.quickProfilesTitle}>
                ⚡ ACESSO RÁPIDO PARA APRESENTAÇÃO (SEEDER):
              </Text>

              <View style={styles.quickButtonsRow}>
                <TouchableOpacity
                  style={[styles.roleChip, { borderColor: COLORS.tomate }]}
                  onPress={() => fillAndLoginStaff('ADMIN')}
                >
                  <Text style={[styles.roleChipTitle, { color: COLORS.tomate }]}>ADMIN</Text>
                  <Text style={styles.roleChipSub}>Coordenação</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleChip, { borderColor: '#2E7D32' }]}
                  onPress={() => fillAndLoginStaff('VOLUNTEER')}
                >
                  <Text style={[styles.roleChipTitle, { color: '#2E7D32' }]}>VOLUNTEER</Text>
                  <Text style={styles.roleChipSub}>Fila QR Code</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleChip, { borderColor: COLORS.mediterraneo }]}
                  onPress={() => fillAndLoginStaff('PARTNER')}
                >
                  <Text style={[styles.roleChipTitle, { color: COLORS.mediterraneo }]}>
                    PARTNER
                  </Text>
                  <Text style={styles.roleChipSub}>Ponto Venda</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* 4. RODAPÉ INFORMATIVO DO EVENTO */}
        <View style={styles.eventFooterCard}>
          <View style={styles.footerIconBox}>
            <Feather name="calendar" size={18} color={COLORS.tomate} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.footerEventTitle}>Sábado, 28 de Novembro • 11h30 às 14h30</Text>
            <Text style={styles.footerEventSub}>
              Drive-Thru Expresso & Salão • Sede ABADEUS (Cristo Redentor, Criciúma/SC)
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.creme },
  container: { flex: 1, backgroundColor: COLORS.creme },
  scrollContent: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 40 },
  headerCenter: {
    alignItems: 'center',
    marginBottom: 18,
  },
  topBadgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  editionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.branco,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.tomate,
    marginRight: 6,
  },
  editionPillText: { fontSize: 10, fontWeight: '800', color: COLORS.preto },
  abadeusPill: {
    backgroundColor: '#FDE8B2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  abadeusPillText: { fontSize: 10, fontWeight: '800', color: '#8B5E08' },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  mascotCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFE4B5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.acafrao,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.tomate,
  },
  heroSubtitle: {
    fontSize: 12,
    color: COLORS.cinzaTexto,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  modeSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFE2C6',
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 13,
    gap: 6,
  },
  modeTabActive: {
    backgroundColor: COLORS.tomate,
    elevation: 2,
  },
  modeTabActiveStaff: {
    backgroundColor: COLORS.mediterraneo,
    elevation: 2,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.preto,
  },
  modeTabTextActive: {
    color: COLORS.branco,
  },
  formCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EADBC0',
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardOverline: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.tomate,
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.preto,
    marginTop: 2,
  },
  pixFastBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F2F8',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  pixFastText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.mediterraneo,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  securityBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2E7D32',
  },
  cardDesc: {
    fontSize: 12,
    color: COLORS.cinzaTexto,
    lineHeight: 17,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cinzaTexto,
    marginBottom: 5,
    marginTop: 8,
  },
  input: {
    backgroundColor: COLORS.creme,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.preto,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  lockoutWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE8E6',
    padding: 10,
    borderRadius: 10,
    gap: 6,
    marginTop: 12,
  },
  lockoutWarningText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.tomate,
  },
  primaryBuyerBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.tomate,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
    elevation: 2,
  },
  primaryStaffBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.mediterraneo,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
    elevation: 2,
  },
  primaryBuyerBtnText: {
    color: COLORS.branco,
    fontSize: 14,
    fontWeight: '900',
  },
  switchRegisterLink: {
    marginTop: 14,
    alignItems: 'center',
  },
  switchRegisterText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.mediterraneo,
  },
  quickProfilesBox: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F2E4C9',
  },
  quickProfilesTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.cinzaTexto,
    marginBottom: 10,
    textAlign: 'center',
  },
  quickButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  roleChip: {
    flex: 1,
    backgroundColor: COLORS.creme,
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  roleChipTitle: {
    fontSize: 11,
    fontWeight: '900',
  },
  roleChipSub: {
    fontSize: 9,
    color: COLORS.cinzaTexto,
    fontWeight: '700',
    marginTop: 2,
  },
  eventFooterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF1D6',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F3DFB3',
  },
  footerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerEventTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.preto,
  },
  footerEventSub: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    marginTop: 2,
  },
});