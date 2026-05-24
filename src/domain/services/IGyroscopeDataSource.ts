import { GyroscopeData } from '../value-objects/GyroscopeData';

export interface Subscription {
  remove: () => void;
}

export interface IGyroscopeDataSource {
  startListening(callback: (data: GyroscopeData) => void): Subscription;
  stopListening(): void;
  setUpdateInterval(intervalMs: number): void;
  isAvailable(): Promise<boolean>;
}