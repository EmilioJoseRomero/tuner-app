import { Gyroscope } from 'expo-sensors';
import { IGyroscopeDataSource, Subscription } from '../../domain/services/IGyroscopeDataSource';
import { GyroscopeData } from '../../domain/value-objects/GyroscopeData';

export class ExpoGyroscopeAdapter implements IGyroscopeDataSource {
  private listener: Subscription | null = null;

  startListening(callback: (data: GyroscopeData) => void): Subscription {
    this.stopListening();

    this.listener = Gyroscope.addListener((sensorData) => {
      const data = new GyroscopeData(
        sensorData.x,
        sensorData.y,
        sensorData.z,
        Date.now(),
      );
      callback(data);
    });

    return this.listener;
  }

  stopListening(): void {
    if (this.listener) {
      this.listener.remove();
      this.listener = null;
    }
  }

  setUpdateInterval(intervalMs: number): void {
    Gyroscope.setUpdateInterval(intervalMs);
  }

  async isAvailable(): Promise<boolean> {
    return await Gyroscope.isAvailableAsync();
  }
}
