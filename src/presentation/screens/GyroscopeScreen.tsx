import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDeviceStability } from '@hooks/useDeviceStability';

export function GyroscopeScreen() {
  const { stability, isAvailable, error } = useDeviceStability();

  const status = !stability
    ? 'INIT...'
    : !isAvailable
      ? 'NOT AVAILABLE'
      : stability.state === 'UNSTABLE'
        ? 'UNSTABLE'
        : 'STABLE';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gyroscope Test</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text
            style={[
              styles.value,
              status === 'UNSTABLE' && styles.valueError,
              status === 'STABLE' && styles.valueAccent,
            ]}
          >
            {status}
          </Text>
        </View>
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
    backgroundColor: '#050505',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 120,
  },
  title: {
    color: '#4ae176',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(11, 11, 15, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    width: '100%',
    maxWidth: 320,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    color: 'rgba(229, 226, 225, 0.6)',
    fontSize: 13,
  },
  value: {
    color: '#e5e2e1',
    fontSize: 13,
    fontWeight: '600',
  },
  valueAccent: {
    color: '#4ae176',
  },
  valueError: {
    color: '#F44336',
  },
  errorCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.4)',
    width: '100%',
    maxWidth: 320,
  },
  errorText: {
    color: '#F44336',
    textAlign: 'center',
    fontSize: 13,
  },
});