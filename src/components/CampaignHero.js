import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function CampaignHero({ onOrderPress }) {
  return (
    <View>
      {/* Tags da edição */}
      <View style={styles.heroHeaderRow}>
        <View style={styles.editionPill}>
          <View style={styles.redDot} />
          <Text style={styles.editionPillText}>12ª edição solidária</Text>
        </View>
        <View style={styles.abadeusPill}>
          <Text style={styles.abadeusPillText}>ABADEUS</Text>
        </View>
      </View>

      <Text style={styles.heroTitle}>Sabor que transforma</Text>
      <Text style={styles.heroSubtitle}>
        Paella feita para compartilhar. Mais que uma paella, uma boa causa para aquecer corações!
      </Text>

      {/* Card principal com foto */}
      <View style={styles.heroCard}>
        <View style={styles.heroImageWrapper}>
          <Image
            source={require('../../assets/images/paella-solidaria.png')}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroImageTextWrap}>
            <Text style={styles.heroRecipeTag}>Receita tradicional</Text>
            <Text style={styles.heroDishTitle}>Frutos do mar, carnes{'\n'}e opção veggie</Text>
          </View>
          <View style={styles.beneficenteBadge}>
            <Text style={styles.beneficenteBadgeTitle}>100%</Text>
            <Text style={styles.beneficenteBadgeSub}>beneficente</Text>
          </View>
        </View>

        <View style={styles.heroCardFooter}>
          <View>
            <Text style={styles.startingAtLabel}>Porções a partir de</Text>
            <Text style={styles.startingAtPrice}>R$ 40,00</Text>
          </View>
          <TouchableOpacity style={styles.heroCtaButton} onPress={onOrderPress}>
            <Text style={styles.heroCtaText}>Fazer pedido</Text>
            <Feather name="arrow-right" size={16} color={COLORS.branco} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bloco causa com propósito real */}
      <View style={styles.causeCard}>
        <View style={styles.causeTopRow}>
          <View style={styles.causeIconCircle}>
            <Ionicons name="heart" size={20} color="#7A4F08" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.causeTitleRow}>
              <Text style={styles.causeTitle}>Causa com propósito real</Text>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.mediterraneo} />
            </View>
            <Text style={styles.causeDescription}>
              Cada bilhete garante oficinas gratuitas de música, tecnologia e panificação para
              jovens em vulnerabilidade
            </Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={[styles.metricValue, { color: COLORS.tomate }]}>100%</Text>
            <Text style={styles.metricLabel}>Lucro doado</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={[styles.metricValue, { color: COLORS.mediterraneo }]}>+500</Text>
            <Text style={styles.metricLabel}>Famílias</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={[styles.metricValue, { color: COLORS.preto }]}>1.200</Text>
            <Text style={styles.metricLabel}>Refeições</Text>
          </View>
        </View>

        <View style={styles.goalHeaderRow}>
          <Text style={styles.goalLabel}>🔥 Meta de vendas da campanha</Text>
          <Text style={styles.goalPercent}>78% alcançada</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '78%' }]} />
        </View>
        <Text style={styles.goalRemainingText}>Restam 264 porções disponíveis</Text>
      </View>

      {/* Bloco data e retirada */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWithIcon}>
          <Feather name="calendar" size={18} color={COLORS.mediterraneo} />
          <Text style={styles.sectionTitle}>Data e retirada</Text>
        </View>
        <View style={styles.driveThruBadge}>
          <Text style={styles.driveThruBadgeText}>Drive-thru e salão</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={[styles.infoIconBox, { backgroundColor: '#FFF3D1' }]}>
          <Feather name="calendar" size={18} color="#C88A14" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTag}>Quando</Text>
          <Text style={styles.infoMainText}>Sábado, 28 de novembro de 2026</Text>
          <Text style={styles.infoSubText}>🕒 11h30 às 14h30 (sem filas com agendamento)</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={[styles.infoIconBox, { backgroundColor: '#FDE8E6' }]}>
          <Feather name="map-pin" size={18} color={COLORS.tomate} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTag}>Onde</Text>
          <Text style={styles.infoMainText}>ABADEUS • Criciúma/SC</Text>
          <Text style={styles.infoSubText}>
            Rua Maria Salete de Oliveira, 422 • Cristo Redentor (acesso rápido com sinalização)
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 10,
  },
  editionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.branco,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.tomate,
    marginRight: 6,
  },
  editionPillText: { fontSize: 10, fontWeight: '700', color: COLORS.preto },
  abadeusPill: {
    backgroundColor: '#FDE8B2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  abadeusPillText: { fontSize: 10, fontWeight: '800', color: '#8B5E08' },
  heroTitle: { fontSize: 28, fontWeight: '900', color: COLORS.tomate, marginBottom: 6 },
  heroSubtitle: { fontSize: 13, color: COLORS.cinzaTexto, lineHeight: 19, marginBottom: 14 },
  heroCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    elevation: 3,
  },
  heroImageWrapper: { height: 185, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.48)' },
  heroImageTextWrap: { position: 'absolute', bottom: 12, left: 12, right: 110 },
  heroRecipeTag: { fontSize: 10, fontWeight: '800', color: COLORS.acafrao, letterSpacing: 0.4 },
  heroDishTitle: { fontSize: 16, fontWeight: '800', color: COLORS.branco, lineHeight: 20, marginTop: 2 },
  beneficenteBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: COLORS.tomate,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  beneficenteBadgeTitle: { color: COLORS.branco, fontWeight: '900', fontSize: 13 },
  beneficenteBadgeSub: { color: COLORS.branco, fontSize: 10, fontWeight: '600' },
  heroCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  startingAtLabel: { fontSize: 11, color: COLORS.cinzaTexto },
  startingAtPrice: { fontSize: 20, fontWeight: '900', color: COLORS.tomate },
  heroCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tomate,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 24,
    gap: 6,
  },
  heroCtaText: { color: COLORS.branco, fontWeight: '700', fontSize: 13 },
  causeCard: {
    backgroundColor: '#FDF1D6',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3DFB3',
  },
  causeTopRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  causeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.acafrao,
    alignItems: 'center',
    justifyContent: 'center',
  },
  causeTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  causeTitle: { fontSize: 15, fontWeight: '800', color: COLORS.preto },
  causeDescription: { fontSize: 12, color: COLORS.cinzaTexto, lineHeight: 17 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  metricBox: {
    width: '31%',
    backgroundColor: COLORS.branco,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  metricValue: { fontSize: 16, fontWeight: '900' },
  metricLabel: { fontSize: 10, color: COLORS.cinzaTexto, marginTop: 2 },
  goalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  goalLabel: { fontSize: 11, fontWeight: '700', color: COLORS.preto },
  goalPercent: { fontSize: 11, fontWeight: '800', color: COLORS.tomate },
  progressBarBg: {
    height: 8,
    backgroundColor: '#EBD9B4',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: COLORS.tomate },
  goalRemainingText: {
    fontSize: 10,
    color: COLORS.cinzaTexto,
    textAlign: 'right',
    marginTop: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleWithIcon: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.preto },
  driveThruBadge: {
    backgroundColor: COLORS.mediterraneo,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  driveThruBadgeText: { color: COLORS.branco, fontSize: 10, fontWeight: '700' },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.branco,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    alignItems: 'center',
  },
  infoIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTag: { fontSize: 10, fontWeight: '800', color: COLORS.cinzaTexto },
  infoMainText: { fontSize: 14, fontWeight: '800', color: COLORS.preto, marginVertical: 2 },
  infoSubText: { fontSize: 11, color: COLORS.cinzaTexto, lineHeight: 16 },
});