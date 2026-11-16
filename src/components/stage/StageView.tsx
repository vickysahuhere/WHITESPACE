import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAudio } from '../../context/AudioContext';
import { webrtcStage, StagePeer } from '../../services/webrtcStage';
import { AudioVisualizerCanvas } from './AudioVisualizerCanvas';
import { 
  Radio, 
  Mic, 
  MicOff, 
  Monitor, 
  MonitorOff, 
  PhoneOff, 
  Sliders, 
  Key, 
  Copy, 
  Check, 
  X, 
  Volume2, 
  ShieldCheck,
  Maximize2
} from 'lucide-react';

export const StageView: React.FC = () => {
  const { activeSpace, activeMember, setActiveView } = useWorkspace();
  const { isMicOn, toggleMic, gainPercent, setShowHardwareModal } = useAudio();

  const [peers, setPeers] = useState<StagePeer[]>([]);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);
  const [offerToken, setOfferToken] = useState<string>('');
  const [answerInput, setAnswerInput] = useState<string>('');
  const [copiedToken, setCopiedToken] = useState<boolean>(false);
  const [tokenStatus, setTokenStatus] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Subscribe to WebRTC Stage events
  useEffect(() => {
    webrtcStage.connect(activeMember.id, activeSpace.id);

    const unsubscribe = webrtcStage.subscribe((newPeers, stream) => {
      setPeers(newPeers);
      setScreenStream(stream);
    });

    return () => {
      unsubscribe();
    };
  }, [activeMember.id, activeSpace.id]);

  // Bind video element to screen stream
  useEffect(() => {
    if (videoRef.current && screenStream) {
      videoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  const handleToggleScreenShare = async () => {
    if (screenStream) {
      webrtcStage.stopScreenShare();
    } else {
      await webrtcStage.startScreenShare();
    }
  };

  const handleDisconnect = () => {
    webrtcStage.disconnect();
    setActiveView('editor');
  };

  const handleGenerateOffer = async () => {
    try {
      const token = await webrtcStage.createOfferToken();
      setOfferToken(token);
      setTokenStatus('OFFER TOKEN GENERATED (510 KBPS OPUS + 4K60 VIDEO)');
    } catch (e: any) {
      setTokenStatus(`ERROR: ${e.message}`);
    }
  };

  const handleApplyAnswer = async () => {
    if (!answerInput.trim()) return;
    try {
      await webrtcStage.applyToken(answerInput);
      setTokenStatus('REMOTE SDP TOKEN APPLIED SUCCESSFULLY');
      setAnswerInput('');
    } catch (e: any) {
      setTokenStatus(`ERROR: ${e.message}`);
    }
  };

  const handleCopyToken = () => {
    if (offerToken) {
      navigator.clipboard.writeText(offerToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505] text-[#FFFFFF] font-mono select-none overflow-hidden relative">
      {/* 1. Top Stage Banner */}
      <div className="h-11 bg-[#0C0C0C] border-b border-[#262626] px-4 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#FFFFFF] rounded-full animate-pulse" />
          <span className="text-xs font-bold tracking-wider text-[#FFFFFF] uppercase">
            STUDIO STAGE // {activeSpace.name.toUpperCase()}
          </span>
          <span className="text-[10px] bg-[#171717] border border-[#333333] px-1.5 py-0.2 text-[#A3A3A3]">
            {peers.length} ACTIVE MEMBERS
          </span>
        </div>

        {/* High-Fidelity Audio & Video Pipeline Metrics */}
        <div className="hidden lg:flex items-center gap-2 text-[10px] text-[#737373]">
          <span className="bg-[#121212] px-2 py-0.5 border border-[#202020] text-[#A3A3A3]">
            AUDIO: 48 KHZ @ 510 KBPS OPUS
          </span>
          <span className="bg-[#121212] px-2 py-0.5 border border-[#202020] text-[#A3A3A3]">
            VIDEO: 4K60 (b=AS:25000)
          </span>
          <span className="bg-[#121212] px-2 py-0.5 border border-[#202020] text-[#FFFFFF]">
            SIGNALING: BROADCAST CHANNEL
          </span>
        </div>
      </div>

      {/* 2. Main Stage Stage Content Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Screen Share Display Tile (if active) */}
        {screenStream && (
          <div className="w-full h-80 sm:h-96 bg-[#000000] border border-[#404040] relative overflow-hidden flex flex-col">
            <div className="h-7 bg-[#0E0E0E] border-b border-[#262626] px-3 flex items-center justify-between text-[10px] text-[#A3A3A3] shrink-0">
              <div className="flex items-center gap-2 font-bold text-[#FFFFFF]">
                <Monitor size={12} />
                <span>4K 60FPS CODE PRESENTATION STREAM // 25 MBPS</span>
              </div>
              <button
                onClick={handleToggleScreenShare}
                className="hover:text-[#FFFFFF] underline"
              >
                STOP PRESENTING
              </button>
            </div>
            <div className="flex-1 relative bg-[#000000] flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Participant Mesh Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {peers.map(peer => {
            const isSelf = peer.id === activeMember.id;
            const micLive = isSelf ? isMicOn : peer.isAudioActive;

            return (
              <div
                key={peer.id}
                className={`bg-[#0A0A0A] border p-4 flex flex-col justify-between transition-all ${
                  micLive
                    ? 'border-[#FFFFFF] shadow-lg'
                    : 'border-[#262626]'
                }`}
              >
                <div>
                  {/* Top Peer Info */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A] mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 bg-[#171717] border border-[#404040] text-xs font-bold text-[#FFFFFF] flex items-center justify-center">
                        {peer.badge}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#FFFFFF] leading-tight">
                          {peer.name}
                        </div>
                        <div className="text-[10px] text-[#737373]">
                          {peer.role}
                        </div>
                      </div>
                    </div>

                    <span className={`px-1.5 py-0.2 text-[9px] font-bold border ${
                      micLive
                        ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                        : 'bg-[#121212] text-[#555555] border-[#262626]'
                    }`}>
                      {micLive ? 'TRANSMITTING' : 'MUTED'}
                    </span>
                  </div>

                  {/* Micro Visualizer */}
                  <div className="mb-2">
                    <AudioVisualizerCanvas mode="compact" className="w-full h-5" />
                  </div>
                </div>

                {/* Footnote details */}
                <div className="flex items-center justify-between pt-2 border-t border-[#171717] text-[9px] text-[#555555]">
                  <span>CODEC: OPUS 510K STEREO</span>
                  <span>GAIN: {isSelf ? `${gainPercent}%` : '100%'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

        {/* 3. Stage Action Toolbar */}
        <div className="h-14 bg-[#0A0A0A] border-t border-[#262626] px-4 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          {/* Mic Toggle */}
          <button
            onClick={toggleMic}
            className={`px-3 py-1.5 text-xs font-bold border flex items-center gap-1.5 transition-colors ${
              isMicOn
                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                : 'bg-[#121212] text-[#A3A3A3] border-[#262626] hover:text-[#FFFFFF]'
            }`}
          >
            {isMicOn ? <Mic size={13} /> : <MicOff size={13} />}
            <span>{isMicOn ? 'MIC ON (510k)' : 'MIC MUTED'}</span>
          </button>

          {/* Screen Share */}
          <button
            onClick={handleToggleScreenShare}
            className={`px-3 py-1.5 text-xs font-bold border flex items-center gap-1.5 transition-colors ${
              screenStream
                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                : 'bg-[#121212] text-[#A3A3A3] border-[#262626] hover:text-[#FFFFFF]'
            }`}
          >
            {screenStream ? <MonitorOff size={13} /> : <Monitor size={13} />}
            <span>{screenStream ? 'STOP SHARING' : 'SHARE SCREEN (4K60)'}</span>
          </button>

          {/* Audio Hardware Modal Launcher */}
          <button
            onClick={() => setShowHardwareModal(true)}
            title="Audio Hardware Calibration"
            className="px-2.5 py-1.5 bg-[#121212] hover:bg-[#1C1C1C] text-[#A3A3A3] hover:text-[#FFFFFF] border border-[#262626] text-xs flex items-center gap-1.5"
          >
            <Sliders size={13} />
            <span className="hidden sm:inline">CALIBRATION</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Manual SDP Token Modal Toggle */}
          <button
            onClick={() => setShowTokenModal(true)}
            className="px-3 py-1.5 bg-[#121212] hover:bg-[#1C1C1C] text-[#A3A3A3] hover:text-[#FFFFFF] border border-[#262626] text-xs flex items-center gap-1.5"
          >
            <Key size={13} />
            <span>SDP TOKENS</span>
          </button>

          {/* Disconnect */}
          <button
            onClick={handleDisconnect}
            className="px-4 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#CCCCCC] flex items-center gap-1.5"
          >
            <PhoneOff size={13} />
            <span>DISCONNECT</span>
          </button>
        </div>
      </div>

      {/* 4. Manual SDP Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-mono select-none">
          <div className="w-full max-w-xl bg-[#0C0C0C] border border-[#404040] p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <Key size={15} className="text-[#FFFFFF]" />
                <span className="text-xs font-bold tracking-wider text-[#FFFFFF] uppercase">
                  MANUAL WEBRTC SDP TOKENS // CROSS-MACHINE PAIRING
                </span>
              </div>
              <button onClick={() => setShowTokenModal(false)} className="text-[#A3A3A3] hover:text-[#FFFFFF]">
                <X size={15} />
              </button>
            </div>

            <p className="text-[11px] text-[#A3A3A3] leading-relaxed">
              Generate an SDP Offer token containing mutated 510 kbps Opus & 4K60 video parameters, or paste a remote Answer token to connect peers across different networks.
            </p>

            {/* Offer Generation */}
            <div className="space-y-2 bg-[#080808] border border-[#202020] p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFFFFF]">STEP 1: GENERATE OFFER TOKEN</span>
                <button
                  onClick={handleGenerateOffer}
                  className="px-2.5 py-1 bg-[#FFFFFF] text-[#000000] text-xs font-bold border border-[#FFFFFF] hover:bg-[#CCCCCC]"
                >
                  GENERATE OFFER
                </button>
              </div>

              {offerToken && (
                <div className="relative mt-2">
                  <textarea
                    readOnly
                    value={offerToken}
                    rows={3}
                    className="w-full bg-[#000000] border border-[#262626] p-2 text-[10px] text-[#A3A3A3] outline-none resize-none font-mono"
                  />
                  <button
                    onClick={handleCopyToken}
                    className="absolute top-2 right-2 px-2 py-1 bg-[#171717] hover:bg-[#262626] text-[#FFFFFF] text-[10px] border border-[#333333] flex items-center gap-1"
                  >
                    {copiedToken ? <Check size={10} /> : <Copy size={10} />}
                    <span>{copiedToken ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Answer Application */}
            <div className="space-y-2 bg-[#080808] border border-[#202020] p-3">
              <span className="text-xs font-bold text-[#FFFFFF]">STEP 2: PASTE REMOTE ANSWER TOKEN</span>
              <textarea
                value={answerInput}
                onChange={e => setAnswerInput(e.target.value)}
                placeholder="Paste remote Base64 answer token here..."
                rows={3}
                className="w-full bg-[#000000] border border-[#262626] focus:border-[#FFFFFF] p-2 text-[10px] text-[#FFFFFF] outline-none resize-none font-mono"
              />
              <button
                onClick={handleApplyAnswer}
                className="px-3 py-1 bg-[#171717] hover:bg-[#262626] text-[#FFFFFF] text-xs font-bold border border-[#333333] hover:border-[#FFFFFF]"
              >
                APPLY REMOTE TOKEN
              </button>
            </div>

            {tokenStatus && (
              <div className="p-2 bg-[#121212] border border-[#262626] text-[10px] text-[#A3A3A3]">
                {tokenStatus}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-[#262626]">
              <button
                onClick={() => setShowTokenModal(false)}
                className="px-4 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#CCCCCC]"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
