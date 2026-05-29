// src/domain/value-objects/DeviceStability.ts
export enum StabilityState {
  STABLE = 'STABLE',
  MOVING = 'MOVING',
  UNSTABLE = 'UNSTABLE',
}

export class DeviceStability {
  constructor(
    public readonly state: StabilityState,
    public readonly stabilityScore: number,
    public readonly movementMagnitude: number,
    public readonly timestamp: number
  ) {}

  get isStable(): boolean {
    return this.state === StabilityState.STABLE;
  }
}