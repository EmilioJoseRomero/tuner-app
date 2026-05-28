import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { PracticeSession } from '@hooks/useGyroRecorder';
import { COLORS } from '@styles/tunerStyles';

interface SessionListProps {
  sessions: PracticeSession[];
}

export function SessionList({ sessions }: SessionListProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const stopSound = async () => {
    if (!sound) return;
    try {
      await sound.stopAsync();
      await sound.unloadAsync();
    } finally {
      setSound(null);
      setPlayingId(null);
    }
  };

  useEffect(() => {
    return () => {
      void stopSound();
    };
  }, [sound]);

  const playSession = async (session: PracticeSession) => {
    if (playingId === session.id) {
      await stopSound();
      return;
    }

    if (sound) {
      await stopSound();
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
    });

    const { sound: nextSound } = await Audio.Sound.createAsync(
      { uri: session.fileUri },
      { shouldPlay: true, volume: 1.0 },
      (status) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          void stopSound();
        }
      },
    );

    setSound(nextSound);
    setPlayingId(session.id);
  };

  if (sessions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay sesiones grabadas.</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {sessions.map((session) => (
        <View key={session.id} style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.dateText}>{formatDate(session.createdAt)}</Text>
            <Text style={styles.metaText}>{session.durationSec}s</Text>
          </View>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => playSession(session)}
            activeOpacity={0.7}
          >
            <Text style={styles.playButtonText}>
              {playingId === session.id ? 'Stop' : 'Play'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

const styles = StyleSheet.create({
  listContainer: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  info: {
    gap: 6,
  },
  dateText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  playButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.accentLight,
    borderWidth: 1,
    borderColor: COLORS.accentGlow,
  },
  playButtonText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
});
