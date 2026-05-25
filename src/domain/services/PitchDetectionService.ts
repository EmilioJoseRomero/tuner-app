import PitchFinder from 'pitchfinder';
import { Pitch, NoteType } from '@domain/value-objects/Pitch';

const NOTE_FREQUENCIES = {
  G: 392,
  C: 262,
  E: 330,
  A: 440,
} as const;

export class PitchDetectionService {
  private detector = PitchFinder.AMDF({});

  detect(buffer: Float32Array): Pitch | null {
    try {
      const frequency = this.detector(buffer);

      if (!frequency || frequency < 260 || frequency > 450) {
        return null;
      }

      const closestNote = this.getClosestNote(frequency);
      const offsetCents = this.calculateCents(
        frequency,
        NOTE_FREQUENCIES[closestNote],
      );

      return new Pitch(
        closestNote,
        frequency,
        0.9,
        offsetCents,
        Date.now(),
      );
    } catch (err) {
      console.error('Pitch detection error:', err);
      return null;
    }
  }

  private getClosestNote(frequency: number): NoteType {
    const notes: NoteType[] = ['G', 'C', 'E', 'A'];
    let closest = notes[0];
    let minDiff = Math.abs(frequency - NOTE_FREQUENCIES[closest]);

    for (const note of notes) {
      const diff = Math.abs(frequency - NOTE_FREQUENCIES[note]);
      if (diff < minDiff) {
        minDiff = diff;
        closest = note;
      }
    }

    return closest;
  }

  private calculateCents(detected: number, expected: number): number {
    if (detected <= 0 || expected <= 0) return 0;
    return 1200 * Math.log2(detected / expected);
  }
}
