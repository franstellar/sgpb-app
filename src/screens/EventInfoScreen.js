import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import EventFaqAccordion from '../components/EventFaqAccordion';

export default function EventInfoScreen({ onOrderNow }) {
  const handleOpenGps = () => {
    const addressQuery = encodeURIComponent(
      'ABADEUS Rua Maria Salete de Oliveira, 422, Cristo Redentor, Criciúma, SC'
    );
    const url = `https://www.google.com/maps/search/?api=1&query=${addressQuery}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Mapa', 'Endereço: Rua Maria Salete de Oliveira, 422 - Cristo Redentor, Criciúma/SC')
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. HERO INSTITUCIONAL */}
      <View style={styles.editionPill}>
        <View style={styles.redDot} />
        <Text style={styles.editionPillText}>12ª EDIÇÃO SOLIDÁRIA</Text>
      </View>

      <Text style={styles.heroTitle}>Mais que gastronomia, um compromisso com o futuro.</Text>
      <Text style={styles.heroSub}>
        A união acolhedora entre a culinária mediterrânea e a transformação social de centenas de
        famílias em Criciúma/SC.
      </Text>

      {/* 2. TRADIÇÃO & MESTRES PAELLEIROS */}
      <View style={styles.traditionCard}>
        <View style={styles.traditionImageWrap}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=1000' }}
            style={styles.traditionImage}
          />
          <View style={styles.traditionOverlay} />
          <View style={styles.traditionBadge}>
            <Text style={styles.traditionBadgeText}>PAELITO • SABOR & ALMA</Text>
          </View>
          <Text style={styles.traditionPhotoTitle}>Tradição & Mestres Paelleiros</Text>
        </View>

        <View style={styles.traditionBody}>
          <Text style={styles.overline}>PAELITO</Text>
          <Text style={styles.cardMainTitle}>O Segredo do Nosso Tacho</Text>
          <Text style={styles.cardParagraph}>
            Nascida do encontro generoso entre renomados chefs voluntários e a comunidade de
            Criciúma, a Paella do Paelito combina frutos do mar frescos e cortes seletos em arroz ao
            açafrão espanhol, cozida lentamente em tachos gigantes com afeto incondicional.
          </Text>

          <View style={styles.profitHighlight}>
            <Ionicons name="heart" size={16} color={COLORS.tomate} />
            <Text style={styles.profitHighlightText}>
              100% do lucro revertido para os projetos sociais
            </Text>
          </View>
        </View>
      </View>

      {/* 3. IMPACTO SOCIAL COMPROVADO - ABADEUS */}
      <Text style={styles.overline}>IMPACTO SOCIAL COMPROVADO</Text>
      <Text style={styles.sectionTitle}>Associação Beneficente ABADEUS</Text>
      <Text style={styles.sectionDesc}>
        Há mais de 45 anos no Bairro Cristo Redentor, a ABADEUS atua como farol de dignidade
        humana, promovendo cidadania, inovação pedagógica e acolhimento para crianças, adolescentes
        e suas famílias em vulnerabilidade.
      </Text>

      <View style={styles.impactGrid}>
        <View style={styles.impactBox}>
          <View style={[styles.impactIconWrap, { backgroundColor: '#E6F2F8' }]}>
            <MaterialCommunityIcons name="robot-outline" size={20} color={COLORS.mediterraneo} />
          </View>
          <Text style={styles.impactTitle}>Robótica</Text>
          <Text style={styles.impactSub}>
            Inclusão digital e IA para centenas de jovens da periferia.
          </Text>
        </View>

        <View style={styles.impactBox}>
          <View style={[styles.impactIconWrap, { backgroundColor: '#FFF3D1' }]}>
            <Ionicons name="musical-notes-outline" size={20} color="#C88A14" />
          </View>
          <Text style={styles.impactTitle}>Música</Text>
          <Text style={styles.impactSub}>
            Orquestra juvenil, violino e oficinas de expressão artística.
          </Text>
        </View>

        <View style={styles.impactBox}>
          <Text style={[styles.impactBigNumber, { color: COLORS.tomate }]}>+2.400</Text>
          <Text style={styles.impactSub}>
            Jovens capacitados e inseridos no mercado de trabalho.
          </Text>
        </View>

        <View style={styles.impactBox}>
          <Text style={[styles.impactBigNumber, { color: COLORS.mediterraneo }]}>500+</Text>
          <Text style={styles.impactSub}>
            Famílias assistidas mensalmente com cestas e apoio biopsicossocial.
          </Text>
        </View>
      </View>

      {/* Depoimento Lucas Silveira */}
      <View style={styles.testimonialCard}>
        <Ionicons name="chatbox-ellipses" size={22} color={COLORS.acafrao} />
        <Text style={styles.testimonialQuote}>
          "Entrei na oficina de programação da ABADEUS aos 14 anos. Hoje sou técnico contratado e
          ajudo a sustentar meus pais. Cada prato vendido nesta paella abre a porta para outro jovem
          como eu."
        </Text>
        <View style={styles.testimonialAuthorRow}>
          <View style={styles.authorAvatar}>
            <Text style={styles.authorAvatarText}>LS</Text>
          </View>
          <View>
            <Text style={styles.authorName}>Lucas Silveira, 18 anos</Text>
            <Text style={styles.authorRole}>Ex-aluno do Centro de Inovação ABADEUS</Text>
          </View>
        </View>
      </View>

      {/* 4. PROGRAME-SE: DIA DO EVENTO & RETIRADA */}
      <Text style={styles.overline}>PROGRAME-SE</Text>
      <Text style={styles.sectionTitle}>Dia do Evento & Retirada</Text>

      <View style={styles.scheduleCard}>
        <View style={styles.scheduleItem}>
          <View style={[styles.scheduleIcon, { backgroundColor: '#FFF3D1' }]}>
            <Feather name="calendar" size={18} color="#C88A14" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.scheduleLabel}>DATA & HORÁRIO</Text>
            <Text style={styles.scheduleMain}>Sábado, 28 de Novembro de 2026</Text>
            <Text style={styles.scheduleSub}>Das 11h30 às 14h30 (pontual)</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.scheduleItem}>
          <View style={[styles.scheduleIcon, { backgroundColor: '#FDE8E6' }]}>
            <Feather name="map-pin" size={18} color={COLORS.tomate} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.scheduleLabel}>LOCAL DE RETIRADA</Text>
            <Text style={styles.scheduleMain}>Centro Comunitário ABADEUS</Text>
            <Text style={styles.scheduleSub}>
              Rua Maria Salete de Oliveira, 422 - Cristo Redentor, Criciúma/SC
            </Text>
          </View>
        </View>

        {/* Mapa Visual Criciúma + Botão GPS */}
        <View style={styles.mapPreviewBox}>
          <View style={styles.mapBadgeRow}>
            <Text style={styles.mapNeighborhoodTag}>CRISTO REDENTOR • CRICIÚMA/SC</Text>
          </View>
          <View style={styles.mapPinCenter}>
            <Ionicons name="location" size={32} color={COLORS.tomate} />
            <Text style={styles.mapPinLabel}>Sede ABADEUS</Text>
          </View>
          <TouchableOpacity style={styles.gpsBtn} onPress={handleOpenGps}>
            <Feather name="navigation" size={14} color={COLORS.branco} />
            <Text style={styles.gpsBtnText}>Abrir no GPS</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 5. MODALIDADES DE RETIRADA (DRIVE-THRU vs SALÃO) */}
      <Text style={styles.pickupChoiceTitle}>Escolha como retirar sua porção:</Text>

      <View style={styles.optionCard}>
        <View style={styles.optionHeader}>
          <View style={[styles.optionIconBox, { backgroundColor: '#E6F2F8' }]}>
            <Ionicons name="car-sport-outline" size={20} color={COLORS.mediterraneo} />
          </View>
          <Text style={styles.optionTitle}>Opção 1: Drive-Thru Expresso</Text>
        </View>
        <Text style={styles.optionDesc}>
          Praticidade total. Sem precisar descer do automóvel, passe pela via sinalizada na frente
          da ABADEUS. Nossos voluntários escaneiam seu QR Code e entregam seu pacote lacrado.
        </Text>
        <View style={styles.optionHighlightPill}>
          <Feather name="zap" size={13} color={COLORS.mediterraneo} />
          <Text style={styles.optionHighlightText}>
            Tempo médio estimado: menos de 2 minutos
          </Text>
        </View>
      </View>

      <View style={styles.optionCard}>
        <View style={styles.optionHeader}>
          <View style={[styles.optionIconBox, { backgroundColor: '#FFF3D1' }]}>
            <Ionicons name="people-outline" size={20} color="#C88A14" />
          </View>
          <Text style={styles.optionTitle}>Opção 2: Salão Solidário</Text>
        </View>
        <Text style={styles.optionDesc}>
          Para quem deseja descer, abraçar nossa equipe voluntária, conferir os tachos fumegantes em
          ação e registrar fotos no painel instagramável do Paelito.
        </Text>
        <View style={[styles.optionHighlightPill, { backgroundColor: '#FFF8E6' }]}>
          <Ionicons name="musical-note" size={13} color="#C88A14" />
          <Text style={[styles.optionHighlightText, { color: '#8B5E08' }]}>
            Ambiente festivo, música ao vivo e recepção calorosa
          </Text>
        </View>
      </View>

      {/* Dica de Mestre */}
      <View style={styles.chefTipBox}>
        <Ionicons name="flame" size={20} color={COLORS.tomate} />
        <Text style={styles.chefTipText}>
          <Text style={{ fontWeight: '800', color: COLORS.preto }}>Dica de mestre: </Text>A paella é
          entregue em embalagem térmica exclusiva do Paelito, mantendo-se fumegante e saborosa por
          até 2 horas após o recolhimento!
        </Text>
      </View>

      {/* 6. FAQ + CTA + TRANSPARÊNCIA */}
      <EventFaqAccordion onOrderNow={onOrderNow} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.creme },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 105 },
  editionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.branco,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginTop: 14,
    marginBottom: 8,
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.tomate,
    marginRight: 6,
  },
  editionPillText: { fontSize: 10, fontWeight: '800', color: COLORS.preto },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.tomate,
    lineHeight: 30,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    color: COLORS.cinzaTexto,
    lineHeight: 19,
    marginBottom: 16,
  },
  traditionCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#EADBC0',
    elevation: 2,
  },
  traditionImageWrap: {
    height: 165,
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 14,
  },
  traditionImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  traditionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  traditionBadge: {
    backgroundColor: COLORS.acafrao,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 4,
  },
  traditionBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.preto,
  },
  traditionPhotoTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.branco,
  },
  traditionBody: {
    padding: 16,
  },
  overline: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.tomate,
    letterSpacing: 0.6,
  },
  cardMainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.preto,
    marginTop: 2,
    marginBottom: 6,
  },
  cardParagraph: {
    fontSize: 12,
    color: COLORS.cinzaTexto,
    lineHeight: 18,
    marginBottom: 12,
  },
  profitHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE8E6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
  },
  profitHighlightText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.tomate,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.preto,
    marginTop: 2,
    marginBottom: 6,
  },
  sectionDesc: {
    fontSize: 12,
    color: COLORS.cinzaTexto,
    lineHeight: 18,
    marginBottom: 14,
  },
  impactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  impactBox: {
    width: '48.2%',
    backgroundColor: COLORS.branco,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  impactIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  impactTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.preto,
    marginBottom: 4,
  },
  impactBigNumber: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  impactSub: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    lineHeight: 15,
  },
  testimonialCard: {
    backgroundColor: '#FDF1D6',
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#F3DFB3',
  },
  testimonialQuote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.preto,
    lineHeight: 18,
    marginVertical: 8,
  },
  testimonialAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  authorAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.mediterraneo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvatarText: {
    color: COLORS.branco,
    fontSize: 12,
    fontWeight: '800',
  },
  authorName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.preto,
  },
  authorRole: {
    fontSize: 10,
    color: COLORS.cinzaTexto,
  },
  scheduleCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scheduleIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.cinzaTexto,
  },
  scheduleMain: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.preto,
    marginVertical: 2,
  },
  scheduleSub: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
  },
  divider: {
    height: 1,
    backgroundColor: '#F2E4C9',
    marginVertical: 12,
  },
  mapPreviewBox: {
    marginTop: 14,
    backgroundColor: '#EBF3F5',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0E2E8',
  },
  mapBadgeRow: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.branco,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  mapNeighborhoodTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.mediterraneo,
  },
  mapPinCenter: {
    alignItems: 'center',
    marginVertical: 6,
  },
  mapPinLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.preto,
    marginTop: 2,
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.mediterraneo,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    gap: 6,
    marginTop: 8,
  },
  gpsBtnText: {
    color: COLORS.branco,
    fontSize: 12,
    fontWeight: '800',
  },
  pickupChoiceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.preto,
    marginBottom: 10,
  },
  optionCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EADBC0',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  optionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.preto,
  },
  optionDesc: {
    fontSize: 12,
    color: COLORS.cinzaTexto,
    lineHeight: 17,
    marginBottom: 10,
  },
  optionHighlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  optionHighlightText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.mediterraneo,
  },
  chefTipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3D1',
    borderRadius: 14,
    padding: 12,
    gap: 10,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.acafrao,
  },
  chefTipText: {
    flex: 1,
    fontSize: 11,
    color: '#7A4F08',
    lineHeight: 16,
  },
});