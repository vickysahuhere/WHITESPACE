import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { DiscordRail } from './DiscordRail';
import { NotionSidebar } from './NotionSidebar';
import { TopBar } from './TopBar';
import { CommandPalette } from '../common/CommandPalette';
import { SpaceManagerModal } from '../spaces/SpaceManagerModal';
import { NotionEditor } from '../editor/NotionEditor';
import { RAGInspectorModal } from '../rag/RAGInspectorModal';
import { MemberManagerModal } from '../members/MemberManagerModal';
import { ChatView } from '../chat/ChatView';
import { AssistantModal } from '../assistant/AssistantModal';
import { BrowserView } from '../browser/BrowserView';
import { StageView } from '../stage/StageView';
import { KanbanView } from '../kanban/KanbanView';
import { AudioHardwareModal } from '../stage/AudioHardwareModal';
import { ModelDiscoveryModal } from '../common/ModelDiscoveryModal';
import { CloudSyncModal } from '../common/CloudSyncModal';
import { WorkspaceExportModal } from '../common/WorkspaceExportModal';
import { AppGuideModal } from '../guide/AppGuideModal';
import { MobileLayout } from '../mobile/MobileLayout';
import { useIsMobile } from '../../hooks/useIsMobile';
import { CopilotDrawer } from './CopilotDrawer';
import { useAudio } from '../../context/AudioContext';
import { Task } from '../../types';
import { X, Sparkles, UserPlus, Plus } from 'lucide-react';

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { 
    spaces, 
    activeSpace, 
    addSpace, 
    updateSpace,
    members, 
    activeMember, 
    setActiveMemberId, 
    addMember, 
    activeView,
    setCommandPaletteOpen,
    guideModalOpen,
    setGuideModalOpen
  } = useWorkspace();

  // Modals
  const [showSpaceManagerModal, setShowSpaceManagerModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showSoulModal, setShowSoulModal] = useState(false);
  const [showAssistantModal, setShowAssistantModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showCloudSyncModal, setShowCloudSyncModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copilotDrawerOpen, setCopilotDrawerOpen] = useState(false);
  const [dispatchedTask, setDispatchedTask] = useState<Task | null>(null);
  const { showHardwareModal, setShowHardwareModal } = useAudio();

  // Editable SOUL.MD
  const [soulContent, setSoulContent] = useState(activeSpace.soulMd);

  const isMobile = useIsMobile(768);

  const handleSaveSoul = () => {
    updateSpace(activeSpace.id, { soulMd: soulContent });
    setShowSoulModal(false);
  };

  if (isMobile) {
    return <MobileLayout />;
  }

  return (
    <div className="flex h-screen w-screen bg-[#0B0B0E] text-[#FFFFFF] overflow-hidden select-none">
      {/* 1. Far-Left Vertical Discord Rail */}
      <DiscordRail onAddSpaceClick={() => setShowSpaceManagerModal(true)} />

      {/* 2. Notion Navigation Sidebar */}
      <NotionSidebar 
        onUserClick={() => setShowMemberModal(true)} 
        onSoulClick={() => {
          setSoulContent(activeSpace.soulMd);
          setShowSoulModal(true);
        }} 
        onManageSpaces={() => setShowSpaceManagerModal(true)}
        onAssistantClick={() => setShowAssistantModal(true)}
      />

      {/* 3. Main Stage Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0B0B0E] overflow-hidden">
        {/* TopBar with instant Gemini API Key wiring */}
        <TopBar 
          onUserClick={() => setShowMemberModal(true)} 
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onToggleCopilotDrawer={() => setCopilotDrawerOpen(!copilotDrawerOpen)}
          isCopilotDrawerOpen={copilotDrawerOpen}
          onOpenModelDiscovery={() => setShowModelModal(true)}
          onOpenCloudSync={() => setShowCloudSyncModal(true)}
          onOpenExport={() => setShowExportModal(true)}
        />

        {/* Viewport Content Host */}
        <main className="flex-1 overflow-auto bg-[#0B0B0E] p-3 sm:p-4">
          {children || (
            activeView === 'editor' ? (
              <NotionEditor />
            ) : activeView === 'copilot' ? (
              <ChatView />
            ) : activeView === 'browser' ? (
              <BrowserView />
            ) : activeView === 'stage' ? (
              <StageView />
            ) : activeView === 'kanban' ? (
              <KanbanView 
                onDispatchTask={(task) => {
                  setDispatchedTask(task);
                  setCopilotDrawerOpen(true);
                }}
              />
            ) : (
              <div className="h-full rounded-2xl border border-[#242430] bg-[#121217] p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#242430] mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="border border-[#3A3A4C] bg-[#1E1E26] px-2.5 py-1 rounded-lg text-xs font-bold text-[#FFFFFF]">
                        {activeSpace.badge}
                      </span>
                      <h1 className="text-base font-bold text-[#FFFFFF] tracking-tight">
                        {activeSpace.name} // {String(activeView).toUpperCase()}
                      </h1>
                    </div>
                    <span className="text-xs text-[#8E8E9E]">ACTIVE MEMBER: {activeMember.name}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="rounded-2xl border border-[#242430] bg-[#171720] p-5">
                      <div className="text-xs text-emerald-400 font-bold mb-1">PARADIGM 1 // DISCORD</div>
                      <div className="text-sm font-bold text-[#FFFFFF] mb-2">Space Rail & Audio Pod</div>
                      <p className="text-xs text-[#8E8E9E] leading-relaxed">
                        Instant space switching, uncompressed 510 kbps WebRTC studio stage calling, and persistent hardware mic/mute pod.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#242430] bg-[#171720] p-5">
                      <div className="text-xs text-emerald-400 font-bold mb-1">PARADIGM 2 // NOTION 3.0</div>
                      <div className="text-sm font-bold text-[#FFFFFF] mb-2">Knowledge Base & Live Editor</div>
                      <p className="text-xs text-[#8E8E9E] leading-relaxed">
                        Distraction-free slash-command Markdown editor with multi-format file ingestion and per-space SOUL.MD prompts.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#242430] bg-[#171720] p-5">
                      <div className="text-[11px] text-[#A1A1AA] font-bold mb-1">PARADIGM 3 // OPENCLAW</div>
                      <div className="text-xs font-bold text-[#FFFFFF] mb-2">Kanban & AI Copilot</div>
                      <p className="text-[11px] text-[#71717A] leading-relaxed">
                        3-column engineering task pipeline with 1-click Dispatch AI execution grounded in sub-millisecond local RAG.
                      </p>
                    </div>
                  </div>

                  <div className="border border-[#1F1F1F] bg-[#111111] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#FFFFFF]">SPACE SYSTEM PROMPT (SOUL.MD)</span>
                      <span className="text-[10px] text-[#71717A]">INJECTED INTO GEMINI QUERIES</span>
                    </div>
                    <pre className="text-xs text-[#A1A1AA] font-mono whitespace-pre-wrap bg-[#000000] p-3 border border-[#1F1F1F] max-h-48 overflow-y-auto custom-scrollbar">
                      {activeSpace.soulMd}
                    </pre>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#1F1F1F] text-[11px] text-[#71717A]">
                  <span>KEYBOARD SHORTCUTS: <kbd className="px-1 border border-[#3F3F46] text-[#FFFFFF]">CTRL+K</kbd> COMMAND PALETTE</span>
                  <span>DUAL RUNTIME: WEB BROWSER + WINDOWS DESKTOP (.EXE)</span>
                </div>
              </div>
            )
          )}
        </main>
      </div>

      {/* --- Global Command Palette (CTRL+K) --- */}
      <CommandPalette />

      {/* --- Space Management Modal --- */}
      <SpaceManagerModal 
        isOpen={showSpaceManagerModal} 
        onClose={() => setShowSpaceManagerModal(false)} 
      />

      {/* --- RAG Context Inspector Modal --- */}
      <RAGInspectorModal />

      {/* --- Member Management & Switcher Modal --- */}
      <MemberManagerModal 
        isOpen={showMemberModal} 
        onClose={() => setShowMemberModal(false)} 
      />

      {/* --- 3D Assistant Studio Modal --- */}
      <AssistantModal 
        isOpen={showAssistantModal} 
        onClose={() => setShowAssistantModal(false)} 
      />

      {/* --- Google Gemini Live Model Discovery Modal --- */}
      <ModelDiscoveryModal 
        isOpen={showModelModal} 
        onClose={() => setShowModelModal(false)} 
      />

      {/* --- Cloud Firestore Spark Sync Modal --- */}
      <CloudSyncModal 
        isOpen={showCloudSyncModal} 
        onClose={() => setShowCloudSyncModal(false)} 
      />

      {/* --- Workspace Exporter & Local Agent Bridge Modal --- */}
      <WorkspaceExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />

      {/* --- Audio Hardware Calibration Modal --- */}
      <AudioHardwareModal 
        isOpen={showHardwareModal} 
        onClose={() => setShowHardwareModal(false)} 
      />

      {/* --- Universal App Demo & Contextual Guide Modal (CTRL+S+D+F) --- */}
      <AppGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />

      {/* --- MODAL 3: Space SOUL.MD Editor --- */}
      {showSoulModal && (
        <div className="fixed inset-0 bg-[#0B0B0E]/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-[#14141C] border border-[#2F2F3E] rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-[#242430] mb-3">
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} className="text-emerald-400" />
                <span className="text-sm font-bold tracking-tight text-[#FFFFFF]">
                  Edit Space System Prompt // {activeSpace.name} (SOUL.MD)
                </span>
              </div>
              <button onClick={() => setShowSoulModal(false)} className="text-[#8E8E9E] hover:text-[#FFFFFF] p-1.5 rounded-full hover:bg-[#20202C] transition-colors">
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-[#D4D4DC] mb-3 leading-relaxed">
              These persistent master instructions are injected into every Google Gemini query executed within this space and bundled into local desktop exports.
            </p>

            <textarea
              value={soulContent}
              onChange={e => setSoulContent(e.target.value)}
              className="flex-1 bg-[#0F0F14] border border-[#242430] focus:border-[#FFFFFF] rounded-2xl p-4 text-xs font-mono text-[#FFFFFF] outline-none resize-none min-h-[300px]"
            />

            <div className="flex justify-end gap-2.5 pt-4 border-t border-[#242430] mt-3">
              <button
                onClick={() => setShowSoulModal(false)}
                className="px-4 py-2 rounded-xl border border-[#2F2F3E] hover:bg-[#1E1E28] text-[#D4D4DC] text-xs font-semibold transition-all"
              >
                CANCEL
              </button>
              <button
                onClick={handleSaveSoul}
                className="px-5 py-2 rounded-xl bg-[#FFFFFF] text-[#0B0B0E] font-bold hover:bg-[#E4E4E7] text-xs transition-all shadow-sm"
              >
                SAVE SOUL.MD
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- Right-Docked AI Copilot Drawer --- */}
      <CopilotDrawer 
        isOpen={copilotDrawerOpen} 
        onClose={() => setCopilotDrawerOpen(false)} 
        dispatchedTask={dispatchedTask}
        onClearTask={() => setDispatchedTask(null)}
      />
    </div>
  );
};
