import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { GyroRecorderStatus } from '@hooks/useGyroRecorder';
import { COLORS } from '@styles/tunerStyles';

interface RecorderButtonProps {
  status: GyroRecorderStatus;
  disabled: boolean;
  onPress: () => void;
}

export function RecorderButton({ status, disabled, onPress }: RecorderButtonProps) {
  const isRecording = status === 'Grabando...';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          isRecording && styles.actionButtonActive,
          disabled && styles.actionButtonDisabled,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text style={styles.actionButtonText}>
          {isRecording ? 'Detener' : 'Grabar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    alignItems: 'center',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
  },
  actionButtonActive: {
    backgroundColor: COLORS.error,
  },
  actionButtonDisabled: {
    opacity: 0.4,
  },
  actionButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '700',
  },
});
