import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const FAQ_ITEMS = [
  {
    q: 'Posso comprar na hora do evento?',
    a: 'As vendas são prioritariamente antecipadas pelo aplicativo para garantir o dimensionamento dos ingredientes frescos. Caso restem porções do lote, haverá venda limitada no local.',
  },
  {
    q: 'Como recebo meu QR Code de retirada?',
    a: 'Assim que o pagamento via Pix é confirmado, seu voucher digital com QR Code fica disponível imediatamente na aba "Pedidos" do app e também é enviado para seu e-mail e WhatsApp.',
  },
  {
    q: 'A paella vem quente e pronta para servir?',
    a: 'Sim! Todas as porções saem direto dos tachos gigantes em embalagens térmicas exclusivas que conservam a temperatura e o sabor por até 2 horas.',
  },
  {
    q: 'Outra pessoa pode retirar no meu lugar?',
    a: 'Pode sim! Basta encaminhar o print ou PDF do seu voucher digital (pelo botão "Enviar no Whats" na aba "Pedidos") para a pessoa apresentar na fila.',
  },
  {
    q: 'Haverá bebidas e sobremesas no local?',
    a: 'Sim! No salão solidário e no drive-thru teremos bebidas geladas e os minichurros artesanais com doce de leite da ABADEUS.',
  },
];

export default function EventFaqAccordion({ onOrderNow }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <View>
      {/* 1. Dúvidas frequentes */}
      <Text style={styles.overline}>Dúvidas frequentes</Text>
      <Text style={styles.sectionTitle}>Perguntas da comunidade</Text>

      <View style={styles.faqList}>
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.faqCard, isOpen && styles.faqCardOpen]}
              onPress={() => toggleItem(idx)}
              activeOpacity={0.85}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{item.q}</Text>
                <Feather
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={isOpen ? COLORS.tomate : COLORS.cinzaTexto}
                />
              </View>
              {isOpen && <Text style={styles.faqAnswer}>{item.a}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 2. CTA card: corrente de amor */}
      <View style={styles.ctaBanner}>
        <Text style={styles.ctaTitle}>
          Garanta sua porção e faça parte desta corrente solidária!
        </Text>
        <Text style={styles.ctaSubtitle}>
          As porções do 1º lote já estão em contagem regressiva. Garanta seu almoço solidário
        </Text>

        <TouchableOpacity style={styles.ctaButton} onPress={onOrderNow}>
          <Text style={styles.ctaButtonText}>Fazer meu pedido agora</Text>
          <Feather name="arrow-right" size={16} color={COLORS.preto} />
        </TouchableOpacity>

        <Text style={styles.ctaFootNote}>Entrega rápida com opção drive-thru ou salão</Text>
      </View>

      {/* 3. Prestação de contas e transparência */}
      <View style={styles.transparencyCard}>
        <View style={styles.transparencyHeader}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.mediterraneo} />
          <Text style={styles.transparencyTitle}>Prestação de contas e transparência</Text>
        </View>

        <Text style={styles.transparencyDesc}>
          A Associação Beneficente ABADEUS é auditada independentemente e possui certificados
          municipais e federais de utilidade pública. Todas as receitas e balanços são publicados no
          portal oficial.
        </Text>

        <View style={styles.contactList}>
          <View style={styles.contactRow}>
            <Feather name="phone" size={14} color={COLORS.tomate} />
            <Text style={styles.contactText}>(48) 3462-3592 / 3462-3593</Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="logo-whatsapp" size={15} color="#25D366" />
            <Text style={styles.contactText}>WhatsApp do evento: (48) 99123-4567</Text>
          </View>
          <View style={styles.contactRow}>
            <Feather name="mail" size={14} color={COLORS.mediterraneo} />
            <Text style={styles.contactText}>contato@abadeus.com.br</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.whatsTeamBtn}
          onPress={() =>
            Alert.alert('WhatsApp ABADEUS', 'Iniciando conversa com a equipe do evento')
          }
        >
          <Ionicons name="logo-whatsapp" size={18} color={COLORS.branco} />
          <Text style={styles.whatsTeamBtnText}>Falar com a equipe pelo WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overline: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.tomate,
    letterSpacing: 0.6,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.preto,
    marginBottom: 12,
    marginTop: 2,
  },
  faqList: {
    marginBottom: 18,
  },
  faqCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  faqCardOpen: {
    borderColor: COLORS.tomate,
    backgroundColor: '#FFFDF9',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.preto,
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 12,
    color: COLORS.cinzaTexto,
    lineHeight: 18,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F2E4C9',
  },
  ctaBanner: {
    backgroundColor: COLORS.tomate,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 18,
    elevation: 3,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.branco,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 12,
    color: '#FFE4E1',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.acafrao,
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 24,
    gap: 8,
    width: '100%',
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.preto,
  },
  ctaFootNote: {
    fontSize: 10,
    color: '#FFE4E1',
    marginTop: 10,
    fontWeight: '600',
  },
  transparencyCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  transparencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  transparencyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.preto,
  },
  transparencyDesc: {
    fontSize: 12,
    color: COLORS.cinzaTexto,
    lineHeight: 18,
    marginBottom: 14,
  },
  contactList: {
    backgroundColor: COLORS.creme,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 14,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.preto,
  },
  whatsTeamBtn: {
    flexDirection: 'row',
    backgroundColor: '#25D366',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  whatsTeamBtnText: {
    color: COLORS.branco,
    fontSize: 13,
    fontWeight: '800',
  },
});