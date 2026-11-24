import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';

const MASCOTE_IMG = require('../../assets/images/mascote-paelito.png');

export default function SplashScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.45)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(18)).current;
  const mascotFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const entrance = Animated.parallel([
      // 1. Entrada elástica do círculo + mascote
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 65,
        useNativeDriver: true,
      }),
      // 2. Textos e selos entram logo em seguida subindo suave
      Animated.sequence([
        Animated.delay(180),
        Animated.parallel([
          Animated.timing(contentOpacity, {
            toValue: 1,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(contentTranslateY, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]);

    // 3. Flutuação leve e contínua no mascote depois de entrar
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(mascotFloat, {
          toValue: -5,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(mascotFloat, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    entrance.start(() => {
      floatLoop.start();
    });

    return () => {
      entrance.stop();
      floatLoop.stop();
    };
  }, [logoOpacity, logoScale, contentOpacity, contentTranslateY, mascotFloat]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.tomate} />

      <View style={styles.centerContent}>
        {/* Pílula da edição */}
        <Animated.View
          style={[
            styles.editionPill,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}
        >
          <View style={styles.yellowDot} />
          <Text style={styles.editionText}>12ª edição solidária • 2026</Text>
        </Animated.View>

        {/* Círculo do mascote com pop-in elástico */}
        <Animated.View
          style={[
            styles.logoOuterRing,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoInnerCircle}>
            <Animated.Image
              source={MASCOTE_IMG}
              style={[
                styles.mascotImg,
                { transform: [{ translateY: mascotFloat }] },
              ]}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Marca Paelito + Selo ABADEUS */}
        <Animated.View
          style={[
            styles.textBlock,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}
        >
          <Text style={styles.brandTitle}>Paelito</Text>
          <Text style={styles.brandTagline}>
            Paella feita para compartilhar{'\n'}Sabor que transforma vidas!
          </Text>

          <View style={styles.abadeusBadge}>
            <Ionicons name="heart" size={14} color={COLORS.tomate} />
            <Text style={styles.abadeusBadgeText}>
              100% beneficente • ABADEUS Criciúma/SC
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Rodapé de carregamento */}
      <Animated.View style={[styles.footer, { opacity: contentOpacity }]}>
        <ActivityIndicator size="small" color={COLORS.acafrao} />
        <Text style={styles.loadingText}>Aquecendo os tachos solidários...</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.tomate,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
    gap: 6,
  },
  yellowDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.acafrao,
  },
  editionText: {
    color: COLORS.creme,
    fontSize: 11,
    fontFamily: FONTS.bodySemiBold,
    letterSpacing: 0.4,
  },
  logoOuterRing: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: 'rgba(244, 184, 42, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderWidth: 2,
    borderColor: COLORS.acafrao,
  },
  logoInnerCircle: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: COLORS.creme,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  mascotImg: {
    width: 82,
    height: 82,
  },
  textBlock: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 46,
    fontFamily: FONTS.headingExtraBold,
    color: COLORS.branco,
    lineHeight: 54,
  },
  brandTagline: {
    fontSize: 14,
    fontFamily: FONTS.bodyMedium,
    color: '#FFE4E1',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 4,
    marginBottom: 20,
  },
  abadeusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.creme,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    gap: 6,
  },
  abadeusBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: COLORS.preto,
  },
  footer: {
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: COLORS.creme,
    fontSize: 12,
    fontFamily: FONTS.bodySemiBold,
  },
});