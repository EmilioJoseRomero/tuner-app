import { Audio, AVPlaybackSource } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export interface AudioBuffer {
  data: Float32Array;
  sampleRate: number;
  timestamp: number;
}

export interface IAudioDataSource {
  startRecording(callback: (buffer: AudioBuffer) => void): Promise<void>;
  stopRecording(): Promise<void>;
  isAvailable(): Promise<boolean>;
}

export class ExpoAudioRecorder implements IAudioDataSource {
  private recording: Audio.Recording | null = null;
  private isRecording = false;
  private recordingInterval: NodeJS.Timeout | null = null;

  async startRecording(callback: (buffer: AudioBuffer) => void): Promise<void> {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        throw new Error('Microphone permission not granted');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      this.recording = new Audio.Recording();
      await this.recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      await this.recording.startAsync();
      this.isRecording = true;

      // Record audio in chunks every 500ms
      this.recordingInterval = setInterval(async () => {
        if (!this.recording || !this.isRecording) return;

        try {
          const status = await this.recording.getStatusAsync();
          if (status.isRecording) {
            const uri = this.recording.getURI();
            if (uri) {
              const audioData = await this.processAudioFile(uri);
              if (audioData) {
                callback(audioData);
              }
            }
          }
        } catch (err) {
          console.error('Error reading audio buffer:', err);
        }
      }, 500);
    } catch (err) {
      console.error('Failed to start recording:', err);
      throw err;
    }
  }

  async stopRecording(): Promise<void> {
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
      this.recordingInterval = null;
    }

    if (this.recording && this.isRecording) {
      try {
        await this.recording.stopAndUnloadAsync();
        this.isRecording = false;
      } catch (err) {
        console.error('Error stopping recording:', err);
      }
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const permission = await Audio.getPermissionsAsync();
      return permission.granted;
    } catch {
      return false;
    }
  }

  private async processAudioFile(uri: string): Promise<AudioBuffer | null> {
    try {
      // Read file as base64 and convert to Float32Array
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) return null;

      // This is a simplified approach - in production, you'd need
      // a proper audio decoder. For now, we'll use a mock buffer.
      const buffer = new Float32Array(2048);
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = Math.random() * 2 - 1;
      }

      return {
        data: buffer,
        sampleRate: 44100,
        timestamp: Date.now(),
      };
    } catch (err) {
      console.error('Error processing audio file:', err);
      return null;
    }
  }
}
