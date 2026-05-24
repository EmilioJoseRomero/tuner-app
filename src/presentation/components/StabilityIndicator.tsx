// src/presentation/components/StabilityIndicator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DeviceStability, StabilityState } from '@domain/value-objects/DeviceStability';

interface Props {
  stability: DeviceStability | null;
}

export function StabilityIndicator({ stability }: Props) {
  if (!stability) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Iniciando sensor...</Text>
      </View>
    );
  }

  const getColor = () => {
    switch (stability.state) {
      case StabilityState.STABLE:
        return '#4CAF50';
      case StabilityState.MOVING:
        return '#FFC107';
      case StabilityState.UNSTABLE:
        return '#F44336';
    }
  };

  const getLabel = () => {
    switch (stability.state) {
      case StabilityState.STABLE:
        return 'Dispositivo Estable';
      case StabilityState.MOVING:
        return 'Estabilizando...';
      case StabilityState.UNSTABLE:
        return 'En Movimiento';
    }
  };

  return (
    <View style={[styles.container, { borderColor: getColor() }]}>
      <View style={styles.indicator}>
        <View style={[styles.dot, { backgroundColor: getColor() }]} />
        <Text style={[styles.text, { color: getColor() }]}>
          {getLabel()}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${stability.stabilityScore * 100}%`,
              backgroundColor: getColor() 
            }
          ]} 
        />
      </View>
      <Text style={styles.scoreText}>
        Estabilidad: {(stability.stabilityScore * 100).toFixed(0)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: '#ccc',
    margin: 16,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  scoreText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});