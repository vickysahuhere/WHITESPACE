import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { DiscordRail } from './DiscordRail';
import { NotionSidebar } from './NotionSidebar';
import { TopBar } from './TopBar';
import { CommandPalette } from '../common/CommandPalette';
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
  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSoulModal, setShowSoulModal] = useState(false);

  // New Space Form
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDesc, setNewSpaceDesc] = useState('');
  const [newSpaceBadge, setNewSpaceBadge] = useState('');

  // New Member Form
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [newUserHardware, setNewUserHardware] = useState('');

  // Editable SOUL.MD
  const [soulContent, setSoulContent] = useState(activeSpace.soulMd);

  const handleCreateSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim()) return;
    addSpace(
      newSpaceName,
      newSpaceDesc || 'Workspace collaboration space.',
      newSpaceBadge || newSpaceName.slice(0, 2)
    );
    setNewSpaceName('');
    setNewSpaceDesc('');
    setNewSpaceBadge('');
    setShowSpaceModal(false);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    addMember(
      newUserName,
      newUserRole || 'ENGINEER',
      newUserHardware || 'Windows PC',
      'Execute autonomous workspace directives with precision.'
    );
    setNewUserName('');
    setNewUserRole('');
    setNewUserHardware('');
    setShowUserModal(false);
  };

  const handleSaveSoul = () => {
    updateSpace(activeSpace.id, { soulMd: soulContent });
    setShowSoulModal(false);
  };

  return (
    <div className="flex h-screen w-screen bg-[#000000] text-[#FFFFFF] overflow-hidden select-none font-mono">
      {/* 1. Far-Left Vertical Discord Rail */}
      <DiscordRail onAddSpaceClick={() => setShowSpaceModal(true)} />

      {/* 2. Notion Navigation Sidebar */}
      <NotionSidebar 
        onUserClick={() => setShowUserModal(true)} 
        onSoulClick={() => {
          setSoulContent(activeSpace.soulMd);
          setShowSoulModal(true);
        }} 
      />

      {/* 3. Main Stage Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#000000] overflow-hidden">
        {/* TopBar with instant Gemini API Key wiring */}
        <TopBar 
          onUserClick={() => setShowUserModal(true)} 
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        {/* Viewport Content Host */}
        <main className="flex-1 overflow-auto bg-[#000000] p-4">
          {children || (
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
          )}
        </main>
      </div>

      {/* --- Global Command Palette (CTRL+K) --- */}
      <CommandPalette />

      {/* --- MODAL 1: Create New Space --- */}
      {showSpaceModal && (
        <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-[#0F0F0F] border border-[#404040] p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626] mb-4">
              <span className="text-xs font-bold tracking-wider text-[#FFFFFF]">CREATE NEW SPACE</span>
              <button onClick={() => setShowSpaceModal(false)} className="text-[#A3A3A3] hover:text-[#FFFFFF]">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreateSpace} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#A3A3A3] mb-1">SPACE NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SignBridge Vision Core"
                  value={newSpaceName}
                  onChange={e => setNewSpaceName(e.target.value)}
                  className="w-full bg-[#171717] border border-[#262626] focus:border-[#FFFFFF] p-2 text-[#FFFFFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#A3A3A3] mb-1">BADGE (2 CHARS)</label>
                <input
                  type="text"
                  maxLength={2}
                  placeholder="e.g. SV"
                  value={newSpaceBadge}
                  onChange={e => setNewSpaceBadge(e.target.value.toUpperCase())}
                  className="w-24 bg-[#171717] border border-[#262626] focus:border-[#FFFFFF] p-2 text-[#FFFFFF] outline-none uppercase font-bold"
                />
              </div>

              <div>
                <label className="block text-[#A3A3A3] mb-1">DESCRIPTION</label>
                <textarea
                  rows={2}
                  placeholder="Short summary of space domain and mission..."
                  value={newSpaceDesc}
                  onChange={e => setNewSpaceDesc(e.target.value)}
                  className="w-full bg-[#171717] border border-[#262626] focus:border-[#FFFFFF] p-2 text-[#FFFFFF] outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSpaceModal(false)}
                  className="px-3 py-1.5 border border-[#262626] hover:bg-[#171717] text-[#A3A3A3]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold border border-[#FFFFFF] hover:bg-[#A3A3A3]"
                >
                  CREATE SPACE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: User Profile & Session Switcher --- */}
      {showUserModal && (
        <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-[#0F0F0F] border border-[#404040] p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626] mb-4">
              <span className="text-xs font-bold tracking-wider text-[#FFFFFF]">MEMBER SESSIONS // SWITCH USER</span>
              <button onClick={() => setShowUserModal(false)} className="text-[#A3A3A3] hover:text-[#FFFFFF]">
                <X size={15} />
              </button>
            </div>

            <div className="space-y-2 mb-5">
              <div className="text-[11px] text-[#737373] uppercase mb-1">Active Team Members (Chat & RAG Isolated)</div>
              {members.map(member => (
                <div
                  key={member.id}
                  onClick={() => {
                    setActiveMemberId(member.id);
                    setShowUserModal(false);
                  }}
                  className={`p-2.5 border flex items-center justify-between cursor-pointer transition-all ${
                    member.id === activeMember.id
                      ? 'border-[#FFFFFF] bg-[#1A1A1A]'
                      : 'border-[#262626] bg-[#121212] hover:border-[#404040] hover:bg-[#171717]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-[#000000] border border-[#404040] flex items-center justify-center text-xs font-bold text-[#FFFFFF]">
                      {member.badge}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-[#FFFFFF]">{member.name}</div>
                      <div className="text-[10px] text-[#A3A3A3]">{member.role}</div>
                      <div className="text-[9px] text-[#737373] truncate max-w-xs">{member.hardware}</div>
                    </div>
                  </div>
                  {member.id === activeMember.id && (
                    <span className="border border-[#FFFFFF] px-1.5 py-0.5 text-[9px] font-bold bg-[#FFFFFF] text-[#000000]">
                      ACTIVE
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Add Member Form */}
            <form onSubmit={handleCreateMember} className="border-t border-[#262626] pt-3 text-xs font-mono space-y-2">
              <span className="text-[10px] text-[#A3A3A3] block font-bold uppercase">+ Add New Team Member</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  className="bg-[#171717] border border-[#262626] p-1.5 text-[#FFFFFF] outline-none"
                />
                <input
                  type="text"
                  placeholder="Role (e.g. SYSTEMS ENG)"
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value)}
                  className="bg-[#171717] border border-[#262626] p-1.5 text-[#FFFFFF] outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-1.5 bg-[#171717] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#404040] text-xs font-bold transition-all"
              >
                ADD TEAM MEMBER
              </button>
            </form>
          </div>
        </div>
      )}

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
