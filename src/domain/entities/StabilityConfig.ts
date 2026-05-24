export class StabilityConfig {
  constructor(
    public readonly movementThreshold: number = 0.3,
    public readonly stableTimeRequired: number = 800,
  ) {}

  static forDevelopment(): StabilityConfig {
    return new StabilityConfig(0.3, 800);
  }
}