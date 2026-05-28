// App.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SoundScreen } from '@presentation/screens/SoundScreen';
import { GyroscopeScreen } from '@presentation/screens/GyroscopeScreen';
import { MicTestScreen } from '@presentation/screens/MicTestScreen';

type Tab = 'Sound' | 'Gyroscope' | 'MicTest';

const TABS: { key: Tab; icon: keyof typeof MaterialIcons.glyphMap; label: string }[] = [
  { key: 'Sound', icon: 'volume-up', label: 'Sound' },
  { key: 'Gyroscope', icon: 'vibration', label: 'Gyroscope' },
  { key: 'MicTest', icon: 'mic', label: 'Mic Test' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Sound');

  const renderScreen = () => {
    switch (activeTab) {
      case 'Sound':
        return <SoundScreen />;
      case 'Gyroscope':
        return <GyroscopeScreen />;
      case 'MicTest':
        return <MicTestScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>

      <View style={styles.tabBarWrapper}>
        <View style={styles.tabBar}>
          {TABS.map(({ key, icon, label }) => {
            const isActive = activeTab === key;
            const color = isActive ? '#4ae176' : '#666';
            const bgColor = isActive ? 'rgba(74, 225, 118, 0.15)' : 'transparent';

            return (
              <TouchableOpacity
                key={key}
                style={[styles.tab, { backgroundColor: bgColor }]}
                onPress={() => setActiveTab(key)}
                activeOpacity={0.7}
              >
                <MaterialIcons name={icon} size={24} color={color} />
                <Text style={[styles.tabLabel, { color }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  content: {
    flex: 1,
  },
  tabBarWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 8,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});