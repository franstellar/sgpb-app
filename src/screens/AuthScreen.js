import React, { useState, useRef } from 'react';
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
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { api } from '../services/api';
import { loginUser, registerBuyer } from '../db';

const LOGO_PAELITO = require('../../assets/images/logo-paelito.png');
const ABADEUS_LOGO = require('../../assets/images/logo-abadeus.png');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const notifyAlert = (title, message) => {
  if (Platform.OS !== 'web') {
    Alert.alert(title, message);
  }
};

export default function AuthScreen({ onLoginSuccess }) {
  const [mode, setMode] = useState('BUYER'); // BUYER | STAFF
  const [buyerAuthMode, setBuyerAuthMode] = useState('LOGIN'); // LOGIN | REGISTER
  const [loading, setLoading] = useState(false);

  // Campos apoiador / comprador
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerPassword, setBuyerPassword] = useState('');
  const [showBuyerPassword, setShowBuyerPassword] = useState(false);
  const [buyerErrorMsg, setBuyerErrorMsg] = useState('');

  // Campos equipe (admin / voluntário / parceiro)
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [staffErrorMsg, setStaffErrorMsg] = useState('');

  const scrollViewRef = useRef(null);
  const buyerEmailRef = useRef(null);
  const buyerPhoneRef = useRef(null);
  const buyerPasswordRef = useRef(null);
  const staffPasswordRef = useRef(null);

  const resetBuyerFields = () => {
    setBuyerName('');
    setBuyerEmail('');
    setBuyerPhone('');
    setBuyerPassword('');
    setShowBuyerPassword(false);
    setBuyerErrorMsg('');
  };

  const resetStaffFields = () => {
    setStaffEmail('');
    setStaffPassword('');
    setShowPassword(false);
    setStaffErrorMsg('');
  };

  const handleSwitchMode = (nextMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    resetBuyerFields();
    resetStaffFields();
  };

  const handleSwitchBuyerAuthMode = (nextAuthMode) => {
    if (nextAuthMode === buyerAuthMode) return;
    setBuyerAuthMode(nextAuthMode);
    resetBuyerFields();
  };

  const scrollToForm = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 120);
  };

  const handleBuyerSubmit = async () => {
    const cleanName = buyerName.trim().replace(/\s+/g, ' ');
    const cleanEmail = buyerEmail.trim().toLowerCase();
    const phoneDigits = buyerPhone.replace(/\D/g, '');
    const cleanPassword = buyerPassword.trim();
    setBuyerErrorMsg('');

    if (buyerAuthMode === 'REGISTER') {
      if (cleanName.length < 3) {
        const msg = 'Informe seu nome completo (mínimo de 3 caracteres)';
        setBuyerErrorMsg(msg);
        notifyAlert('Nome inválido', msg);
        return;
      }

      if (!EMAIL_REGEX.test(cleanEmail)) {
        const msg = 'Informe um e-mail válido (ex.: nome@email.com)';
        setBuyerErrorMsg(msg);
        notifyAlert('E-mail inválido', msg);
        return;
      }

      if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        const msg = 'Informe um WhatsApp válido com DDD (10 ou 11 dígitos)';
        setBuyerErrorMsg(msg);
        notifyAlert('WhatsApp inválido', msg);
        return;
      }

      if (cleanPassword.length < 6) {
        const msg = 'A senha deve ter pelo menos 6 caracteres';
        setBuyerErrorMsg(msg);
        notifyAlert('Senha muito curta', msg);
        return;
      }

      setLoading(true);
      try {
        const user = await api.registerBuyer({
          name: cleanName,
          email: cleanEmail,
          phone: phoneDigits,
          password: cleanPassword,
        });
        onLoginSuccess(user);
      } catch (err) {
        if (err.isNetworkError) {
          try {
            const localUser = registerBuyer(cleanName, cleanEmail, cleanPassword);
            notifyAlert('Modo offline', 'Cadastro salvo no banco local do aparelho');
            onLoginSuccess({
              ...localUser,
              phone: phoneDigits,
            });
          } catch (dbErr) {
            const msg = 'E-mail já cadastrado no banco local';
            setBuyerErrorMsg(msg);
            notifyAlert('Erro no cadastro', msg);
          }
        } else {
          setBuyerErrorMsg(err.message);
          notifyAlert('Erro no cadastro', err.message);
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    // Login do comprador
    if (!EMAIL_REGEX.test(cleanEmail)) {
      const msg = 'Informe um e-mail válido para entrar';
      setBuyerErrorMsg(msg);
      notifyAlert('E-mail inválido', msg);
      return;
    }

    if (!cleanPassword) {
      const msg = 'Informe sua senha para entrar';
      setBuyerErrorMsg(msg);
      notifyAlert('Campo obrigatório', msg);
      return;
    }

    setLoading(true);
    try {
      const user = await api.login(cleanEmail, cleanPassword);
      onLoginSuccess(user);
    } catch (err) {
      if (err.isNetworkError) {
        const localUser = loginUser(cleanEmail, cleanPassword);
        if (localUser) {
          notifyAlert('Modo offline', 'Conectado via banco local SQLite');
          onLoginSuccess({
            ...localUser,
            phone: localUser.phone || '',
          });
        } else {
          const msg = 'Servidor indisponível e credenciais não encontradas localmente';
          setBuyerErrorMsg(msg);
          notifyAlert('Sem conexão', msg);
        }
      } else {
        setBuyerErrorMsg(err.message);
        notifyAlert('Acesso negado', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStaffLogin = async () => {
    const emailClean = staffEmail.trim().toLowerCase();
    const passClean = staffPassword.trim();
    setStaffErrorMsg('');

    if (!EMAIL_REGEX.test(emailClean)) {
      const msg = 'Informe um e-mail institucional válido';
      setStaffErrorMsg(msg);
      notifyAlert('E-mail inválido', msg);
      return;
    }

    if (!passClean) {
      const msg = 'Informe o código ou senha de acesso';
      setStaffErrorMsg(msg);
      notifyAlert('Campo obrigatório', msg);
      return;
    }

    setLoading(true);
    try {
      const user = await api.login(emailClean, passClean);
      if (user.role === 'BUYER') {
        const msg = 'Esta conta é de comprador. Use a aba "Sou apoiador" ';
        setStaffErrorMsg(msg);
        notifyAlert('Perfil inválido', msg);
        return;
      }
      onLoginSuccess(user);
    } catch (err) {
      if (err.isNetworkError) {
        const localUser = loginUser(emailClean, passClean);
        if (localUser && localUser.role !== 'BUYER') {
          notifyAlert('Modo contingência offline', 'Acesso liberado pelo banco local SQLite');
          onLoginSuccess(localUser);
        } else {
          setStaffErrorMsg('Servidor offline e credenciais não validadas localmente.');
        }
      } else {
        setStaffErrorMsg(err.message);
        notifyAlert(err.status === 429 ? 'Acesso bloqueado' : 'Credenciais inválidas', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.creme} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrapper}>
            {/* 1. Cabeçalho da marca Paelito */}
            <View style={styles.headerCenter}>
              <View style={styles.topBadgesRow}>
                <View style={styles.editionPill}>
                  <View style={styles.redDot} />
                  <Text style={styles.editionPillText}>12ª edição solidária</Text>
                </View>
                <View style={styles.abadeusPill}>
                  <Image source={ABADEUS_LOGO} style={styles.abadeusLogo} resizeMode="contain" />
                </View>
              </View>

              <Image source={LOGO_PAELITO} style={styles.loginLogo} resizeMode="contain" />

              <Text style={styles.heroSubtitle}>
                Mais que uma paella, uma boa causa para aquecer corações!
              </Text>
            </View>

            {/* 2. Seletor de perfil: apoiador vs equipe ABADEUS */}
            <View style={styles.modeSwitchContainer}>
              <TouchableOpacity
                style={[styles.modeTab, mode === 'BUYER' && styles.modeTabActive]}
                onPress={() => handleSwitchMode('BUYER')}
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
                onPress={() => handleSwitchMode('STAFF')}
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
                    <Text style={styles.cardOverline}>
                      {buyerAuthMode === 'LOGIN' ? 'Acesso do apoiador' : 'Novo cadastro solidário'}
                    </Text>
                    <Text style={styles.cardTitle}>
                      {buyerAuthMode === 'LOGIN' ? 'Garanta sua paella' : 'Criar minha conta'}
                    </Text>
                  </View>
                  <View style={styles.pixFastBadge}>
                    <Ionicons name="flash" size={12} color={COLORS.mediterraneo} />
                    <Text style={styles.pixFastText}>Pix + QR Code</Text>
                  </View>
                </View>

                {/* Alternância Entrar / Registrar */}
                <View style={styles.subToggleRow}>
                  <TouchableOpacity
                    style={[
                      styles.subToggleBtn,
                      buyerAuthMode === 'LOGIN' && styles.subToggleBtnActive,
                    ]}
                    onPress={() => handleSwitchBuyerAuthMode('LOGIN')}
                  >
                    <Text
                      style={[
                        styles.subToggleText,
                        buyerAuthMode === 'LOGIN' && styles.subToggleTextActive,
                      ]}
                    >
                      Entrar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.subToggleBtn,
                      buyerAuthMode === 'REGISTER' && styles.subToggleBtnActive,
                    ]}
                    onPress={() => handleSwitchBuyerAuthMode('REGISTER')}
                  >
                    <Text
                      style={[
                        styles.subToggleText,
                        buyerAuthMode === 'REGISTER' && styles.subToggleTextActive,
                      ]}
                    >
                      Registrar
                    </Text>
                  </TouchableOpacity>
                </View>

                {buyerAuthMode === 'REGISTER' && (
                  <>
                    <Text style={styles.inputLabel}>Nome completo</Text>
                    <TextInput
                      style={styles.input}
                      value={buyerName}
                      onChangeText={(text) => {
                        setBuyerName(text.replace(/[^a-zA-ZÀ-ÿ\s'.-]/g, ''));
                        if (buyerErrorMsg) setBuyerErrorMsg('');
                      }}
                      maxLength={80}
                      autoCapitalize="words"
                      placeholder="Digite seu nome completo"
                      placeholderTextColor={COLORS.cinzaTexto}
                      onFocus={scrollToForm}
                      returnKeyType="next"
                      blurOnSubmit={false}
                      onSubmitEditing={() => buyerEmailRef.current?.focus()}
                    />
                  </>
                )}

                <Text style={styles.inputLabel}>E-mail para recibo e QR Code</Text>
                <TextInput
                  ref={buyerEmailRef}
                  style={styles.input}
                  value={buyerEmail}
                  onChangeText={(text) => {
                    setBuyerEmail(text.replace(/\s/g, ''));
                    if (buyerErrorMsg) setBuyerErrorMsg('');
                  }}
                  maxLength={100}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="seu@email.com"
                  placeholderTextColor={COLORS.cinzaTexto}
                  onFocus={scrollToForm}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() =>
                    buyerAuthMode === 'REGISTER'
                      ? buyerPhoneRef.current?.focus()
                      : buyerPasswordRef.current?.focus()
                  }
                />

                {buyerAuthMode === 'REGISTER' && (
                  <>
                    <Text style={styles.inputLabel}>WhatsApp (aviso de pedido pronto)</Text>
                    <TextInput
                      ref={buyerPhoneRef}
                      style={styles.input}
                      value={buyerPhone}
                      onChangeText={(text) => {
                        setBuyerPhone(formatPhone(text));
                        if (buyerErrorMsg) setBuyerErrorMsg('');
                      }}
                      maxLength={15}
                      keyboardType="phone-pad"
                      placeholder="(48) 99999-9999"
                      placeholderTextColor={COLORS.cinzaTexto}
                      onFocus={scrollToForm}
                      returnKeyType="next"
                      blurOnSubmit={false}
                      onSubmitEditing={() => buyerPasswordRef.current?.focus()}
                    />
                  </>
                )}

                <Text style={styles.inputLabel}>Senha</Text>
                <View style={styles.passwordInputWrap}>
                  <TextInput
                    ref={buyerPasswordRef}
                    style={styles.passwordInput}
                    value={buyerPassword}
                    onChangeText={(text) => {
                      setBuyerPassword(text);
                      if (buyerErrorMsg) setBuyerErrorMsg('');
                    }}
                    maxLength={64}
                    secureTextEntry={!showBuyerPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder={
                      buyerAuthMode === 'REGISTER' ? 'Mínimo de 6 caracteres' : 'Digite sua senha'
                    }
                    placeholderTextColor={COLORS.cinzaTexto}
                    onFocus={scrollToForm}
                    returnKeyType="done"
                    onSubmitEditing={handleBuyerSubmit}
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setShowBuyerPassword((prev) => !prev)}
                  >
                    <Feather
                      name={showBuyerPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color={COLORS.cinzaTexto}
                    />
                  </TouchableOpacity>
                </View>

                {!!buyerErrorMsg && (
                  <View style={styles.lockoutWarningBox}>
                    <Feather name="alert-circle" size={14} color={COLORS.tomate} />
                    <Text style={styles.lockoutWarningText}>{buyerErrorMsg}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.primaryBuyerBtn, loading && { opacity: 0.7 }]}
                  onPress={handleBuyerSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.branco} />
                  ) : (
                    <>
                      <Text style={styles.primaryBuyerBtnText}>
                        {buyerAuthMode === 'LOGIN'
                          ? 'Entrar e ver cardápio solidário'
                          : 'Cadastrar e continuar'}
                      </Text>
                      <Feather name="arrow-right" size={18} color={COLORS.branco} />
                    </>
                  )}
                </TouchableOpacity>

                <View style={styles.lgpdRow}>
                  <Feather name="lock" size={11} color={COLORS.cinzaTexto} />
                  <Text style={styles.lgpdText}>
                    LGPD: seus dados são usados apenas para emissão do comprovante e retirada.
                  </Text>
                </View>
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
                  onChangeText={(text) => {
                    setStaffEmail(text.replace(/\s/g, ''));
                    if (staffErrorMsg) setStaffErrorMsg('');
                  }}
                  maxLength={100}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="operador@abadeus.com.br"
                  placeholderTextColor={COLORS.cinzaTexto}
                  onFocus={scrollToForm}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => staffPasswordRef.current?.focus()}
                />

                <Text style={styles.inputLabel}>Código/senha de acesso</Text>
                <View style={styles.passwordInputWrap}>
                  <TextInput
                    ref={staffPasswordRef}
                    style={styles.passwordInput}
                    value={staffPassword}
                    onChangeText={(text) => {
                      setStaffPassword(text);
                      if (staffErrorMsg) setStaffErrorMsg('');
                    }}
                    maxLength={64}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Digite sua senha"
                    placeholderTextColor={COLORS.cinzaTexto}
                    onFocus={scrollToForm}
                    returnKeyType="done"
                    onSubmitEditing={handleStaffLogin}
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

                {!!staffErrorMsg && (
                  <View style={styles.lockoutWarningBox}>
                    <Feather name="alert-circle" size={14} color={COLORS.tomate} />
                    <Text style={styles.lockoutWarningText}>{staffErrorMsg}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.primaryStaffBtn, loading && { opacity: 0.7 }]}
                  onPress={handleStaffLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.branco} />
                  ) : (
                    <>
                      <Feather name="log-in" size={17} color={COLORS.branco} />
                      <Text style={styles.primaryBuyerBtnText}>Acessar painel operacional</Text>
                    </>
                  )}
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.creme },
  container: { flex: 1, backgroundColor: COLORS.creme },
  scrollContent: { flexGrow: 1, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 60 },
  contentWrapper: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDE8B2',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  abadeusLogo: {
    width: 72,
    height: 18,
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
    marginBottom: 8,
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
  subToggleRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.creme,
    borderRadius: 12,
    padding: 3,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  subToggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
  },
  subToggleBtnActive: {
    backgroundColor: COLORS.branco,
    elevation: 1,
  },
  subToggleText: {
    fontSize: 12,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.cinzaTexto,
  },
  subToggleTextActive: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.tomate,
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
  lgpdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  lgpdText: {
    flex: 1,
    fontSize: 10,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.cinzaTexto,
    lineHeight: 14,
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