import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { audioEngine } from '../services/audioEngine';

interface AudioContextType {
  isMicOn: boolean;
  isLoopbackOn: boolean;
  gainPercent: number; // 0 to 200
  devices: MediaDeviceInfo[];
  selectedDeviceId: string;
  analyserNode: AnalyserNode | null;
  showHardwareModal: boolean;
  setShowHardwareModal: (show: boolean) => void;
  toggleMic: () => Promise<void>;
  toggleLoopback: () => void;
  setGainPercent: (percent: number) => void;
  setSelectedDeviceId: (deviceId: string) => void;
  refreshDevices: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isLoopbackOn, setIsLoopbackOn] = useState(false);
  const [gainPercent, setGainPercentState] = useState(100);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceIdState] = useState<string>('default');
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const [showHardwareModal, setShowHardwareModal] = useState(false);

  // Load hardware devices
  const refreshDevices = useCallback(async () => {
    const list = await audioEngine.getDevices();
    setDevices(list);
    if (list.length > 0 && selectedDeviceId === 'default') {
      setSelectedDeviceIdState(list[0].deviceId);
    }
  }, [selectedDeviceId]);

  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);

  // Adjust Gain
  const setGainPercent = useCallback((percent: number) => {
    const clamped = Math.max(0, Math.min(200, percent));
    setGainPercentState(clamped);
    audioEngine.setGain(clamped / 100);
  }, []);

  // Toggle Loopback Monitor
  const toggleLoopback = useCallback(() => {
    setIsLoopbackOn(prev => {
      const next = !prev;
      audioEngine.setLoopback(next);
      return next;
    });
  }, []);

  // Switch Selected Device
  const setSelectedDeviceId = useCallback((id: string) => {
    setSelectedDeviceIdState(id);
    if (isMicOn) {
      audioEngine.stopMic();
      audioEngine.startMic(id).then(() => {
        setAnalyserNode(audioEngine.getAnalyser());
      });
    }
  }, [isMicOn]);

  // Toggle Microphone
  const toggleMic = useCallback(async () => {
    if (isMicOn) {
      audioEngine.stopMic();
      setIsMicOn(false);
      setAnalyserNode(null);
    } else {
      await audioEngine.startMic(selectedDeviceId);
      setIsMicOn(true);
      setAnalyserNode(audioEngine.getAnalyser());
    }
  }, [isMicOn, selectedDeviceId]);

  return (
    <AudioContext.Provider value={{
      isMicOn,
      isLoopbackOn,
      gainPercent,
      devices,
      selectedDeviceId,
      analyserNode,
      showHardwareModal,
      setShowHardwareModal,
      toggleMic,
      toggleLoopback,
      setGainPercent,
      setSelectedDeviceId,
      refreshDevices
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
