import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAudio } from '../../context/AudioContext';
import { 
  webrtcStage, 
  StagePeer, 
  StageQualityPreset, 
  STAGE_QUALITY_PRESETS 
} from '../../services/webrtcStage';
import { AudioVisualizerCanvas } from './AudioVisualizerCanvas';
import { 
  Radio, 
  Mic, 
  MicOff, 
  Video,
  VideoOff,
  Monitor, 
  MonitorOff, 
  PhoneOff, 
  Sliders, 
  Users, 
  Settings,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Maximize2,
  Share2,
  Check,
  Copy,
  Key
} from 'lucide-react';

export const StageView: React.FC = () => {
  const { activeSpace, activeMember, members, setActiveView, audioState, toggleMute } = useWorkspace();
  const { isMicOn, toggleMic, gainPercent, setShowHardwareModal } = useAudio();

  const [peers, setPeers] = useState<StagePeer[]>([]);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [qualityPreset, setQualityPresetState] = useState<StageQualityPreset>('1080p');
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string>(activeMember.id);
  const [isCopiedToken, setIsCopiedToken] = useState<boolean>(false);

  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);

  // Call duration counter
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Subscribe to WebRTC Stage events
  useEffect(() => {
    webrtcStage.connect(activeMember.id, activeSpace.id);

    const unsubscribe = webrtcStage.subscribe((newPeers, sStream, cStream) => {
      setPeers(newPeers);
      setScreenStream(sStream);
      setCameraStream(cStream);
    });

    return () => {
      unsubscribe();
    };
  }, [activeMember.id, activeSpace.id]);

  // Bind screen stream to video element
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  // Bind camera stream to video element
  useEffect(() => {
    if (cameraVideoRef.current && cameraStream) {
      cameraVideoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const handleToggleScreenShare = async () => {
    if (screenStream) {
      webrtcStage.stopScreenShare();
    } else {
      await webrtcStage.startScreenShare(qualityPreset);
    }
  };

  const handleToggleCamera = async () => {
    if (cameraStream) {
      webrtcStage.stopCamera();
    } else {
      await webrtcStage.startCamera(qualityPreset);
    }
  };

  const handleSelectQuality = async (preset: StageQualityPreset) => {
    setQualityPresetState(preset);
    await webrtcStage.setQualityPreset(preset);
    setShowQualityMenu(false);
  };

  const handleDisconnect = () => {
    webrtcStage.disconnect();
    setActiveView('editor');
  };

  const isLive = isMicOn && !audioState.muted;
  const currentQualityConfig = STAGE_QUALITY_PRESETS[qualityPreset];
  const otherMembers = members.filter(m => m.id !== activeMember.id);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0B0F] text-[#FFFFFF] select-none overflow-hidden relative">
      {/* 1. Discord-Style Top Stage Bar */}
      <div className="h-12 bg-[#121217] border-b border-[#242430] px-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-emerald-400 animate-pulse" />
            <span className="text-sm font-display font-bold tracking-tight text-[#FFFFFF]">
              {activeSpace.name} // Stage
            </span>
          </div>
          <span className="bg-[#1E1E26] border border-[#2F2F3E] text-xs font-mono font-bold px-2.5 py-0.5 rounded-full text-[#D4D4DC]">
            {members.length} in stage
          </span>
          <span className="text-xs text-[#8E8E9E] font-mono font-semibold">
            {formatCallTime(callDuration)}
          </span>
        </div>

        {/* Studio Specs Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="bg-[#17171E] px-2.5 py-1 rounded-lg border border-[#242430] text-[#D4D4DC] font-mono font-medium text-xs">
            510 kbps Opus
          </span>
          <span className="bg-[#17171E] px-2.5 py-1 rounded-lg border border-[#242430] text-emerald-400 font-mono font-bold text-xs">
            {currentQualityConfig.label} ({currentQualityConfig.fps}fps)
          </span>
        </div>
      </div>

      {/* 2. Main Video / Voice Grid Stage */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center relative custom-scrollbar">
        {/* If Screen Share is Active, Show Large Theater Display */}
        {screenStream ? (
          <div className="w-full max-w-5xl h-[55vh] bg-[#121217] rounded-3xl border border-[#2F2F3E] relative overflow-hidden flex flex-col mb-4 shadow-2xl">
            <div className="h-9 bg-[#17171E] border-b border-[#242430] px-4 flex items-center justify-between text-xs text-[#D4D4DC] shrink-0">
              <div className="flex items-center gap-2 font-semibold">
                <Monitor size={14} className="text-emerald-400" />
                <span>Screen // {currentQualityConfig.label}</span>
              </div>
              <button
                onClick={handleToggleScreenShare}
                className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                Stop
              </button>
            </div>
            <div className="flex-1 relative bg-[#000000] flex items-center justify-center">
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ) : null}

        {/* Video & Voice Participant Cards (All 4 Core Team Members) */}
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-20">
          {/* User's Local Tile */}
          <div 
            className={`h-64 sm:h-72 rounded-3xl bg-gradient-to-b from-[#1E1E26] to-[#121217] border relative overflow-hidden flex flex-col items-center justify-center transition-all shadow-xl ${
              isLive ? 'border-emerald-500/80 ring-4 ring-emerald-500/20' : 'border-[#2F2F3E]'
            }`}
          >
            {cameraStream ? (
              <video
                ref={cameraVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3">
                <div className={`w-20 h-20 rounded-full bg-[#181822] border-2 flex items-center justify-center text-xl font-mono font-bold text-[#FFFFFF] shadow-2xl transition-all ${
                  isLive ? 'border-emerald-400 scale-105' : 'border-[#333344]'
                }`}>
                  {activeMember.badge}
                </div>
                <div className="text-center">
                  <div className="text-sm font-display font-bold text-[#FFFFFF] tracking-tight">{activeMember.name}</div>
                </div>
              </div>
            )}

            {/* Speaking / Audio Waves bar at bottom of card */}
            <div className="absolute bottom-12 left-4 right-4 z-10">
              <AudioVisualizerCanvas mode="compact" className="w-full h-4 rounded-md" />
            </div>

            {/* User Name Tag Badge */}
            <div className="absolute bottom-3 left-3 bg-[#0B0B0E]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#2F2F3E] flex items-center gap-2 text-xs font-sans font-semibold text-[#FFFFFF] z-10">
              {isLive ? (
                <Mic size={12} className="text-emerald-400" />
              ) : (
                <MicOff size={12} className="text-red-400" />
              )}
              <span>{activeMember.name} (You)</span>
              {cameraStream && (
                <span className="text-[10px] bg-[#22C55E]/20 text-emerald-300 px-1.5 py-0.2 rounded-md font-mono font-bold">
                  {qualityPreset.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Remote Team Members (Arnav Suryavanshi, Lakshay Arora, Shiwant Goyal) */}
          {otherMembers.map(member => {
            const peer = peers.find(p => p.id === member.id || p.name === member.name);
            const isPeerActive = peer ? peer.isAudioActive : false;

            return (
              <div 
                key={member.id}
                className={`h-64 sm:h-72 rounded-3xl bg-gradient-to-b from-[#1C1C24] to-[#121217] border relative overflow-hidden flex flex-col items-center justify-center shadow-xl transition-all ${
                  isPeerActive ? 'border-emerald-500/80 ring-4 ring-emerald-500/20' : 'border-[#2F2F3E]'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className={`w-20 h-20 rounded-full bg-[#181822] border-2 flex items-center justify-center text-xl font-mono font-bold text-[#FFFFFF] shadow-2xl transition-all ${
                    isPeerActive ? 'border-emerald-400 scale-105' : 'border-[#333344]'
                  }`}>
                    {member.badge}
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-display font-bold text-[#FFFFFF] tracking-tight">
                      {member.name}
                    </div>
                  </div>
                </div>

                {/* Bottom Status Badge - Real Standby/Mute State */}
                <div className="absolute bottom-3 left-3 bg-[#0B0B0E]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#2F2F3E] flex items-center gap-2 text-xs font-sans font-semibold text-[#8E8E9E]">
                  {isPeerActive ? (
                    <Mic size={12} className="text-emerald-400" />
                  ) : (
                    <MicOff size={12} className="text-red-400" />
                  )}
                  <span className={isPeerActive ? 'text-white' : 'text-[#8E8E9E]'}>
                    {member.name.split(' ')[0]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Floating Discord-Style Rounded Dock (Image 3 inspired) */}
      <div className="absolute bottom-5 inset-x-0 flex justify-center z-30 pointer-events-none px-4">
        <div className="bg-[#161620]/95 backdrop-blur-xl border border-[#2F2F3E] rounded-full p-2 sm:px-4 sm:py-2.5 shadow-2xl flex items-center gap-2 sm:gap-3 pointer-events-auto">
          {/* Microphone Toggle Button */}
          <button
            onClick={toggleMic}
            className={`p-3 rounded-full flex items-center justify-center transition-all ${
              isLive
                ? 'bg-[#2A2A38] text-[#FFFFFF] hover:bg-[#343444]'
                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 ring-1 ring-red-500/40'
            }`}
            title={isLive ? "Mute Microphone" : "Unmute Microphone"}
          >
            {isLive ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* Camera Toggle Button (Turn On/Off Camera) */}
          <button
            onClick={handleToggleCamera}
            className={`p-3 rounded-full flex items-center justify-center transition-all ${
              cameraStream
                ? 'bg-[#2A2A38] text-[#FFFFFF] hover:bg-[#343444]'
                : 'bg-[#242432] text-[#8E8E9E] hover:text-[#FFFFFF] hover:bg-[#2F2F3E]'
            }`}
            title={cameraStream ? "Turn Off Camera" : "Turn On Camera"}
          >
            {cameraStream ? <Video size={20} className="text-emerald-400" /> : <VideoOff size={20} />}
          </button>

          {/* Screen Share Button */}
          <button
            onClick={handleToggleScreenShare}
            className={`p-3 rounded-full flex items-center justify-center transition-all ${
              screenStream
                ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md'
                : 'bg-[#242432] text-[#8E8E9E] hover:text-[#FFFFFF] hover:bg-[#2F2F3E]'
            }`}
            title={screenStream ? "Stop Sharing Screen" : "Share Screen"}
          >
            {screenStream ? <MonitorOff size={20} /> : <Monitor size={20} />}
          </button>

          {/* Quality Preset Selector Dropdown (240p to 2K) */}
          <div className="relative">
            <button
              onClick={() => setShowQualityMenu(!showQualityMenu)}
              className="px-3.5 py-2 rounded-full bg-[#242432] hover:bg-[#2F2F3E] text-[#D4D4DC] hover:text-[#FFFFFF] flex items-center gap-1.5 text-xs font-mono font-bold border border-[#333344] transition-all"
              title="Select Video Stream Quality (240p - 2K)"
            >
              <span>{currentQualityConfig.label}</span>
              <ChevronDown size={14} className={showQualityMenu ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>

            {/* Quality Popup Menu */}
            {showQualityMenu && (
              <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 bg-[#181822] border border-[#2F2F3E] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 backdrop-blur-xl">
                <div className="px-3 py-1.5 text-[11px] font-display font-bold text-[#8E8E9E] uppercase tracking-wider border-b border-[#242430]">
                  Stream Resolution
                </div>
                {(Object.keys(STAGE_QUALITY_PRESETS) as StageQualityPreset[]).map(key => {
                  const cfg = STAGE_QUALITY_PRESETS[key];
                  const isSelected = qualityPreset === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectQuality(key)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-[#FFFFFF] text-[#0B0B0E] font-bold'
                          : 'text-[#D4D4DC] hover:bg-[#242432] hover:text-[#FFFFFF]'
                      }`}
                    >
                      <div>
                        <div className="font-mono font-bold text-xs">{cfg.label} ({cfg.fps}fps)</div>
                        <div className={`text-[11px] font-sans ${isSelected ? 'text-[#333333]' : 'text-[#8E8E9E]'}`}>
                          {cfg.description}
                        </div>
                      </div>
                      {isSelected && <Check size={14} className="text-[#0B0B0E]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Invite to Voice / Members */}
          <button
            onClick={() => setShowInviteModal(true)}
            className="p-3 rounded-full bg-[#242432] text-[#8E8E9E] hover:text-[#FFFFFF] hover:bg-[#2F2F3E] transition-all"
            title="Invite to Voice & Share Stage"
          >
            <Users size={18} />
          </button>

          {/* Equalizer / Audio Settings */}
          <button
            onClick={() => setShowHardwareModal(true)}
            className="p-3 rounded-full bg-[#242432] text-[#8E8E9E] hover:text-[#FFFFFF] hover:bg-[#2F2F3E] transition-all"
            title="Audio Hardware & Equalizer Settings"
          >
            <Sliders size={18} />
          </button>

          {/* Red Disconnect Button */}
          <button
            onClick={handleDisconnect}
            className="p-3 rounded-full bg-red-600 hover:bg-red-500 text-[#FFFFFF] shadow-lg shadow-red-600/30 transition-all cursor-pointer ml-1"
            title="Disconnect / Leave Stage"
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>

      {/* Invite & Pairing Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-[#161620] border border-[#2F2F3E] rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#242430]">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-emerald-400" />
                <span className="text-base font-bold text-[#FFFFFF]">Invite to Voice Stage</span>
              </div>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="text-[#8E8E9E] hover:text-[#FFFFFF] p-1 rounded-lg hover:bg-[#242432] transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#D4D4DC] leading-relaxed">
              Anyone with this link or in your active workspace space <strong className="text-white">({activeSpace.name})</strong> can join this ultra-low latency 510kbps stage.
            </p>

            <div className="flex items-center gap-2 bg-[#101017] p-2.5 rounded-xl border border-[#2F2F3E]">
              <span className="text-xs font-mono text-[#8E8E9E] truncate flex-1">
                {window.location.origin}/#stage/{activeSpace.slug}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/#stage/${activeSpace.slug}`);
                  setIsCopiedToken(true);
                  setTimeout(() => setIsCopiedToken(false), 2000);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] text-[#0B0B0E] text-xs font-bold hover:bg-[#E4E4E7] transition-all flex items-center gap-1.5"
              >
                {isCopiedToken ? <Check size={13} /> : <Copy size={13} />}
                <span>{isCopiedToken ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 rounded-xl bg-[#242432] hover:bg-[#2F2F3E] text-xs font-semibold text-[#FFFFFF] transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
