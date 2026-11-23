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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';

const LOGO_PAELITO = require('../../assets/images/logo-paelito.png');
const ABADEUS_LOGO = require('../../assets/images/logo-abadeus.png');

const DEMO_USERS = {
  BUYER: {
    id: 4,
    name: 'Cliente',
    email: 'cliente@email.com',
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
    name: 'Voluntário',
    email: 'voluntario@abadeus.com.br',
    phone: '(48) 99999-1111',
    role: 'VOLUNTEER',
  },
  PARTNER: {
    id: 3,
    name: 'Parceiro',
    email: 'parceiro@abadeus.com.br',
    phone: '(48) 99999-2222',
    role: 'PARTNER',
  },
};

export default function AuthScreen({ onLoginSuccess }) {
  const [mode, setMode] = useState('BUYER'); // BUYER | STAFF

  // Campos apoiador / comprador
  const [buyerName, setBuyerName] = useState('Cliente');
  const [buyerEmail, setBuyerEmail] = useState('cliente@email.com');
  const [buyerPhone, setBuyerPhone] = useState('(48) 99999-9999');

  // Campos equipe (admin / voluntário / parceiro)
  const [staffEmail, setStaffEmail] = useState('admin@abadeus.com.br');
  const [staffPassword, setStaffPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleBuyerSubmit = () => {
    if (!buyerName.trim() || !buyerEmail.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha seu nome e e-mail para continuar');
      return;
    }

    onLoginSuccess({
      id: 4,
      name: buyerName.trim(),
      email: buyerEmail.trim(),
      phone: buyerPhone.trim() || '(48) 99842-1082',
      role: 'BUYER',
    });
  };

  const handleStaffLogin = () => {
    if (failedAttempts >= 5) {
      Alert.alert(
        'Acesso bloqueado',
        'Limite de 5 tentativas excedido! Sua conta está temporariamente bloqueada por 5 minutos'
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
        'Acesso bloqueado',
        '5 tentativas inválidas registradas. O acesso foi bloqueado por 5 minutos'
      );
    } else {
      Alert.alert(
        'Credenciais inválidas',
        `Senha ou e-mail incorretos. Tentativa ${nextAttempts} de 5`
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.creme} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Cabeçalho da marca Paelito */}
        <View style={styles.headerCenter}>
          <View style={styles.topBadgesRow}>
            <View style={styles.editionPill}>
              <View style={styles.redDot} />
              <Text style={styles.editionPillText}>12ª edição solidária</Text>
            </View>
            <View style={styles.abadeusPill}>
              <Image source={ABADEUS_LOGO} style={styles.abadeusLogo} resizeMode="contain" />
              <Text style={styles.abadeusPillText}>ABADEUS</Text>
            </View>
          </View>

          <View style={styles.brandRow}>
            <Image source={LOGO_PAELITO} style={styles.loginLogo} resizeMode="contain" />
            <Text style={styles.brandTitle}>Paelito</Text>
          </View>

          <Text style={styles.heroSubtitle}>
            Mais que uma paella, uma boa causa para aquecer corações!
          </Text>
        </View>

        {/* 2. Seletor de perfil: apoiador vs equipe ABADEUS */}
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
              Sou apoiador
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
              Sou da equipe
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3A. Visão do apoiador / comprador */}
        {mode === 'BUYER' ? (
          <View style={styles.formCard}>
            <View style={styles.cardHeaderRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.cardOverline}>Acesso rápido do cliente</Text>
                <Text style={styles.cardTitle}>Garanta sua paella</Text>
              </View>
              <View style={styles.pixFastBadge}>
                <Ionicons name="flash" size={12} color={COLORS.mediterraneo} />
                <Text style={styles.pixFastText}>Pix + QR Code</Text>
              </View>
            </View>

            <Text style={styles.cardDesc}>
              Identifique-se rapidamente para escolher suas porções e receber seu voucher digital de
              retirada no drive-thru ou salão
            </Text>

            <Text style={styles.inputLabel}>Nome completo</Text>
            <TextInput
              style={styles.input}
              value={buyerName}
              onChangeText={setBuyerName}
              placeholder="Digite seu nome completo"
              placeholderTextColor={COLORS.cinzaTexto}
            />

            <Text style={styles.inputLabel}>E-mail para recibo e QR Code</Text>
            <TextInput
              style={styles.input}
              value={buyerEmail}
              onChangeText={setBuyerEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="seu@email.com"
              placeholderTextColor={COLORS.cinzaTexto}
            />

            <Text style={styles.inputLabel}>WhatsApp (aviso de pedido pronto)</Text>
            <TextInput
              style={styles.input}
              value={buyerPhone}
              onChangeText={setBuyerPhone}
              keyboardType="phone-pad"
              placeholder="(48) 99999-9999"
              placeholderTextColor={COLORS.cinzaTexto}
            />

            <TouchableOpacity style={styles.primaryBuyerBtn} onPress={handleBuyerSubmit}>
              <Text style={styles.primaryBuyerBtnText}>Entrar e ver cardápio solidário</Text>
              <Feather name="arrow-right" size={18} color={COLORS.branco} />
            </TouchableOpacity>
          </View>
        ) : (
          /* 3B. Visão da equipe (admin, voluntário, parceiro) */
          <View style={styles.formCard}>
            <View style={styles.cardHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardOverline, { color: COLORS.mediterraneo }]}>
                  Acesso restrito
                </Text>
                <Text style={styles.cardTitle}>Portal da equipe ABADEUS</Text>
              </View>
            </View>

            <Text style={styles.cardDesc}>
              Exclusivo para coordenação, voluntários do check-in expresso e parceiros cadastrados
              pela organização
            </Text>

            <Text style={styles.inputLabel}>E-mail institucional/operador</Text>
            <TextInput
              style={styles.input}
              value={staffEmail}
              onChangeText={setStaffEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="admin@abadeus.com.br"
              placeholderTextColor={COLORS.cinzaTexto}
            />

            <Text style={styles.inputLabel}>Código/senha de acesso</Text>
            <View style={styles.passwordInputWrap}>
              <TextInput
                style={styles.passwordInput}
                value={staffPassword}
                onChangeText={setStaffPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                placeholder="Digite sua senha"
                placeholderTextColor={COLORS.cinzaTexto}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={18}
                  color={COLORS.cinzaTexto}
                />
              </TouchableOpacity>
            </View>

            {failedAttempts > 0 && (
              <View style={styles.lockoutWarningBox}>
                <Feather name="alert-circle" size={14} color={COLORS.tomate} />
                <Text style={styles.lockoutWarningText}>
                  Atenção: {failedAttempts}/5 tentativas utilizadas (bloqueio de 5 min após 5 erros)
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.primaryStaffBtn} onPress={handleStaffLogin}>
              <Feather name="log-in" size={17} color={COLORS.branco} />
              <Text style={styles.primaryBuyerBtnText}>Acessar painel operacional</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 4. Rodapé informativo do evento */}
        <View style={styles.eventFooterCard}>
          <View style={styles.footerIconBox}>
            <Feather name="calendar" size={18} color={COLORS.tomate} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.footerEventTitle}>Sábado, 28 de novembro • 11h30 às 14h30</Text>
            <Text style={styles.footerEventSub}>
              Drive-thru expresso e salão • Sede ABADEUS (Cristo Redentor, Criciúma/SC)
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
  editionPillText: {
    fontSize: 10,
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.preto,
  },
  abadeusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FDE8B2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  abadeusLogo: {
    width: 15,
    height: 15,
  },
  abadeusPillText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: '#8B5E08',
  },
  loginLogo: {
    width: 210,
    height: 110,
    marginVertical: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.bodyRegular,
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
    fontFamily: FONTS.bodySemiBold,
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
    fontFamily: FONTS.bodyBold,
    color: COLORS.tomate,
    letterSpacing: 0.4,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.preto,
    lineHeight: 28,
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
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.mediterraneo,
  },
  cardDesc: {
    fontSize: 12,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.cinzaTexto,
    lineHeight: 18,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontFamily: FONTS.bodyMedium,
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
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.preto,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  passwordInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.creme,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EADBC0',
    paddingLeft: 14,
    paddingRight: 8,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 13,
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.preto,
  },
  eyeBtn: {
    padding: 6,
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
    fontFamily: FONTS.bodySemiBold,
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
    fontFamily: FONTS.bodyBold,
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
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  footerEventSub: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.cinzaTexto,
    marginTop: 2,
  },
});