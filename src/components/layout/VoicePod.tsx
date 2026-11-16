import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAudio } from '../../context/AudioContext';
import { Mic, MicOff, Volume2, VolumeX, Radio, User, Box, Sliders } from 'lucide-react';

export const VoicePod: React.FC<{ 
  onUserClick: () => void;
  onAssistantClick?: () => void;
}> = ({ onUserClick, onAssistantClick }) => {
  const { activeMember, audioState, toggleMute, toggleStage, setActiveView } = useWorkspace();
  const { isMicOn, toggleMic, isLoopbackOn, gainPercent, setShowHardwareModal } = useAudio();

  const handleMicToggle = async () => {
    await toggleMic();
  };

  const isMicActive = isMicOn || audioState.micActive;

  return (
    <div className="w-full bg-[#0A0A0A] border-t border-[#262626] p-2 flex flex-col gap-2 shrink-0 select-none font-mono">
      {/* Active User Card */}
      <div 
        onClick={onUserClick}
        className="flex items-center gap-2 p-1.5 hover:bg-[#171717] cursor-pointer border border-transparent hover:border-[#262626] transition-all"
        title="Switch or Edit Personal AI Profile"
      >
        <div className="w-8 h-8 bg-[#171717] border border-[#404040] flex items-center justify-center font-mono text-xs font-bold text-[#FFFFFF] shrink-0">
          {activeMember.badge}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-[#FFFFFF] truncate tracking-tight">
            {activeMember.name}
          </div>
          <div className="text-[10px] text-[#A3A3A3] truncate font-mono">
            {activeMember.role}
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-[#FFFFFF]" title="Online" />
      </div>

      {/* 3D Reactive Assistant WHITE Mini Bar */}
      <div 
        onClick={onAssistantClick}
        title="Open WHITE 3D Assistant Studio"
        className="flex items-center justify-between px-2 py-1 bg-[#121212] border border-[#262626] hover:border-[#FFFFFF] cursor-pointer transition-all group"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#000000] border border-[#404040] group-hover:border-[#FFFFFF] flex items-center justify-center overflow-hidden">
            <Box size={11} className={isMicActive ? 'text-[#FFFFFF] animate-pulse' : 'text-[#737373]'} />
          </div>
          <span className="text-[10px] font-mono text-[#A3A3A3] group-hover:text-[#FFFFFF] font-bold">
            WHITE 3D // {isMicActive ? 'PULSING' : 'IDLE'}
          </span>
        </div>
        <span className="text-[9px] text-[#555555] group-hover:text-[#A3A3A3]">STUDIO</span>
      </div>

      {/* Hardware Voice Controls */}
      <div className="flex items-center justify-between gap-1 bg-[#121212] p-1 border border-[#262626]">
        {/* Mic Toggle */}
        <button
          onClick={handleMicToggle}
          title={isMicActive ? "Mic is ACTIVE (Click to Mute)" : "Mic is INACTIVE (Click to Enable)"}
          className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 text-[11px] font-mono border transition-all ${
            isMicActive && !audioState.muted
              ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold'
              : 'bg-[#0A0A0A] text-[#A3A3A3] border-[#262626] hover:text-[#FFFFFF] hover:border-[#404040]'
          }`}
        >
          {isMicActive && !audioState.muted ? (
            <>
              <Mic size={13} strokeWidth={2.5} />
              <span>MIC ON</span>
            </>
          ) : (
            <>
              <MicOff size={13} strokeWidth={2} />
              <span>MIC OFF</span>
            </>
          )}
        </button>

        {/* Deafen/Mute Toggle */}
        <button
          onClick={toggleMute}
          title={audioState.muted ? "Unmute Workspace Audio" : "Mute Workspace Audio"}
          className={`p-1.5 border transition-all ${
            audioState.muted
              ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
              : 'bg-[#0A0A0A] text-[#A3A3A3] border-[#262626] hover:text-[#FFFFFF]'
          }`}
        >
          {audioState.muted ? <VolumeX size={13} strokeWidth={2.5} /> : <Volume2 size={13} strokeWidth={2} />}
        </button>

        {/* Stage Channel Overlay */}
        <button
          onClick={() => {
            toggleStage();
            setActiveView('stage');
          }}
          title={audioState.stageActive ? "Disconnect from Stage" : "Connect to Uncompressed Studio Stage"}
          className={`px-2 py-1.5 border text-[11px] font-mono flex items-center gap-1 transition-all ${
            audioState.stageActive
              ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold'
              : 'bg-[#0A0A0A] text-[#A3A3A3] border-[#262626] hover:text-[#FFFFFF]'
          }`}
        >
          <Radio size={13} strokeWidth={2} />
          <span>STAGE</span>
        </button>

        {/* Audio Hardware Modal Launcher */}
        <button
          onClick={() => setShowHardwareModal(true)}
          title={`Audio Hardware Settings (Gain: ${gainPercent}%, Loopback: ${isLoopbackOn ? 'ON' : 'OFF'})`}
          className="p-1.5 border border-[#262626] hover:border-[#FFFFFF] bg-[#0A0A0A] text-[#A3A3A3] hover:text-[#FFFFFF] transition-all"
        >
          <Sliders size={13} />
        </button>
      </div>
    </div>
  );
};
