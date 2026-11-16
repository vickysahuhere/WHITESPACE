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
    setCommandPaletteOpen
  } = useWorkspace();

  // Modals
  const [showSpaceManagerModal, setShowSpaceManagerModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showSoulModal, setShowSoulModal] = useState(false);
  const [showAssistantModal, setShowAssistantModal] = useState(false);

  // Editable SOUL.MD
  const [soulContent, setSoulContent] = useState(activeSpace.soulMd);

  const handleSaveSoul = () => {
    updateSpace(activeSpace.id, { soulMd: soulContent });
    setShowSoulModal(false);
  };

  return (
    <div className="flex h-screen w-screen bg-[#000000] text-[#FFFFFF] overflow-hidden select-none font-mono">
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
      <div className="flex-1 flex flex-col min-w-0 bg-[#000000] overflow-hidden">
        {/* TopBar with instant Gemini API Key wiring */}
        <TopBar 
          onUserClick={() => setShowMemberModal(true)} 
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        {/* Viewport Content Host */}
        <main className="flex-1 overflow-auto bg-[#000000] p-4">
          {children || (
            activeView === 'editor' ? (
              <NotionEditor />
            ) : activeView === 'copilot' ? (
              <ChatView />
            ) : (
              <div className="h-full border border-[#262626] bg-[#0A0A0A] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#262626] mb-4">
                    <div className="flex items-center gap-2">
                      <span className="border border-[#FFFFFF] bg-[#121212] px-2 py-0.5 text-xs font-bold">
                        {activeSpace.badge}
                      </span>
                      <h1 className="text-sm font-bold text-[#FFFFFF] tracking-wider uppercase">
                        {activeSpace.name} // {activeView.toUpperCase()}
                      </h1>
                    </div>
                    <span className="text-[11px] text-[#A3A3A3]">ACTIVE MEMBER: {activeMember.name}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="border border-[#262626] bg-[#0F0F0F] p-4">
                      <div className="text-[11px] text-[#A3A3A3] mb-1">PARADIGM 1 // DISCORD</div>
                      <div className="text-xs font-bold text-[#FFFFFF] mb-2">Space Rail & Audio Pod</div>
                      <p className="text-[11px] text-[#737373] leading-relaxed">
                        Instant space switching, uncompressed 510 kbps WebRTC studio stage calling, and persistent hardware mic/mute pod.
                      </p>
                    </div>

                    <div className="border border-[#262626] bg-[#0F0F0F] p-4">
                      <div className="text-[11px] text-[#A3A3A3] mb-1">PARADIGM 2 // NOTION 3.0</div>
                      <div className="text-xs font-bold text-[#FFFFFF] mb-2">Knowledge Base & Live Editor</div>
                      <p className="text-[11px] text-[#737373] leading-relaxed">
                        Distraction-free slash-command Markdown editor with multi-format file ingestion and per-space SOUL.MD prompts.
                      </p>
                    </div>

                    <div className="border border-[#262626] bg-[#0F0F0F] p-4">
                      <div className="text-[11px] text-[#A3A3A3] mb-1">PARADIGM 3 // OPENCLAW</div>
                      <div className="text-xs font-bold text-[#FFFFFF] mb-2">Kanban & AI Copilot</div>
                      <p className="text-[11px] text-[#737373] leading-relaxed">
                        3-column engineering task pipeline with 1-click Dispatch AI execution grounded in sub-millisecond local RAG.
                      </p>
                    </div>
                  </div>

                  <div className="border border-[#262626] bg-[#121212] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#FFFFFF]">SPACE SYSTEM PROMPT (SOUL.MD)</span>
                      <span className="text-[10px] text-[#737373]">INJECTED INTO GEMINI QUERIES</span>
                    </div>
                    <pre className="text-xs text-[#A3A3A3] font-mono whitespace-pre-wrap bg-[#000000] p-3 border border-[#262626] max-h-48 overflow-y-auto">
                      {activeSpace.soulMd}
                    </pre>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#262626] text-[11px] text-[#737373]">
                  <span>KEYBOARD SHORTCUTS: <kbd className="px-1 border border-[#404040] text-[#FFFFFF]">CTRL+K</kbd> COMMAND PALETTE</span>
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

      {/* --- MODAL 3: Space SOUL.MD Editor --- */}
      {showSoulModal && (
        <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-[#0F0F0F] border border-[#404040] p-5 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626] mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#FFFFFF]" />
                <span className="text-xs font-bold tracking-wider text-[#FFFFFF]">
                  EDIT SPACE SYSTEM PROMPT // {activeSpace.name.toUpperCase()} (SOUL.MD)
                </span>
              </div>
              <button onClick={() => setShowSoulModal(false)} className="text-[#A3A3A3] hover:text-[#FFFFFF]">
                <X size={15} />
              </button>
            </div>

            <p className="text-[11px] text-[#A3A3A3] mb-3">
              These persistent master instructions are injected into every Google Gemini query executed within this space and bundled into local desktop exports.
            </p>

            <textarea
              value={soulContent}
              onChange={e => setSoulContent(e.target.value)}
              className="flex-1 bg-[#000000] border border-[#262626] focus:border-[#FFFFFF] p-3 text-xs font-mono text-[#FFFFFF] outline-none resize-none min-h-[300px]"
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-[#262626] mt-3">
              <button
                onClick={() => setShowSoulModal(false)}
                className="px-3 py-1.5 border border-[#262626] hover:bg-[#171717] text-[#A3A3A3] text-xs"
              >
                CANCEL
              </button>
              <button
                onClick={handleSaveSoul}
                className="px-4 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold border border-[#FFFFFF] hover:bg-[#A3A3A3] text-xs"
              >
                SAVE SOUL.MD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
