import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { tunerStyles } from '@styles/tunerStyles';
import { TunerContent } from '@components/TunerContent';
import { PermissionDeniedScreen } from '@components/PermissionDeniedScreen';
import { usePitchDetection } from '@hooks/usePitchDetection';
import { useDeviceStability } from '@hooks/useDeviceStability';
import { NoteType } from '@components/StringSelector';

export function TunerScreen() {
  const [selectedNote, setSelectedNote] = useState<NoteType>('G');
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  const { currentPitch, isDetecting, error: pitchError } = usePitchDetection(
    micPermissionGranted,
  );
  const { stability } = useDeviceStability();

  useEffect(() => {
    requestMicrophonePermission();
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      setMicPermissionGranted(permission.granted);
    } catch (err) {
      console.error('Microphone permission error:', err);
      setMicPermissionGranted(false);
    }
  };

  return (
    <ScrollView style={tunerStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <View style={tunerStyles.header}>
        <Text style={tunerStyles.headerTitle}>Ukulele Tuner</Text>
      </View>

      {!micPermissionGranted ? (
        <PermissionDeniedScreen onRequestPermission={requestMicrophonePermission} />
      ) : (
        <TunerContent
          selectedNote={selectedNote}
          onNoteSelect={setSelectedNote}
          currentPitch={currentPitch}
          isDetecting={isDetecting}
          stability={stability}
          pitchError={pitchError}
        />
      )}
    </ScrollView>
  );
}