import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';

const STEPS = [
  {
    num: '1',
    color: COLORS.tomate,
    title: 'Escolha suas porções',
    desc: 'Selecione as porções para você ou para a família direto no app',
  },
  {
    num: '2',
    color: COLORS.acafrao,
    title: 'Pague com Pix em segundos',
    desc: 'Confirmação instantânea sem taxas bancárias adicionais',
  },
  {
    num: '3',
    color: COLORS.mediterraneo,
    title: 'Receba seu QR Code',
    desc: 'Seu cupom digital de retirada fica salvo automaticamente na aba "Pedidos"',
  },
  {
    num: '4',
    color: COLORS.tomate,
    title: 'Retire quentinha no drive-thru ou salão',
    desc: 'No dia do evento, basta apresentar o código e retirar sua embalagem',
  },
];

export default function HowItWorksSteps() {
  return (
    <View style={styles.stepsSection}>
      <Text style={styles.stepsOverline}>Praticidade total</Text>
      <Text style={styles.stepsMainTitle}>Como funciona em 4 passos</Text>
      <Text style={styles.stepsSubtitle}>
        Tudo pensado para você retirar sem fila e sem complicação
      </Text>

      {STEPS.map((step) => (
        <View key={step.num} style={styles.stepCard}>
          <View style={[styles.stepNumberCircle, { backgroundColor: step.color }]}>
            <Text
              style={[
                styles.stepNumberText,
                { color: step.num === '2' ? COLORS.preto : COLORS.branco },
              ]}
            >
              {step.num}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDesc}>{step.desc}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stepsSection: {
    backgroundColor: '#F7EBD3',
    borderRadius: 18,
    padding: 16,
    marginTop: 8,
  },
  stepsOverline: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: '#B87D14',
    textAlign: 'center',
  },
  stepsMainTitle: {
    fontSize: 20,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.preto,
    textAlign: 'center',
    lineHeight: 26,
    marginTop: 2,
  },
  stepsSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.cinzaTexto,
    textAlign: 'center',
    marginBottom: 14,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.branco,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    gap: 12,
  },
  stepNumberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: { fontSize: 14, fontFamily: FONTS.headingExtraBold },
  stepTitle: { fontSize: 13, fontFamily: FONTS.bodyBold, color: COLORS.preto },
  stepDesc: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.cinzaTexto,
    marginTop: 2,
    lineHeight: 15,
  },
});