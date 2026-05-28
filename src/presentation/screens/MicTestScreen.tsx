import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { tunerStyles, COLORS } from '@styles/tunerStyles';

export function MicTestScreen() {
  const [status, setStatus] = useState<'Listo' | 'Probando...' | 'Detenido'>('Listo');
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);

  useEffect(() => {
    return () => {
      void stopTest();
    };
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      setHasPermission(permission.granted);
      if (!permission.granted) {
        setError('Microphone permission not granted');
      } else {
        setError(null);
      }
    } catch {
      setHasPermission(false);
      setError('Microphone permission error');
    }
  };

  const startTest = async () => {
    if (recordingRef.current || isBusy) return;

    if (hasPermission === null) {
      await requestPermission();
      return;
    }

    if (!hasPermission) return;

    try {
      setIsBusy(true);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      recordingRef.current = recording;

      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      if (typeof (recording as any).setProgressUpdateIntervalAsync === 'function') {
        await (recording as any).setProgressUpdateIntervalAsync(250);
      } else if (typeof (recording as any).setProgressUpdateInterval === 'function') {
        (recording as any).setProgressUpdateInterval(250);
      }
      await recording.startAsync();
      setStatus('Probando...');
      setError(null);
    } catch (err) {
      recordingRef.current = null;
      setStatus('Listo');
      setError(`Failed to start recording: ${String(err)}`);
    } finally {
      setIsBusy(false);
    }
  };

  const stopTest = async () => {
    const recording = recordingRef.current;
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
    } catch {
      // Ignore stop errors.
    }

    recordingRef.current = null;
    setStatus('Detenido');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mic Test</Text>
      <Text style={styles.status}>{status}</Text>

      <TouchableOpacity
        style={[styles.button, status === 'Probando...' && styles.buttonActive]}
        onPress={status === 'Probando...' ? stopTest : startTest}
        activeOpacity={0.7}
        disabled={isBusy}
      >
        <Text style={styles.buttonText}>
          {status === 'Probando...' ? 'Detener' : 'Probar microfono'}
        </Text>
      </TouchableOpacity>

      {hasPermission === false && (
        <TouchableOpacity
          style={tunerStyles.permissionButton}
          onPress={requestPermission}
          activeOpacity={0.7}
        >
          <Text style={tunerStyles.permissionButtonText}>Request Permission</Text>
        </TouchableOpacity>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 120,
  },
  title: {
    color: COLORS.accent,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  status: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
  },
  buttonActive: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '700',
  },
  error: {
    marginTop: 16,
    color: COLORS.error,
    fontSize: 12,
    textAlign: 'center',
  },
});
