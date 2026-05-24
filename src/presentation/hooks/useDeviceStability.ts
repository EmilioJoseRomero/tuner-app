import { useEffect, useState } from 'react';
import { MonitorStabilityUseCase } from '../../application/use-cases/MonitorStabilityUseCase';
import { DeviceStability, StabilityState } from '../../domain/value-objects/DeviceStability';

interface UseDeviceStabilityReturn {
  stability: DeviceStability | null;
  isAvailable: boolean;
  error: string | null;
  isStable: boolean;
}

export function useDeviceStability(): UseDeviceStabilityReturn {
  const [stability, setStability] = useState<DeviceStability | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const useCase = new MonitorStabilityUseCase();
    let cleanup: (() => void) | undefined;

    useCase.startMonitoring((newStability) => {
      setStability(newStability);
      setIsAvailable(true);
      setError(null);
    }).then((cleanupFn) => {
      cleanup = cleanupFn;
    }).catch((err) => {
      setError(err.message);
      setIsAvailable(false);
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const isStable = stability?.state === StabilityState.STABLE;

  return { stability, isAvailable, error, isStable };
}