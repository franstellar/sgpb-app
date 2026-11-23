import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const ADMIN_TABS = [
  { key: 'DASHBOARD', label: 'Início', icon: 'grid-outline' },
  { key: 'CHECKIN', label: 'Check-in', icon: 'qr-code-outline' },
  { key: 'ORDERS', label: 'Pedidos', icon: 'receipt-outline' },
  { key: 'STOCK', label: 'Estoque', icon: 'cube-outline' },
];

export default function AdminBottomTabBar({ activeTab, onChangeTab }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bottomBar,
        { paddingBottom: Math.max(insets.bottom, 10) },
      ]}
    >
      {ADMIN_TABS.map((tab) => {
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
            <Text
              style={[
                styles.tabLabel,
                isFocused && { color: COLORS.tomate, fontWeight: '800' },
              ]}
            >
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
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    color: COLORS.cinzaTexto,
    marginTop: 3,
    fontWeight: '600',
  },
});