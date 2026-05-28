import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useGyroRecorder } from '@hooks/useGyroRecorder';
import { SessionList } from '@components/SessionList';
import { RecorderButton } from '@components/RecorderButton';

export function SoundScreen() {
  const {
    status,
    sessions,
    error,
    hasPermission,
    isStable,
    isBusy,
    requestPermission,
    startRecording,
    stopRecording,
    resetRecorder,
  } = useGyroRecorder();

  useEffect(() => {
    if (hasPermission === null) {
      void requestPermission();
    }
  }, [hasPermission]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Practice Sessions</Text>

      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Estado</Text>
          <Text style={styles.statusValue}>{status}</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Estabilidad</Text>
          <Text style={styles.statusValue}>{isStable ? 'Estable' : 'Inestable'}</Text>
        </View>
      </View>

      <RecorderButton
        status={status}
        disabled={!isStable || isBusy}
        onPress={status === 'Grabando...' ? () => stopRecording(true) : startRecording}
      />

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetRecorder}
          activeOpacity={0.7}
          disabled={isBusy}
        >
          <Text style={styles.resetButtonText}>Reset Recorder</Text>
        </TouchableOpacity>
      </View>

      {hasPermission === false && (
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
          activeOpacity={0.7}
        >
          <Text style={styles.permissionButtonText}>Request Permission</Text>
        </TouchableOpacity>
      )}

      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Historial</Text>
      <SessionList sessions={sessions} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  content: {
    padding: 24,
    paddingBottom: 140,
    paddingTop: 56,
  },
  title: {
    color: '#4ae176',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#e5e2e1',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  controls: {
    marginTop: 12,
    alignItems: 'center',
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(11, 11, 15, 0.6)',
  },
  resetButtonText: {
    color: '#e5e2e1',
    fontSize: 12,
    fontWeight: '600',
  },
  statusCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(11, 11, 15, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusLabel: {
    color: 'rgba(229, 226, 225, 0.6)',
    fontSize: 13,
  },
  statusValue: {
    color: '#e5e2e1',
    fontSize: 13,
    fontWeight: '600',
  },
  permissionButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#4ae176',
  },
  permissionButtonText: {
    color: '#050505',
    fontSize: 13,
    fontWeight: '600',
  },
  errorCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.4)',
  },
  errorText: {
    color: '#F44336',
    fontSize: 13,
    textAlign: 'center',
  },
});