import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAudio } from '../../context/AudioContext';
import { AudioVisualizerCanvas } from '../stage/AudioVisualizerCanvas';
import { Mic, MicOff, Volume2, VolumeX, Radio, Box, Sliders } from 'lucide-react';

export const VoicePod: React.FC<{ 
  onUserClick: () => void;
  onAssistantClick?: () => void;
}> = ({ onUserClick, onAssistantClick }) => {
  const { activeMember, audioState, toggleMute, toggleStage, setActiveView } = useWorkspace();
  const { isMicOn, toggleMic, isLoopbackOn, gainPercent, setShowHardwareModal } = useAudio();

  const handleMicToggle = async () => {
    await toggleMic();
  };

  const isLive = isMicOn && !audioState.muted;

  return (
    <div className="w-full bg-[#121217] border-t border-[#242430] p-2.5 flex flex-col gap-2 shrink-0 select-none">
      {/* Active User Card with Rounded Styling */}
      <div 
        onClick={onUserClick}
        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#1E1E26] cursor-pointer border border-transparent hover:border-[#2F2F3E] transition-all"
        title="Switch or Edit Personal AI Profile"
      >
        <div className="w-9 h-9 rounded-xl bg-[#1E1E26] border border-[#2F2F3E] flex items-center justify-center text-xs font-bold text-[#FFFFFF] shrink-0 shadow-xs">
          {activeMember.badge}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[#FFFFFF] truncate tracking-tight">
            {activeMember.name}
          </div>
          <div className="text-xs text-[#8E8E9E] truncate font-medium">
            {activeMember.role}
          </div>
        </div>
        <div className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse' : audioState.muted ? 'bg-red-500 shadow-sm shadow-red-500/50' : 'bg-[#454558]'}`} 
          title={isLive ? "Transmitting Audio" : audioState.muted ? "Muted" : "Mic Standby"} 
        />
      </div>

      {/* 3D Reactive Assistant WHITE Mini Bar */}
      <div 
        onClick={onAssistantClick}
        title="Open WHITE 3D Assistant Studio"
        className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#17171D] border border-[#2B2B38] hover:border-[#454558] cursor-pointer transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#0B0B0E] border border-[#2F2F3E] group-hover:border-[#FFFFFF] flex items-center justify-center overflow-hidden">
            <Box size={13} className={isLive ? 'text-[#FFFFFF] animate-pulse' : 'text-[#8E8E9E]'} />
          </div>
          <span className="text-xs text-[#D4D4DC] group-hover:text-[#FFFFFF] font-medium">
            WHITE 3D // <span className={isLive ? 'text-emerald-400 font-semibold' : 'text-[#8E8E9E]'}>{isLive ? 'PULSING' : 'IDLE'}</span>
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-[#71717A] group-hover:text-[#A1A1AA] font-bold bg-[#121216] px-1.5 py-0.5 rounded-md border border-[#242430]">
          Studio
        </span>
      </div>

      {/* Real-Time Frequency Waveform Canvas (Flattened to 0 when muted) */}
      <div className="rounded-lg overflow-hidden border border-[#242430]">
        <AudioVisualizerCanvas mode="compact" className="w-full h-5" />
      </div>

      {/* Hardware Voice Controls with Explicit Mute & Mic States */}
      <div className="flex items-center justify-between gap-1.5 bg-[#17171D] p-1.5 rounded-xl border border-[#242430]">
        {/* Mic Toggle */}
        <button
          onClick={handleMicToggle}
          title={isMicOn ? "Microphone is Active (Click to Turn Off)" : "Microphone is Inactive (Click to Turn On)"}
          className={`flex-1 py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold border transition-all ${
            isLive
              ? 'bg-[#FFFFFF] text-[#0B0B0E] border-[#FFFFFF] shadow-xs'
              : !isMicOn
              ? 'bg-[#1E1E26] text-[#8E8E9E] border-[#2F2F3E] hover:text-[#FFFFFF] hover:border-[#454558]'
              : 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30'
          }`}
        >
          {isLive ? (
            <>
              <Mic size={14} className="text-emerald-600" />
              <span>MIC ON</span>
            </>
          ) : (
            <>
              <MicOff size={14} className={audioState.muted ? "text-red-400" : "text-[#8E8E9E]"} />
              <span className={audioState.muted ? "text-red-400" : "text-[#8E8E9E]"}>
                {audioState.muted ? 'MUTED' : 'MIC OFF'}
              </span>
            </>
          )}
        </button>

        {/* Deafen/Mute Toggle */}
        <button
          onClick={toggleMute}
          title={audioState.muted ? "Unmute Workspace Audio" : "Mute Workspace Audio"}
          className={`p-2 rounded-lg border transition-all ${
            audioState.muted
              ? 'bg-red-600 text-[#FFFFFF] border-red-600 shadow-xs'
              : 'bg-[#1E1E26] text-[#8E8E9E] border-[#2F2F3E] hover:text-[#FFFFFF] hover:border-[#454558]'
          }`}
        >
          {audioState.muted ? <VolumeX size={14} strokeWidth={2.5} /> : <Volume2 size={14} strokeWidth={2} />}
        </button>

        {/* Stage Channel Overlay */}
        <button
          onClick={() => {
            toggleStage();
            setActiveView('stage');
          }}
          title={audioState.stageActive ? "Disconnect from Stage" : "Connect to Uncompressed Studio Stage"}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
            audioState.stageActive
              ? 'bg-[#FFFFFF] text-[#0B0B0E] border-[#FFFFFF] shadow-xs'
              : 'bg-[#1E1E26] text-[#8E8E9E] border-[#2F2F3E] hover:text-[#FFFFFF] hover:border-[#454558]'
          }`}
        >
          <Radio size={13} strokeWidth={2} />
          <span>STAGE</span>
        </button>

        {/* Audio Hardware Modal Launcher */}
        <button
          onClick={() => setShowHardwareModal(true)}
          title={`Audio Hardware Settings (Gain: ${gainPercent}%, Loopback: ${isLoopbackOn ? 'ON' : 'OFF'})`}
          className="p-2 rounded-lg border border-[#2F2F3E] hover:border-[#FFFFFF] bg-[#1E1E26] text-[#8E8E9E] hover:text-[#FFFFFF] transition-all"
        >
          <Sliders size={13} />
        </button>
      </div>
    </div>
  );
};
