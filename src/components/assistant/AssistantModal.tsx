import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { WhiteAssistant3D } from './WhiteAssistant3D';
import { Box, X, Activity } from 'lucide-react';

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssistantModal: React.FC<AssistantModalProps> = ({ isOpen, onClose }) => {
  const { audioState, activeMember } = useWorkspace();
  const [geometryMode, setGeometryMode] = useState<'sphere' | 'monogram'>('sphere');
  const [rotationSpeed, setRotationSpeed] = useState<number>(1.0);
  const [simulatedAudio, setSimulatedAudio] = useState(false);

  if (!isOpen) return null;

  const isAudioActive = audioState.micActive || simulatedAudio;
  const audioLevel = isAudioActive ? 0.85 : 0;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-[#0B0B0E]/85 backdrop-blur-md flex items-center justify-center z-50 p-4 font-mono select-none animate-fade-in"
    >
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-4xl h-[680px] bg-[#121217] border border-[#2F2F3E] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Top Header */}
        <div className="h-13 border-b border-[#242432] px-5 flex items-center justify-between bg-[#16161F] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#22222E] border border-[#353547] flex items-center justify-center text-[#FFFFFF]">
              <Box size={15} />
            </div>
            <span className="text-sm font-bold tracking-wider text-[#FFFFFF]">WHITE // 3D VOICE ASSISTANT STUDIO</span>
            <span className="border border-[#2F2F3E] bg-[#1E1E28] px-2 py-0.5 rounded-md text-[10px] text-[#A1A1B4] font-bold">
              THREE.JS WEBGL
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-[#8E8E9E] hover:text-[#FFFFFF] p-1.5 rounded-xl hover:bg-[#22222E] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* 3D Viewport Main Stage */}
        <div className="flex-1 bg-[#0D0D12] relative overflow-hidden flex items-center justify-center">
          <WhiteAssistant3D
            geometryMode={geometryMode}
            isAudioActive={isAudioActive}
            audioLevel={audioLevel}
            rotationSpeed={rotationSpeed}
            className="w-full h-full"
          />

          {/* Real-Time Telemetry HUD Overlay */}
          <div className="absolute top-4 left-4 p-3.5 border border-[#2F2F3E] bg-[#14141C]/90 backdrop-blur-md rounded-2xl text-xs space-y-1.5 pointer-events-none shadow-xl">
            <div className="flex items-center gap-2 font-bold text-[#FFFFFF]">
              <Activity size={13} className="text-emerald-400" />
              <span>TELEMETRY METRICS</span>
            </div>
            <div className="text-[11px] text-[#8E8E9E] space-y-1 font-mono">
              <div>RENDER ENGINE: WebGL (Three.js)</div>
              <div>GEOMETRY: {geometryMode === 'sphere' ? 'GEODESIC ICOSAHEDRON' : 'SCULPTED W MONOGRAM'}</div>
              <div>AUDIO REACTIVITY: {isAudioActive ? 'PULSING (ACTIVE)' : 'STANDBY'}</div>
              <div>ACTIVE MEMBER: {activeMember.badge} ({activeMember.name})</div>
              <div>FRAME RATE: ~60 FPS DYNAMIC</div>
            </div>
          </div>

          {/* Quick Drag Hint */}
          <div className="absolute bottom-4 right-4 text-[11px] text-[#8E8E9E] bg-[#14141C]/90 px-3 py-1.5 rounded-xl border border-[#2F2F3E] pointer-events-none font-medium backdrop-blur-sm">
            CLICK &amp; DRAG TO ORBIT // SCROLL TO INSPECT
          </div>
        </div>

        {/* Studio Controls Strip */}
        <div className="h-16 border-t border-[#242432] px-5 bg-[#16161F] flex items-center justify-between shrink-0 text-xs">
          {/* Geometry Mode Toggle */}
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] text-[#8E8E9E] uppercase font-bold tracking-wider">GEOMETRY:</span>
            <div className="flex rounded-xl p-0.5 bg-[#1E1E28] border border-[#2F2F3E] gap-1">
              <button
                onClick={() => setGeometryMode('sphere')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  geometryMode === 'sphere'
                    ? 'bg-[#FFFFFF] text-[#000000] shadow-sm'
                    : 'text-[#8E8E9E] hover:text-[#FFFFFF]'
                }`}
              >
                01 // GEOMETRIC SPHERE
              </button>
              <button
                onClick={() => setGeometryMode('monogram')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  geometryMode === 'monogram'
                    ? 'bg-[#FFFFFF] text-[#000000] shadow-sm'
                    : 'text-[#8E8E9E] hover:text-[#FFFFFF]'
                }`}
              >
                02 // SCULPTED &apos;W&apos; MONOGRAM
              </button>
            </div>
          </div>

          {/* Rotation Speed & Audio Test */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#8E8E9E] uppercase font-bold tracking-wider">SPEED:</span>
              <div className="flex rounded-xl p-0.5 bg-[#1E1E28] border border-[#2F2F3E] gap-0.5">
                {[0.5, 1.0, 2.0].map(s => (
                  <button
                    key={s}
                    onClick={() => setRotationSpeed(s)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      rotationSpeed === s 
                        ? 'bg-[#FFFFFF] text-[#000000] shadow-sm' 
                        : 'text-[#8E8E9E] hover:text-[#FFFFFF]'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Test Audio Button */}
            <button
              onClick={() => setSimulatedAudio(!simulatedAudio)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                simulatedAudio
                  ? 'border-emerald-500 bg-emerald-500 text-[#000000]'
                  : 'border-[#2F2F3E] bg-[#1E1E28] text-[#FFFFFF] hover:border-[#FFFFFF]'
              }`}
            >
              <Activity size={13} className={simulatedAudio ? 'animate-pulse' : ''} />
              <span>{simulatedAudio ? 'AUDIO: PULSING' : 'TEST AUDIO PULSE'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
