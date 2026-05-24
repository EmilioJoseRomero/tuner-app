import { GyroscopeData } from '../value-objects/GyroscopeData';
import { DeviceStability, StabilityState } from '../value-objects/DeviceStability';
import { StabilityConfig } from '../entities/StabilityConfig';

export class StabilityAnalyzer {
  private stableStartTime: number | null = null;

  constructor(private config: StabilityConfig) {}

  analyze(data: GyroscopeData): DeviceStability {
    const magnitude = data.magnitude;
    const now = data.timestamp;

    if (magnitude < this.config.movementThreshold) {
      if (this.stableStartTime === null) {
        this.stableStartTime = now;
      }
      
      const elapsedTime = now - this.stableStartTime;
      const timeRatio = Math.min(1, elapsedTime / this.config.stableTimeRequired);
      
      if (timeRatio >= 1) {
        return new DeviceStability(StabilityState.STABLE, 1, magnitude, now);
      } else {
        const score = 0.3 + timeRatio * 0.7;
        return new DeviceStability(StabilityState.MOVING, score, magnitude, now);
      }
    } else {
      this.stableStartTime = null;
      const score = Math.max(0, 1 - magnitude / (this.config.movementThreshold * 2));
      return new DeviceStability(StabilityState.UNSTABLE, score, magnitude, now);
    }
  }

  reset(): void {
    this.stableStartTime = null;
  }
}