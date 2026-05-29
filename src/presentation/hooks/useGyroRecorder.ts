import { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Gyroscope } from 'expo-sensors';

export type GyroRecorderStatus =
  | 'Esperando estabilidad...'
  | 'Listo para grabar'
  | 'Grabando...'
  | 'Guardado';

export interface PracticeSession {
  id: string;
  fileUri: string;
  createdAt: string;
  durationSec: number;
}

const STABILITY_THRESHOLD = 0.08;
const STABLE_REQUIRED_MS = 1500;
const GYRO_INTERVAL_MS = 100;

const SESSIONS_DIR = `${FileSystem.documentDirectory}sessions`;
const SESSIONS_FILE = `${SESSIONS_DIR}/sessions.json`;

let globalRecording: Audio.Recording | null = null;
let globalPreparing = false;
let globalQueue = Promise.resolve();

export function useGyroRecorder() {
  const [status, setStatus] = useState<GyroRecorderStatus>('Esperando estabilidad...');
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isStable, setIsStable] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const preparingRef = useRef(false);
  const lastStatusRef = useRef<Audio.RecordingStatus | null>(null);
  const stableStartRef = useRef<number | null>(null);
  const lastGyroRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const isRecordingRef = useRef(false);
  const stoppingRef = useRef(false);

  useEffect(() => {
    void loadSessions(); // Load recording sessions
  }, []);

  useEffect(() => {
    Gyroscope.setUpdateInterval(GYRO_INTERVAL_MS);
    const sub = Gyroscope.addListener((data) => {
      const last = lastGyroRef.current;
      lastGyroRef.current = { x: data.x, y: data.y, z: data.z };

      if (!last) return;

      const deltaX = Math.abs(data.x - last.x);
      const deltaY = Math.abs(data.y - last.y);
      const deltaZ = Math.abs(data.z - last.z);
      const isQuiet =
        deltaX < STABILITY_THRESHOLD &&
        deltaY < STABILITY_THRESHOLD &&
        deltaZ < STABILITY_THRESHOLD;

      if (isQuiet) {
        if (stableStartRef.current === null) {
          stableStartRef.current = Date.now();
        }
        const elapsed = Date.now() - stableStartRef.current;
        if (elapsed >= STABLE_REQUIRED_MS) {
          if (!isStable) {
            setIsStable(true);
            if (!isRecordingRef.current) {
              setStatus('Listo para grabar');
            }
          }
        }
      } else {
        stableStartRef.current = null;
        if (isStable) {
          setIsStable(false);
        }
        if (isRecordingRef.current && !stoppingRef.current) {
          stoppingRef.current = true;
          void enqueueGlobal(() => stopRecording(true));
        } else if (!isRecordingRef.current) {
          setStatus('Esperando estabilidad...');
        }
      }
    });

    return () => {
      sub.remove();
    };
  }, [isStable]);

  useEffect(() => {
    return () => {
      void enqueueGlobal(() => stopRecording(false));
    };
  }, []);

  const enqueueGlobal = async (action: () => Promise<void>) => {
    globalQueue = globalQueue
      .then(action)
      .catch(() => undefined);
    return globalQueue;
  };

  const requestPermission = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      setHasPermission(permission.granted);
      if (!permission.granted) {
        setError('Microphone permission not granted');
      } else {
        setError(null);
      }
    } catch {
      setHasPermission(false);
      setError('Microphone permission error');
    }
  };

  const ensureSessionsDir = async () => {
    const dirInfo = await FileSystem.getInfoAsync(SESSIONS_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(SESSIONS_DIR, { intermediates: true });
    }
  };

  const loadSessions = async () => {
    try {
      await ensureSessionsDir();
      const fileInfo = await FileSystem.getInfoAsync(SESSIONS_FILE);
      if (!fileInfo.exists) {
        setSessions([]);
        return;
      }
      const raw = await FileSystem.readAsStringAsync(SESSIONS_FILE);
      const parsed = JSON.parse(raw) as PracticeSession[];
      setSessions(parsed);
    } catch {
      setError('Failed to load sessions');
    }
  };

  const saveSessions = async (nextSessions: PracticeSession[]) => {
    await ensureSessionsDir();
    await FileSystem.writeAsStringAsync(
      SESSIONS_FILE,
      JSON.stringify(nextSessions, null, 2),
    );
  };

  const startRecording = async () => {
    if (!isStable || isRecordingRef.current || preparingRef.current || globalPreparing) {
      if (!isStable) setStatus('Esperando estabilidad...');
      return;
    }

    if (hasPermission === null) {
      await requestPermission();
      return;
    }

    if (!hasPermission) return;

    try {
      preparingRef.current = true;
      globalPreparing = true;
      setIsBusy(true);

      if (globalRecording) {
        try {
          globalRecording.setOnRecordingStatusUpdate(null);
          await globalRecording.stopAndUnloadAsync();
        } catch {
          // Ignore errors while releasing stale recording.
        } finally {
          globalRecording = null;
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      recordingRef.current = recording;
      globalRecording = recording;

      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      if (typeof (recording as any).setProgressUpdateIntervalAsync === 'function') {
        await (recording as any).setProgressUpdateIntervalAsync(250);
      } else if (typeof (recording as any).setProgressUpdateInterval === 'function') {
        (recording as any).setProgressUpdateInterval(250);
      }
      recording.setOnRecordingStatusUpdate((statusUpdate) => {
        lastStatusRef.current = statusUpdate;
      });

      await recording.startAsync();
      isRecordingRef.current = true;
      setStatus('Grabando...');
    } catch (err) {
      recordingRef.current = null;
      globalRecording = null;
      setError(`Failed to start recording: ${String(err)}`);
      setStatus(isStable ? 'Listo para grabar' : 'Esperando estabilidad...');
    } finally {
      preparingRef.current = false;
      globalPreparing = false;
      setIsBusy(false);
    }
  };

  const stopRecording = async (saveRecording: boolean) => {
    preparingRef.current = false;
    setIsBusy(true);
    const recording = recordingRef.current;
    if (!recording) {
      setIsBusy(false);
      return;
    }

    try {
      recording.setOnRecordingStatusUpdate(null);
      await recording.stopAndUnloadAsync();
    } catch {
      // Ignore stop errors.
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });
    } catch {
      // Ignore audio mode errors.
    }

    const uri = recording.getURI();
    recordingRef.current = null;
    if (globalRecording === recording) {
      globalRecording = null;
    }

    isRecordingRef.current = false;
    stoppingRef.current = false;

    if (saveRecording && uri) {
      const durationMillis = lastStatusRef.current?.durationMillis ?? 0;
      const durationSec = Math.max(0, Math.round(durationMillis / 1000));
      const createdAt = new Date().toISOString();
      const id = `${Date.now()}`;
      const targetUri = `${SESSIONS_DIR}/${id}.m4a`;

      try {
        await ensureSessionsDir();
        await FileSystem.moveAsync({ from: uri, to: targetUri });

        const next = [
          {
            id,
            fileUri: targetUri,
            createdAt,
            durationSec,
          },
          ...sessions,
        ];
        setSessions(next);
        await saveSessions(next);
        setStatus('Guardado');
        setTimeout(() => {
          if (isStable) {
            setStatus('Listo para grabar');
          } else {
            setStatus('Esperando estabilidad...');
          }
        }, 800);
      } catch {
        setError('Failed to save recording');
        setStatus(isStable ? 'Listo para grabar' : 'Esperando estabilidad...');
      }
    } else {
      setStatus(isStable ? 'Listo para grabar' : 'Esperando estabilidad...');
      if (uri) {
        void FileSystem.deleteAsync(uri, { idempotent: true });
      }
    }

    setIsBusy(false);
  };

  const resetRecorder = async () => {
    await enqueueGlobal(async () => {
      setIsBusy(true);
      try {
        if (recordingRef.current) {
          await stopRecording(false);
        }
        if (globalRecording) {
          try {
            globalRecording.setOnRecordingStatusUpdate(null);
            await globalRecording.stopAndUnloadAsync();
          } catch {
            // Ignore errors while releasing a stale recording.
          } finally {
            globalRecording = null;
          }
        }
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
        });
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        setError(null);
        setStatus(isStable ? 'Listo para grabar' : 'Esperando estabilidad...');
      } finally {
        setIsBusy(false);
      }
    });
  };

  return {
    status,
    sessions,
    error,
    hasPermission,
    isStable,
    isBusy,
    requestPermission,
    startRecording: () => enqueueGlobal(startRecording),
    stopRecording: (saveRecording: boolean) => enqueueGlobal(() => stopRecording(saveRecording)),
    resetRecorder,
  };
}
