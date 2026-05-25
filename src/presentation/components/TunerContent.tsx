import React from 'react';
import { View } from 'react-native';
import { tunerStyles } from '@styles/tunerStyles';
import { TunerStatus } from '@components/TunerStatus';
import { TunerGauge } from '@components/TunerGauge';
import { StringSelector, NoteType } from '@components/StringSelector';
import { TunerIndicators } from '@components/TunerIndicators';
import { Pitch } from '@domain/value-objects/Pitch';
import { DeviceStability } from '@domain/value-objects/DeviceStability';

interface TunerContentProps {
  selectedNote: NoteType;
  onNoteSelect: (note: NoteType) => void;
  currentPitch: Pitch | null;
  isDetecting: boolean;
  stability: DeviceStability | null;
  pitchError: string | null;
}

export function TunerContent({
  selectedNote,
  onNoteSelect,
  currentPitch,
  isDetecting,
  stability,
  pitchError,
}: TunerContentProps) {
  const getStatusLabel = (): string => {
    if (pitchError) return 'Microphone Error';
    if (!isDetecting) return 'Starting...';
    if (!currentPitch) return 'Listening...';
    return currentPitch.isInTune ? 'Perfect' : 'Tuning...';
  };

  const isInTune = currentPitch?.isInTune ?? false;

  return (
    <View style={tunerStyles.mainContent}>
      <TunerStatus isInTune={isInTune} label={getStatusLabel()} />

      <TunerGauge
        currentNote={currentPitch?.note ?? 'G'}
        frequency={currentPitch?.frequency ?? 0}
        offsetCents={currentPitch?.offsetCents ?? 0}
      />

      <StringSelector selectedNote={selectedNote} onNoteSelect={onNoteSelect} />

      <TunerIndicators
        stabilityState={stability?.state}
        stabilityScore={stability?.stabilityScore}
        micError={!!pitchError}
      />
    </View>
  );
}
