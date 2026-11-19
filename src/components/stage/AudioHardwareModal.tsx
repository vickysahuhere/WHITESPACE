import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { AudioVisualizerCanvas } from './AudioVisualizerCanvas';
import { 
  X, 
  Mic, 
  Volume2, 
  Sliders, 
  Headphones, 
  ShieldCheck, 
  RotateCw,
  Cpu
} from 'lucide-react';

interface AudioHardwareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioHardwareModal: React.FC<AudioHardwareModalProps> = ({ isOpen, onClose }) => {
  const { 
    isMicOn, 
    toggleMic, 
    isLoopbackOn, 
    toggleLoopback, 
    gainPercent, 
    setGainPercent, 
    devices, 
    selectedDeviceId, 
    setSelectedDeviceId,
    refreshDevices
  } = useAudio();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000]/85 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-mono select-none">
      <div className="w-full max-w-xl bg-[#0A0A0A] border border-[#262626] p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* 1. Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
          <div className="flex items-center gap-2">
            <Sliders size={15} className="text-[#FFFFFF]" />
            <span className="text-xs font-bold tracking-wider text-[#FFFFFF] uppercase">
              HARDWARE AUDIO POD // 48 KHZ OPUS CALIBRATION
            </span>
          </div>
          <button onClick={onClose} className="text-[#71717A] hover:text-[#FFFFFF] p-1 hover:bg-[#18181B] transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* 2. Device Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="text-[#A1A1AA] font-bold flex items-center gap-1.5">
              <Mic size={13} className="text-[#FFFFFF]" />
              <span>INPUT MICROPHONE DEVICE</span>
            </label>
            <button
              onClick={refreshDevices}
              title="Rescan connected audio devices"
              className="text-[10px] text-[#71717A] hover:text-[#FFFFFF] flex items-center gap-1 transition-colors"
            >
              <RotateCw size={10} />
              <span>RESCAN</span>
            </button>
          </div>

          <select
            value={selectedDeviceId}
            onChange={e => setSelectedDeviceId(e.target.value)}
            className="w-full bg-[#000000] border border-[#1F1F1F] focus:border-[#FFFFFF] p-2.5 text-xs text-[#FFFFFF] outline-none transition-colors"
          >
            {devices.map(d => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Audio Input Device (${d.deviceId.slice(0, 8)}...)`}
              </option>
            ))}
          </select>
        </div>

        {/* Real-Time Studio FFT Spectrum & dB VU Meter */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#71717A] uppercase font-bold">
            <span>LIVE 60FPS FFT SPECTRUM & RMS dBFS LEVEL</span>
            <span>{isMicOn ? 'HARDWARE STREAM ACTIVE' : 'SIMULATED IDLE'}</span>
          </div>
          <AudioVisualizerCanvas mode="studio" className="w-full h-24" />
        </div>

        {/* 3. Gain Boost (0% to 200%) */}
        <div className="space-y-2.5 bg-[#111111] border border-[#1F1F1F] p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#FFFFFF] font-bold flex items-center gap-1.5">
              <Volume2 size={13} />
              <span>HARDWARE GAIN BOOST</span>
            </span>
            <span className="px-2 py-0.5 bg-[#18181B] border border-[#3F3F46] text-xs font-bold text-[#FFFFFF]">
              {gainPercent}% {gainPercent > 100 ? '(BOOSTED)' : gainPercent === 100 ? '(UNITY)' : '(ATTENUATED)'}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="200"
            step="5"
            value={gainPercent}
            onChange={e => setGainPercent(Number(e.target.value))}
            className="w-full accent-[#FFFFFF] cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-[#71717A] font-mono">
            <button onClick={() => setGainPercent(0)} className="hover:text-[#FFFFFF] transition-colors">0% (MUTE)</button>
            <button onClick={() => setGainPercent(100)} className="hover:text-[#FFFFFF] font-bold text-[#A1A1AA] transition-colors">100% (UNITY 0dB)</button>
            <button onClick={() => setGainPercent(150)} className="hover:text-[#FFFFFF] transition-colors">150% (+3dB)</button>
            <button onClick={() => setGainPercent(200)} className="hover:text-[#FFFFFF] transition-colors">200% (+6dB MAX)</button>
          </div>
        </div>

        {/* 4. Loopback Monitor & Limiter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Loopback Toggle */}
          <div className="bg-[#111111] border border-[#1F1F1F] p-3 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFFFFF] mb-1">
                <Headphones size={13} />
                <span>LOOPBACK MONITOR</span>
              </div>
              <p className="text-[10px] text-[#71717A] leading-relaxed">
                Route uncompressed mic audio back to your headphones to monitor your levels in real-time.
              </p>
            </div>

            <button
              onClick={toggleLoopback}
              className={`w-full py-1.5 text-xs font-bold border transition-colors ${
                isLoopbackOn
                  ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                  : 'bg-[#000000] text-[#A1A1AA] border-[#262626] hover:border-[#3F3F46] hover:text-[#FFFFFF]'
              }`}
            >
              {isLoopbackOn ? 'MONITOR: ACTIVE' : 'ENABLE LOOPBACK'}
            </button>
          </div>

          {/* Soft Limiter Specs */}
          <div className="bg-[#111111] border border-[#1F1F1F] p-3 flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFFFFF] mb-1">
                <ShieldCheck size={13} className="text-[#FFFFFF]" />
                <span>DYNAMICS COMPRESSOR</span>
              </div>
              <p className="text-[10px] text-[#71717A] leading-relaxed">
                Hardware soft limiter at -12 dB prevents acoustic distortion and clipping at high gain boosts.
              </p>
            </div>
            <div className="text-[10px] text-[#A1A1AA] bg-[#0A0A0A] px-2 py-1 border border-[#1F1F1F] flex items-center justify-between font-mono">
              <span>RATIO: 12:1</span>
              <span>ATTACK: 3ms</span>
              <span>RELEASE: 250ms</span>
            </div>
          </div>
        </div>

        {/* 5. Hardware Specifications Bar */}
        <div className="p-3 bg-[#000000] border border-[#1F1F1F] text-[11px] text-[#71717A] space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#FFFFFF] pb-1 border-b border-[#1F1F1F]">
            <div className="flex items-center gap-1.5">
              <Cpu size={12} />
              <span>HARDWARE PIPELINE METRICS</span>
            </div>
            <span className="text-[10px] text-[#52525B]">W3C WEB AUDIO STANDARD</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
            <div>SAMPLE RATE: <span className="text-[#FFFFFF]">48,000 HZ</span></div>
            <div>CODEC: <span className="text-[#FFFFFF]">510 KBPS STEREO OPUS</span></div>
            <div>LATENCY HINT: <span className="text-[#FFFFFF]">INTERACTIVE (&lt;2.5ms)</span></div>
            <div>PROCESSING: <span className="text-[#FFFFFF]">RAW HARDWARE BYPASS</span></div>
          </div>
        </div>

        {/* 6. Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1F1F1F]">
          <button
            onClick={toggleMic}
            className={`px-3 py-1.5 text-xs font-bold border transition-colors ${
              isMicOn
                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                : 'bg-[#18181B] text-[#FFFFFF] border-[#3F3F46] hover:border-[#FFFFFF]'
            }`}
          >
            {isMicOn ? 'TURN MIC OFF' : 'ACTIVATE MIC'}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#CCCCCC] transition-colors"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
