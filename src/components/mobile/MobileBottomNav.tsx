import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAudio } from '../../context/AudioContext';
import { Bot, Radio, Mic, MicOff, Settings2 } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenAudioSettings: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenAudioSettings }) => {
  const { activeView, setActiveView, audioState, toggleMute, toggleStage } = useWorkspace();

  const isBotActive = activeView !== 'stage';
  const isStageActive = activeView === 'stage';

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-[#262626] flex items-center justify-around px-4 z-30 select-none pb-[env(safe-area-inset-bottom)]">
      {/* 1. AI Bot View Tab */}
      <button
        onClick={() => setActiveView('copilot')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all active:scale-95 ${
          isBotActive ? 'text-[#FFFFFF]' : 'text-[#666666] hover:text-[#A3A3A3]'
        }`}
      >
        <div className="relative">
          <Bot size={20} />
          {isBotActive && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#FFFFFF]" />
          )}
        </div>
        <span className="text-[10px] font-mono font-bold tracking-wider mt-1">
          AI BOT
        </span>
      </button>

      {/* 2. Center Quick Voice Pod / Mic Mute */}
      <div className="flex items-center justify-center px-2">
        <button
          onClick={toggleMute}
          onContextMenu={(e) => {
            e.preventDefault();
            onOpenAudioSettings();
          }}
          title={audioState.muted ? "Unmute Microphone" : "Mute Microphone"}
          className={`w-11 h-11 rounded-none flex items-center justify-center border transition-all active:scale-90 ${
            audioState.muted 
              ? 'bg-[#171717] text-[#737373] border-[#333333]' 
              : 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] shadow-sm'
          }`}
        >
          {audioState.muted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
      </div>

      {/* 3. Studio WebRTC Stage Tab */}
      <button
        onClick={() => setActiveView('stage')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all active:scale-95 ${
          isStageActive ? 'text-[#FFFFFF]' : 'text-[#666666] hover:text-[#A3A3A3]'
        }`}
      >
        <div className="relative">
          <Radio size={20} className={audioState.stageActive ? 'animate-pulse text-[#FFFFFF]' : ''} />
          {isStageActive && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#FFFFFF]" />
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[10px] font-mono font-bold tracking-wider">
            STAGE
          </span>
          {audioState.stageActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] animate-ping" />
          )}
        </div>
      </button>
    </nav>
  );
};
