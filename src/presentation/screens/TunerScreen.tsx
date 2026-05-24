import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useDeviceStability } from '@hooks/useDeviceStability';
import { StabilityState } from '@domain/value-objects/DeviceStability';

export function TunerScreen() {
  const { stability, isAvailable, error, isStable } = useDeviceStability();

  const getBackgroundColor = () => {
    if (!stability) return '#666';
    if (stability.state === StabilityState.STABLE) return '#4ae176';
    if (stability.state === StabilityState.MOVING) return '#4ae176';
    return '#F44336';
  };

  const getStatusText = () => {
    if (!stability) return 'INITIALIZING...';
    if (!isAvailable) return 'GYRO NOT AVAILABLE';
    if (stability.state === StabilityState.STABLE) return 'STABLE';
    if (stability.state === StabilityState.MOVING) return 'STABILIZING';
    return 'UNSTABLE';
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <StatusBar barStyle="light-content" />
      
      <Text style={styles.title}>Stability Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      {stability && (
        <View style={styles.dataContainer}>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Score:</Text>
            <Text style={styles.dataValue}>
              {(stability.stabilityScore * 100).toFixed(0)}%
            </Text>
          </View>
          
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Movement:</Text>
            <Text style={styles.dataValue}>
              {stability.movementMagnitude.toFixed(4)}
            </Text>
          </View>
          
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>State:</Text>
            <Text style={styles.dataValue}>{stability.state}</Text>
          </View>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 40,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  statusLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  dataContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 300,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dataLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.7,
  },
  dataValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    width: '100%',
    maxWidth: 300,
  },
  errorText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 14,
  },
});