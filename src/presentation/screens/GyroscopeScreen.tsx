import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDeviceStability } from '@hooks/useDeviceStability';

export function GyroscopeScreen() {
  const { stability, isAvailable, error } = useDeviceStability();

  const bg = !stability ? '#666' : stability.state === 'UNSTABLE' ? '#F44336' : '#4ae176';
  const status = !stability ? 'INIT...' : !isAvailable ? 'NOT AVAILABLE' : stability.state === 'UNSTABLE' ? 'UNSTABLE' : 'STABLE';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={styles.title}>Gyroscope Test</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{status}</Text>
      </View>

      {stability && (
        <View style={styles.card}>
          <Row label="Score" value={`${(stability.stabilityScore * 100).toFixed(0)}%`} />
          <Row label="Movement" value={stability.movementMagnitude.toFixed(4)} />
          <Row label="State" value={stability.state} />
        </View>
      )}

      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 300,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  value: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  errorCard: {
    backgroundColor: 'rgba(244,67,54,0.3)',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
});