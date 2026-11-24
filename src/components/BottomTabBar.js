import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';

const TABS = [
  { key: 'HOME', label: 'Início', icon: 'home-outline' },
  { key: 'MENU', label: 'Cardápio', icon: 'restaurant-outline' },
  { key: 'ORDERS', label: 'Pedidos', icon: 'receipt-outline' },
  { key: 'EVENT', label: 'Evento', icon: 'heart-outline' },
];

export default function BottomTabBar({ activeTab, onChangeTab }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bottomBar,
        { paddingBottom: Math.max(insets.bottom, 10) },
      ]}
    >
      {TABS.map((tab) => {
        const isFocused = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onChangeTab(tab.key)}
          >
            <Ionicons
              name={tab.icon}
              size={22}
              color={isFocused ? COLORS.tomate : COLORS.cinzaTexto}
            />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
    backgroundColor: COLORS.branco,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EADBC0',
    elevation: 10,
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  tabLabel: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    marginTop: 3,
    fontFamily: FONTS.bodyMedium,
  },
  tabLabelActive: {
    color: COLORS.tomate,
    fontFamily: FONTS.bodyBold,
  },
});