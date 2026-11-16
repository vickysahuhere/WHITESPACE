import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { WhiteAssistant3D } from './WhiteAssistant3D';
import { Box, X, Play, Pause, Activity, Sparkles, Sliders } from 'lucide-react';

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
      className="fixed inset-0 bg-[#000000]/85 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-mono select-none"
    >
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-4xl h-[680px] bg-[#0A0A0A] border border-[#404040] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Top Header */}
        <div className="h-12 border-b border-[#262626] px-4 flex items-center justify-between bg-[#0F0F0F] shrink-0">
          <div className="flex items-center gap-2">
            <Box size={15} className="text-[#FFFFFF]" />
            <span className="text-xs font-bold tracking-widest text-[#FFFFFF]">WHITE // 3D REACTIVE ASSISTANT STUDIO</span>
            <span className="border border-[#333333] bg-[#141414] px-1.5 py-0.5 text-[10px] text-[#A3A3A3] font-bold">
              THREE.JS WEBGL
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-[#A3A3A3] hover:text-[#FFFFFF] p-1 border border-transparent hover:border-[#262626]"
          >
            <X size={15} />
          </button>
        </div>

        {/* 3D Viewport Main Stage */}
        <div className="flex-1 bg-[#050505] relative overflow-hidden flex items-center justify-center">
          <WhiteAssistant3D
            geometryMode={geometryMode}
            isAudioActive={isAudioActive}
            audioLevel={audioLevel}
            rotationSpeed={rotationSpeed}
            className="w-full h-full"
          />

          {/* Real-Time Telemetry HUD Overlay */}
          <div className="absolute top-4 left-4 p-3 border border-[#262626] bg-[#0A0A0A]/90 backdrop-blur-xs text-xs space-y-1.5 pointer-events-none">
            <div className="flex items-center gap-2 font-bold text-[#FFFFFF]">
              <Activity size={12} />
              <span>TELEMETRY METRICS</span>
            </div>
            <div className="text-[10px] text-[#737373] space-y-0.5">
              <div>RENDER ENGINE: WebGL (Three.js 0.182)</div>
              <div>GEOMETRY: {geometryMode === 'sphere' ? 'GEODESIC ICOSAHEDRON' : 'SCULPTED W MONOGRAM'}</div>
              <div>AUDIO REACTIVITY: {isAudioActive ? 'PULSING (ACTIVE)' : 'STANDBY'}</div>
              <div>ACTIVE MEMBER: {activeMember.badge} ({activeMember.name})</div>
              <div>FRAME RATE: ~60 FPS DYNAMIC</div>
            </div>
          </div>

          {/* Quick Drag Hint */}
          <div className="absolute bottom-4 right-4 text-[10px] text-[#555555] bg-[#000000]/70 px-2 py-1 border border-[#262626] pointer-events-none">
            CLICK &amp; DRAG TO ORBIT // SCROLL TO INSPECT
          </div>
        </div>

        {/* Studio Controls Strip */}
        <div className="h-16 border-t border-[#262626] px-4 bg-[#0D0D0D] flex items-center justify-between shrink-0 text-xs">
          {/* Geometry Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#737373] uppercase">GEOMETRY:</span>
            <div className="flex border border-[#262626]">
              <button
                onClick={() => setGeometryMode('sphere')}
                className={`px-3 py-1.5 text-xs font-bold transition-all ${
                  geometryMode === 'sphere'
                    ? 'bg-[#FFFFFF] text-[#000000]'
                    : 'bg-[#121212] text-[#A3A3A3] hover:text-[#FFFFFF]'
                }`}
              >
                01 // GEOMETRIC SPHERE
              </button>
              <button
                onClick={() => setGeometryMode('monogram')}
                className={`px-3 py-1.5 text-xs font-bold border-l border-[#262626] transition-all ${
                  geometryMode === 'monogram'
                    ? 'bg-[#FFFFFF] text-[#000000]'
                    : 'bg-[#121212] text-[#A3A3A3] hover:text-[#FFFFFF]'
                }`}
              >
                02 // SCULPTED &apos;W&apos; MONOGRAM
              </button>
            </div>
          </div>

          {/* Rotation Speed & Audio Test */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#737373] uppercase">SPEED:</span>
              <div className="flex border border-[#262626]">
                {[0.5, 1.0, 2.0].map(s => (
                  <button
                    key={s}
                    onClick={() => setRotationSpeed(s)}
                    className={`px-2 py-1 text-[10px] font-bold border-r border-[#262626] last:border-r-0 ${
                      rotationSpeed === s 
                        ? 'bg-[#FFFFFF] text-[#000000]' 
                        : 'bg-[#121212] text-[#A3A3A3] hover:text-[#FFFFFF]'
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
              className={`px-3 py-1.5 border text-xs font-bold flex items-center gap-1.5 transition-all ${
                simulatedAudio
                  ? 'border-[#FFFFFF] bg-[#FFFFFF] text-[#000000]'
                  : 'border-[#404040] bg-[#171717] text-[#FFFFFF] hover:border-[#FFFFFF]'
              }`}
            >
              <Activity size={12} className={simulatedAudio ? 'animate-pulse' : ''} />
              <span>{simulatedAudio ? 'AUDIO: PULSING' : 'TEST AUDIO PULSE'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
