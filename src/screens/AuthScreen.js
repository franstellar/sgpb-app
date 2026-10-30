import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { loginUser, registerBuyer } from '../db';

export default function AuthScreen({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [registerName, setRegisterName] = useState('');

  const handleLogin = () => {
    if (!loginInput || !passwordInput) {
      Alert.alert('Atenção', 'Preencha usuário/e-mail e senha.');
      return;
    }
    const user = loginUser(loginInput, passwordInput);
    if (!user) {
      Alert.alert('Erro de Acesso', 'Credenciais inválidas. Para Admin use ADMINISTRADOR e senha ADM123.');
      return;
    }
    onLoginSuccess(user);
  };

  const handleRegister = () => {
    if (!registerName || !loginInput || !passwordInput) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    try {
      const newUser = registerBuyer(registerName, loginInput, passwordInput);
      onLoginSuccess(newUser);
    } catch (err) {
      Alert.alert('Erro', 'Este e-mail já está cadastrado no banco local.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.authContent}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🥘</Text>
          <Text style={styles.logoTitle}>PAELITO</Text>
          <Text style={styles.logoSubtitle}>Mais que uma paella, uma boa causa.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {isRegister ? 'Criar Conta de Apoiador' : 'Acesso ao Aplicativo'}
          </Text>

          {isRegister && (
            <TextInput
              style={styles.input}
              placeholder="Seu Nome Completo *"
              value={registerName}
              onChangeText={setRegisterName}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder={isRegister ? 'Seu E-mail *' : 'Usuário ou E-mail (Ex: ADMINISTRADOR)'}
            autoCapitalize="none"
            value={loginInput}
            onChangeText={setLoginInput}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha (Ex: ADM123)"
            secureTextEntry
            value={passwordInput}
            onChangeText={setPasswordInput}
          />

          {!isRegister ? (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
                <Text style={styles.primaryButtonText}>ENTRAR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setIsRegister(true)}
              >
                <Text style={styles.secondaryButtonText}>REGISTRAR</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
                <Text style={styles.primaryButtonText}>FINALIZAR CADASTRO</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setIsRegister(false)}
              >
                <Text style={styles.secondaryButtonText}>VOLTAR PARA LOGIN</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.quickFillBox}>
            <Text style={styles.quickFillLabel}>Preenchimento rápido (Modo Apresentação):</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.chipButton}
                onPress={() => {
                  setIsRegister(false);
                  setLoginInput('ADMINISTRADOR');
                  setPasswordInput('ADM123');
                }}
              >
                <Text style={styles.chipText}>Perfil Admin (ADM123)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chipButton}
                onPress={() => {
                  setIsRegister(false);
                  setLoginInput('comprador@email.com');
                  setPasswordInput('123456');
                }}
              >
                <Text style={styles.chipText}>Perfil Comprador</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  authContent: { padding: 20, justifyContent: 'center', flexGrow: 1 },
  logoBox: { alignItems: 'center', marginBottom: 24 },
  logoEmoji: { fontSize: 54 },
  logoTitle: { fontSize: 34, fontWeight: '900', color: COLORS.red },
  logoSubtitle: { fontSize: 14, color: COLORS.black, marginTop: 4 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.black, marginBottom: 14 },
  input: {
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: '#E0D4B8',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: COLORS.black,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.red,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: { color: COLORS.white, fontWeight: '800', fontSize: 15 },
  secondaryButton: {
    borderWidth: 2,
    borderColor: COLORS.red,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: { color: COLORS.red, fontWeight: '800', fontSize: 14 },
  quickFillBox: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 12 },
  quickFillLabel: { fontSize: 12, color: '#666', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chipButton: {
    backgroundColor: COLORS.yellow,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  chipText: { fontSize: 12, fontWeight: '700', color: COLORS.black },
});