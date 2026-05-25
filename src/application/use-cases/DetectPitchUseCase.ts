import { Pitch } from '@domain/value-objects/Pitch';
import { PitchDetectionService } from '@domain/services/PitchDetectionService';
import { IAudioDataSource } from '@infrastructure/audio/ExpoAudioRecorder';

export type PitchCallback = (pitch: Pitch | null) => void;

export class DetectPitchUseCase {
  private lastPitch: Pitch | null = null;

  constructor(
    private audioDataSource: IAudioDataSource,
    private pitchDetectionService: PitchDetectionService,
  ) {}

  startDetection(callback: PitchCallback): () => void {
    this.audioDataSource.startRecording((audioBuffer) => {
      const pitch = this.pitchDetectionService.detect(audioBuffer.data);

      // Only emit if note changed or significant parameter change
      if (
        !this.lastPitch ||
        pitch?.note !== this.lastPitch.note ||
        Math.abs(pitch?.offsetCents || 0 - (this.lastPitch.offsetCents || 0)) > 2
      ) {
        this.lastPitch = pitch;
        callback(pitch);
      }
    });

    return () => this.audioDataSource.stopRecording();
  }
}
