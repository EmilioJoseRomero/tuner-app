// src/domain/value-objects/GyroscopeData.ts
export class GyroscopeData {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number,
    public readonly timestamp: number
  ) {}

  get magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }
}