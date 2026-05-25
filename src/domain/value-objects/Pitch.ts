export type NoteType = 'G' | 'C' | 'E' | 'A';

export class Pitch {
  readonly note: NoteType;
  readonly frequency: number;
  readonly confidence: number;
  readonly offsetCents: number;
  readonly timestamp: number;

  constructor(
    note: NoteType,
    frequency: number,
    confidence: number,
    offsetCents: number,
    timestamp: number,
  ) {
    this.note = note;
    this.frequency = frequency;
    this.confidence = confidence;
    this.offsetCents = offsetCents;
    this.timestamp = timestamp;
  }

  get isInTune(): boolean {
    return Math.abs(this.offsetCents) <= 5;
  }

  get isClose(): boolean {
    return Math.abs(this.offsetCents) <= 15;
  }

  get isTooSharp(): boolean {
    return this.offsetCents > 5;
  }

  get isTooFlat(): boolean {
    return this.offsetCents < -5;
  }
}
