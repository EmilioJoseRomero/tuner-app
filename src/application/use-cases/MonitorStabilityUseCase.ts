import { IGyroscopeDataSource } from '../../domain/services/IGyroscopeDataSource';
import { StabilityAnalyzer } from '../../domain/services/StabilityAnalyzer';
import { DeviceStability } from '../../domain/value-objects/DeviceStability';
import { StabilityConfig } from '../../domain/entities/StabilityConfig';
import { ExpoGyroscopeAdapter } from '../../infrastructure/sensors/ExpoGyroscopeAdapter';

export class MonitorStabilityUseCase {
  private dataSource: IGyroscopeDataSource;
  private analyzer: StabilityAnalyzer;

  constructor(config?: StabilityConfig) {
    this.dataSource = new ExpoGyroscopeAdapter();
    this.analyzer = new StabilityAnalyzer(config || StabilityConfig.forDevelopment());
  }

  async startMonitoring(onUpdate: (stability: DeviceStability) => void): Promise<() => void> {
    const available = await this.dataSource.isAvailable();
    
    if (!available) {
      throw new Error('Gyroscope not available');
    }

    this.dataSource.setUpdateInterval(100);
    
    this.dataSource.startListening((gyroData) => {
      const stability = this.analyzer.analyze(gyroData);
      onUpdate(stability);
    });

    return () => {
      this.dataSource.stopListening();
      this.analyzer.reset();
    };
  }
}