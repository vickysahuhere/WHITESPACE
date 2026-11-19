import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { WorkspaceView } from '../../types';
import { 
  X, 
  HelpCircle, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  FileText, 
  Kanban, 
  Globe, 
  Radio, 
  Bot, 
  Sparkles, 
  Search,
  Video,
  Monitor,
  Mic,
  MicOff,
  Sliders,
  Layers,
  Key,
  ShieldCheck,
  Check
} from 'lucide-react';

interface AppGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GuideSection = 'QUICK_START' | 'CALLING' | 'AI_COPILOT' | 'DOCUMENTS' | 'KANBAN' | 'SHORTCUTS';

export const AppGuideModal: React.FC<AppGuideModalProps> = ({ isOpen, onClose }) => {
  const { setActiveView, activeSpace } = useWorkspace();
  const [activeSection, setActiveSection] = useState<GuideSection>('QUICK_START');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const navigateToView = (view: WorkspaceView) => {
    setActiveView(view);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0B0B0E]/85 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6 animate-fade-in">
      <div className="w-full max-w-4xl bg-[#14141C] border border-[#2F2F3E] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-[#FFFFFF]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#242430] flex items-center justify-between bg-[#171722] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#20202E] border border-[#333346] flex items-center justify-center text-emerald-400">
              <BookOpen size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-display font-bold text-[#FFFFFF] tracking-tight">
                White Collars // User Guide & Documentation
              </h2>
              <p className="text-xs font-sans text-[#8E8E9E]">
                Clear, step-by-step guidance for voice calls, video sharing, AI assistance, and knowledge management.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1E1E28] hover:bg-[#2A2A38] text-[#8E8E9E] hover:text-[#FFFFFF] flex items-center justify-center transition-all border border-[#2F2F3E]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Layout: Sidebar + Main Content */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Navigation Sidebar */}
          <div className="w-full md:w-64 bg-[#111117] border-r border-[#242430] p-3 flex flex-col gap-1.5 shrink-0 overflow-y-auto">
            <div className="px-3 py-1.5 text-[11px] font-mono font-bold text-[#8E8E9E] uppercase tracking-wider">
              Topics
            </div>

            <button
              onClick={() => setActiveSection('QUICK_START')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold tracking-tight transition-all text-left ${
                activeSection === 'QUICK_START'
                  ? 'bg-[#1E1E2A] text-[#FFFFFF] border border-[#3A3A4E] shadow-sm'
                  : 'text-[#D4D4DC] hover:text-[#FFFFFF] hover:bg-[#171720]'
              }`}
            >
              <Sparkles size={16} className={activeSection === 'QUICK_START' ? "text-emerald-400" : "text-[#8E8E9E]"} />
              <span>1-Minute Quick Start</span>
            </button>

            <button
              onClick={() => setActiveSection('CALLING')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold tracking-tight transition-all text-left ${
                activeSection === 'CALLING'
                  ? 'bg-[#1E1E2A] text-[#FFFFFF] border border-[#3A3A4E] shadow-sm'
                  : 'text-[#D4D4DC] hover:text-[#FFFFFF] hover:bg-[#171720]'
              }`}
            >
              <Radio size={16} className={activeSection === 'CALLING' ? "text-emerald-400" : "text-[#8E8E9E]"} />
              <span>Voice & Video Calling</span>
            </button>

            <button
              onClick={() => setActiveSection('AI_COPILOT')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold tracking-tight transition-all text-left ${
                activeSection === 'AI_COPILOT'
                  ? 'bg-[#1E1E2A] text-[#FFFFFF] border border-[#3A3A4E] shadow-sm'
                  : 'text-[#D4D4DC] hover:text-[#FFFFFF] hover:bg-[#171720]'
              }`}
            >
              <Bot size={16} className={activeSection === 'AI_COPILOT' ? "text-emerald-400" : "text-[#8E8E9E]"} />
              <span>WHITE AI Assistant</span>
            </button>

            <button
              onClick={() => setActiveSection('DOCUMENTS')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold tracking-tight transition-all text-left ${
                activeSection === 'DOCUMENTS'
                  ? 'bg-[#1E1E2A] text-[#FFFFFF] border border-[#3A3A4E] shadow-sm'
                  : 'text-[#D4D4DC] hover:text-[#FFFFFF] hover:bg-[#171720]'
              }`}
            >
              <FileText size={16} className={activeSection === 'DOCUMENTS' ? "text-emerald-400" : "text-[#8E8E9E]"} />
              <span>Knowledge Docs & RAG</span>
            </button>

            <button
              onClick={() => setActiveSection('KANBAN')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold tracking-tight transition-all text-left ${
                activeSection === 'KANBAN'
                  ? 'bg-[#1E1E2A] text-[#FFFFFF] border border-[#3A3A4E] shadow-sm'
                  : 'text-[#D4D4DC] hover:text-[#FFFFFF] hover:bg-[#171720]'
              }`}
            >
              <Kanban size={16} className={activeSection === 'KANBAN' ? "text-emerald-400" : "text-[#8E8E9E]"} />
              <span>Kanban & Dispatch</span>
            </button>

            <button
              onClick={() => setActiveSection('SHORTCUTS')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold tracking-tight transition-all text-left ${
                activeSection === 'SHORTCUTS'
                  ? 'bg-[#1E1E2A] text-[#FFFFFF] border border-[#3A3A4E] shadow-sm'
                  : 'text-[#D4D4DC] hover:text-[#FFFFFF] hover:bg-[#171720]'
              }`}
            >
              <Layers size={16} className={activeSection === 'SHORTCUTS' ? "text-emerald-400" : "text-[#8E8E9E]"} />
              <span>Keyboard Shortcuts</span>
            </button>
          </div>

          {/* Section Body */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6 font-sans">
            {activeSection === 'QUICK_START' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#FFFFFF] mb-1">
                    Welcome to White Collars (WHITESPACE)
                  </h3>
                  <p className="text-sm text-[#D4D4DC] leading-relaxed">
                    WHITESPACE is an all-in-one autonomous workspace engineered for speed, privacy, and team collaboration.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#1A1A24] border border-[#2F2F3E] p-4 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center mb-2">1</span>
                      <h4 className="text-sm font-bold text-[#FFFFFF] mb-1">Switch Spaces</h4>
                      <p className="text-xs text-[#8E8E9E]">
                        Click on the left vertical rail to toggle between spaces (Core, SignBridge, Mai-Reads). Each space keeps its own notes and tasks.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#1A1A24] border border-[#2F2F3E] p-4 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center mb-2">2</span>
                      <h4 className="text-sm font-bold text-[#FFFFFF] mb-1">Voice & Video Call</h4>
                      <p className="text-xs text-[#8E8E9E]">
                        Click STAGE or the radio button to join the call. Turn on webcam, share screen with quality presets (240p to 2K), and mute with 1 click.
                      </p>
                    </div>
                    <button
                      onClick={() => navigateToView('stage')}
                      className="mt-3 text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      Try Stage Call <ArrowRight size={12} />
                    </button>
                  </div>

                  <div className="bg-[#1A1A24] border border-[#2F2F3E] p-4 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center mb-2">3</span>
                      <h4 className="text-sm font-bold text-[#FFFFFF] mb-1">AI Copilot</h4>
                      <p className="text-xs text-[#8E8E9E]">
                        Linked with Gemini API for instant answering, coding, and autonomous Kanban task execution.
                      </p>
                    </div>
                    <button
                      onClick={() => navigateToView('copilot')}
                      className="mt-3 text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      Open Copilot <ArrowRight size={12} />
                    </button>
                  </div>
                </div>

                <div className="bg-[#181822] border border-[#2F2F3E] rounded-2xl p-4">
                  <h4 className="text-sm font-bold text-[#FFFFFF] mb-2 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-400" />
                    Strict Privacy & Local Execution
                  </h4>
                  <p className="text-xs text-[#D4D4DC] leading-relaxed">
                    Documents are indexed locally using in-memory BM25 retrieval (&lt;1ms latency). Audio runs direct WebRTC peer mesh with 510kbps Opus stereo fidelity. No third-party tracking.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'CALLING' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#FFFFFF] mb-1">
                    Voice & Video Calling (Studio Stage)
                  </h3>
                  <p className="text-sm text-[#D4D4DC] leading-relaxed">
                    Discord-style calling designed for zero latency, crystal-clear 510kbps Opus stereo audio, webcam streaming, and 60fps screen sharing.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="bg-[#1A1A24] border border-[#2F2F3E] p-4 rounded-2xl flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#242432] text-emerald-400 shrink-0">
                      <Mic size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#FFFFFF]">Microphone & Mute Status</h4>
                      <p className="text-xs text-[#8E8E9E] mt-1 leading-relaxed">
                        When microphone is active, you will see a green pulsing indicator and live audio waves. When muted, a red <strong>MUTED</strong> badge appears and the audio waves <strong>flatten completely to zero</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#1A1A24] border border-[#2F2F3E] p-4 rounded-2xl flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#242432] text-emerald-400 shrink-0">
                      <Video size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#FFFFFF]">Webcam Video Calling</h4>
                      <p className="text-xs text-[#8E8E9E] mt-1 leading-relaxed">
                        Click the camera icon on the bottom dock to start or stop your webcam video. Your video tile will show an active speaker ring whenever you talk.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#1A1A24] border border-[#2F2F3E] p-4 rounded-2xl flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#242432] text-emerald-400 shrink-0">
                      <Monitor size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#FFFFFF]">Screen Sharing & Quality Presets (240p to 2K)</h4>
                      <p className="text-xs text-[#8E8E9E] mt-1 leading-relaxed">
                        Click the monitor button to present code or browser windows at up to 60fps. Choose resolution presets anytime:
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded-lg bg-[#222230] border border-[#333346] text-[11px] font-bold text-[#D4D4DC]">240p (Data Saver)</span>
                        <span className="px-2 py-0.5 rounded-lg bg-[#222230] border border-[#333346] text-[11px] font-bold text-[#D4D4DC]">360p Standard</span>
                        <span className="px-2 py-0.5 rounded-lg bg-[#222230] border border-[#333346] text-[11px] font-bold text-[#D4D4DC]">720p HD</span>
                        <span className="px-2 py-0.5 rounded-lg bg-[#222230] border border-[#333346] text-[11px] font-bold text-[#D4D4DC]">1080p Full HD</span>
                        <span className="px-2 py-0.5 rounded-lg bg-[#222230] border border-[#333346] text-[11px] font-bold text-emerald-400">2K Ultra HD (1440p)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigateToView('stage')}
                  className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] text-[#0B0B0E] font-bold text-xs hover:bg-[#E4E4E7] transition-all flex items-center gap-2"
                >
                  <Radio size={14} />
                  <span>Launch Voice & Video Stage Now</span>
                </button>
              </div>
            )}

            {activeSection === 'AI_COPILOT' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#FFFFFF] mb-1">
                    WHITE 3D Voice Assistant & Gemini AI Copilot
                  </h3>
                  <p className="text-sm text-[#D4D4DC] leading-relaxed">
                    WHITE is your 3D autonomous assistant. The rotating wireframe sphere on the top left serves as the living logo of the app.
                  </p>
                </div>

                <div className="bg-[#1A1A24] border border-[#2F2F3E] p-4 rounded-2xl space-y-3">
                  <h4 className="text-sm font-bold text-[#FFFFFF]">How It Works</h4>
                  <ul className="text-xs text-[#D4D4DC] space-y-2 list-disc list-inside leading-relaxed">
                    <li><strong>3D Assistant Logo:</strong> Click the 3D rotating monogram on the top-left rail to open the 3D Assistant Studio. When you speak, the logo pulsates to your voice!</li>
                    <li><strong>Space Persona (SOUL.MD):</strong> Each space has its own system prompt (SOUL.MD) that tells Gemini how to answer, whether it's software engineering, computer vision, or research.</li>
                    <li><strong>Pre-Configured API Key:</strong> The workspace comes linked with a verified Gemini API key supporting high-velocity reasoning models like <code>gemini-3.1-flash-lite</code> with instant failover.</li>
                  </ul>
                </div>

                <button
                  onClick={() => navigateToView('copilot')}
                  className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] text-[#0B0B0E] font-bold text-xs hover:bg-[#E4E4E7] transition-all flex items-center gap-2"
                >
                  <Bot size={14} />
                  <span>Open AI Copilot Chat</span>
                </button>
              </div>
            )}

            {activeSection === 'DOCUMENTS' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#FFFFFF] mb-1">
                    Notion 3.0 Live Markdown & File Ingestion
                  </h3>
                  <p className="text-sm text-[#D4D4DC] leading-relaxed">
                    Distraction-free knowledge base with instant slash commands and multi-format document parsing.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="bg-[#1A1A24] border border-[#2F2F3E] p-4 rounded-2xl">
                    <h4 className="text-sm font-bold text-[#FFFFFF] mb-1">1. Slash Command Menu</h4>
                    <p className="text-xs text-[#8E8E9E] leading-relaxed">
                      Type <kbd className="px-1.5 py-0.5 rounded bg-[#101018] border border-[#2F2F3E] text-[#FFFFFF] font-mono text-xs">/</kbd> on any blank line to insert Headings (H1-H3), code blocks, interactive task checkboxes, quotes, or dividers.
                    </p>
                  </div>

                  <div className="bg-[#1A1A24] border border-[#2F2F3E] p-4 rounded-2xl">
                    <h4 className="text-sm font-bold text-[#FFFFFF] mb-1">2. Uploading Files</h4>
                    <p className="text-xs text-[#8E8E9E] leading-relaxed">
                      Click the upload icon in the sidebar to import files up to 5MB. Supports 10 formats: <code>.md, .txt, .json, .csv, .py, .js, .ts, .html, .css, .yaml</code>. Uploaded documents are immediately tokenized into the local RAG engine.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigateToView('editor')}
                  className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] text-[#0B0B0E] font-bold text-xs hover:bg-[#E4E4E7] transition-all flex items-center gap-2"
                >
                  <FileText size={14} />
                  <span>Open Knowledge Docs</span>
                </button>
              </div>
            )}

            {activeSection === 'KANBAN' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#FFFFFF] mb-1">
                    OpenClaw Kanban Mission Control & Dispatch AI
                  </h3>
                  <p className="text-sm text-[#D4D4DC] leading-relaxed">
                    3-column engineering task pipeline with 1-click Dispatch to autonomous Gemini Copilot.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="bg-[#1A1A24] border border-[#2F2F3E] p-4 rounded-2xl">
                    <h4 className="text-sm font-bold text-[#FFFFFF] mb-1">Columns: Queued → Active → Shipped</h4>
                    <p className="text-xs text-[#8E8E9E] leading-relaxed">
                      Drag cards freely between columns to update status. Assign priority badges like P0 (Urgent), P1 (High), and P2 (Normal).
                    </p>
                  </div>

                  <div className="bg-[#1A1A24] border border-[#2F2F3E] p-4 rounded-2xl">
                    <h4 className="text-sm font-bold text-[#FFFFFF] mb-1">1-Click Dispatch AI Copilot</h4>
                    <p className="text-xs text-[#8E8E9E] leading-relaxed">
                      Click the <strong>DISPATCH AI</strong> button on any task card. The Copilot drawer opens on the right side and begins writing code or architectural plans to solve that task.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigateToView('kanban')}
                  className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] text-[#0B0B0E] font-bold text-xs hover:bg-[#E4E4E7] transition-all flex items-center gap-2"
                >
                  <Kanban size={14} />
                  <span>Open Kanban Pipeline</span>
                </button>
              </div>
            )}

            {activeSection === 'SHORTCUTS' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#FFFFFF] mb-1">
                    Essential Keyboard Shortcuts
                  </h3>
                  <p className="text-sm text-[#D4D4DC] leading-relaxed">
                    High-speed shortcuts designed for power users and white-collar developers.
                  </p>
                </div>

                <div className="bg-[#1A1A24] border border-[#2F2F3E] rounded-2xl overflow-hidden divide-y divide-[#242430]">
                  <div className="p-3 flex items-center justify-between text-xs">
                    <span className="text-[#FFFFFF] font-medium">Open Command Palette</span>
                    <kbd className="px-2 py-1 rounded-md bg-[#101017] border border-[#2F2F3E] text-xs font-mono text-[#D4D4DC]">Ctrl + K</kbd>
                  </div>
                  <div className="p-3 flex items-center justify-between text-xs">
                    <span className="text-[#FFFFFF] font-medium">Open User Guide / Help</span>
                    <kbd className="px-2 py-1 rounded-md bg-[#101017] border border-[#2F2F3E] text-xs font-mono text-[#D4D4DC]">F1 or Ctrl + H</kbd>
                  </div>
                  <div className="p-3 flex items-center justify-between text-xs">
                    <span className="text-[#FFFFFF] font-medium">Slash Commands (in Editor)</span>
                    <kbd className="px-2 py-1 rounded-md bg-[#101017] border border-[#2F2F3E] text-xs font-mono text-[#D4D4DC]">/</kbd>
                  </div>
                  <div className="p-3 flex items-center justify-between text-xs">
                    <span className="text-[#FFFFFF] font-medium">Toggle Voice Stage</span>
                    <kbd className="px-2 py-1 rounded-md bg-[#101017] border border-[#2F2F3E] text-xs font-mono text-[#D4D4DC]">Click [STAGE]</kbd>
                  </div>
                  <div className="p-3 flex items-center justify-between text-xs">
                    <span className="text-[#FFFFFF] font-medium">Inspect Local RAG Index</span>
                    <kbd className="px-2 py-1 rounded-md bg-[#101017] border border-[#2F2F3E] text-xs font-mono text-[#D4D4DC]">Click [RAG] in TopBar</kbd>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
