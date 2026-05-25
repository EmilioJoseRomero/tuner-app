import { useState, useEffect } from 'react';
import { Pitch } from '@domain/value-objects/Pitch';
import { DetectPitchUseCase } from '@application/use-cases/DetectPitchUseCase';
import { PitchDetectionService } from '@domain/services/PitchDetectionService';
import { ExpoAudioRecorder } from '@infrastructure/audio/ExpoAudioRecorder';

interface UsePitchDetectionReturn {
  currentPitch: Pitch | null;
  isDetecting: boolean;
  error: string | null;
}

export function usePitchDetection(
  enabled: boolean = true,
): UsePitchDetectionReturn {
  const [currentPitch, setCurrentPitch] = useState<Pitch | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsDetecting(false);
      setError('Microphone permission not granted');
      return;
    }

    const audioRecorder = new ExpoAudioRecorder();
    const pitchDetectionService = new PitchDetectionService();
    const detectPitchUseCase = new DetectPitchUseCase(
      audioRecorder,
      pitchDetectionService,
    );

    setIsDetecting(true);
    setError(null);

    const cleanup = detectPitchUseCase.startDetection((pitch: Pitch | null) => {
      if (pitch) {
        setCurrentPitch(pitch);
      }
    });

    return () => {
      cleanup();
      setIsDetecting(false);
    };
  }, [enabled]);

  return { currentPitch, isDetecting, error };
}
