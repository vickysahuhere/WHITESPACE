import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useChat } from '../../context/ChatContext';
import { Member } from '../../types';
import { 
  Users, 
  X, 
  Plus, 
  Check, 
  Copy, 
  Trash2, 
  Cpu, 
  FileText, 
  ShieldCheck, 
  RotateCcw 
} from 'lucide-react';

interface MemberManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemberManagerModal: React.FC<MemberManagerModalProps> = ({ isOpen, onClose }) => {
  const { 
    members, 
    activeMember, 
    activeMemberId, 
    setActiveMemberId, 
    addMember, 
    updateMember, 
    deleteMember, 
    duplicateMember,
    activeSpace 
  } = useWorkspace();

  const { clearMessages } = useChat();

  const [selectedMemberId, setSelectedMemberId] = useState<string>(activeMemberId);
  const [activeTab, setActiveTab] = useState<'profile' | 'actions' | 'create'>('profile');

  const currentMember = members.find(m => m.id === selectedMemberId) || activeMember;

  // Edit Profile Form State
  const [editName, setEditName] = useState(currentMember.name);
  const [editBadge, setEditBadge] = useState(currentMember.badge);
  const [editRole, setEditRole] = useState(currentMember.role);
  const [editHardware, setEditHardware] = useState(currentMember.hardware);
  const [editInstructions, setEditInstructions] = useState(currentMember.instructions);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // New Member Form State
  const [newName, setNewName] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newHardware, setNewHardware] = useState('');
  const [newInstructions, setNewInstructions] = useState('');

  const handleSelectMember = (member: Member) => {
    setSelectedMemberId(member.id);
    setEditName(member.name);
    setEditBadge(member.badge);
    setEditRole(member.role);
    setEditHardware(member.hardware);
    setEditInstructions(member.instructions);
    setActiveTab('profile');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateMember(currentMember.id, {
      name: editName.trim() || currentMember.name,
      badge: editBadge.toUpperCase().slice(0, 2) || currentMember.badge,
      role: editRole.toUpperCase().trim() || currentMember.role,
      hardware: editHardware.trim() || currentMember.hardware,
      instructions: editInstructions.trim() || currentMember.instructions
    });
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const created = addMember(
      newName.trim(),
      newRole.trim() || 'SOFTWARE ARCHITECT',
      newHardware.trim() || 'Windows 11 PC // High-Speed Runtime',
      newInstructions.trim() || 'Execute autonomous workspace directives with precision and strict discipline.'
    );
    setNewName('');
    setNewBadge('');
    setNewRole('');
    setNewHardware('');
    setNewInstructions('');
    handleSelectMember(created);
  };

  const handleDuplicate = () => {
    const cloned = duplicateMember(currentMember.id);
    if (cloned) {
      handleSelectMember(cloned);
    }
  };

  const handleDelete = () => {
    if (members.length <= 1) return;
    if (window.confirm(`DELETE TEAM MEMBER: ${currentMember.name.toUpperCase()}?`)) {
      deleteMember(currentMember.id);
      setSelectedMemberId(members[0].id);
      handleSelectMember(members[0]);
    }
  };

  const handleClearChat = () => {
    if (window.confirm(`CLEAR ISOLATED CHAT LOGS FOR ${currentMember.name.toUpperCase()} IN SPACE ${activeSpace.badge}?`)) {
      clearMessages(currentMember.id, activeSpace.id);
      alert('Isolated chat history cleared.');
    }
  };

  if (!isOpen) return null;

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
            <Users size={15} className="text-[#FFFFFF]" />
            <span className="text-xs font-bold tracking-widest text-[#FFFFFF]">MEMBER SESSIONS // TEAM PERSONALIZATION</span>
            <span className="text-[10px] text-[#737373]">({members.length} MEMBERS REGISTERED)</span>
          </div>
          <button 
            onClick={onClose}
            className="text-[#A3A3A3] hover:text-[#FFFFFF] p-1 border border-transparent hover:border-[#262626]"
          >
            <X size={15} />
          </button>
        </div>

        {/* 2-Column Split Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Member Roster */}
          <div className="w-72 border-r border-[#262626] bg-[#0D0D0D] flex flex-col justify-between shrink-0">
            <div className="p-2 border-b border-[#262626] flex items-center justify-between text-[10px] text-[#737373]">
              <span>TEAM ROSTER</span>
              <button
                onClick={() => setActiveTab('create')}
                className="hover:text-[#FFFFFF] flex items-center gap-1 font-bold"
              >
                <Plus size={11} />
                <span>ADD USER</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {members.map(m => {
                const isSelected = m.id === currentMember.id;
                const isCurrentActive = m.id === activeMemberId;
                return (
                  <div
                    key={m.id}
                    onClick={() => handleSelectMember(m)}
                    className={`p-2 border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1C1C1C] text-[#FFFFFF] border-[#FFFFFF]'
                        : 'bg-[#121212] text-[#A3A3A3] border-[#262626] hover:border-[#404040] hover:text-[#FFFFFF]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-7 h-7 flex items-center justify-center text-[10px] font-bold border shrink-0 ${
                        isSelected 
                          ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]' 
                          : 'bg-[#000000] text-[#FFFFFF] border-[#404040]'
                      }`}>
                        {m.badge}
                      </span>
                      <div className="truncate">
                        <div className="truncate font-bold text-[#FFFFFF]">{m.name}</div>
                        <div className="text-[10px] text-[#737373] truncate">{m.role}</div>
                      </div>
                    </div>
                    {isCurrentActive && (
                      <span className="border border-[#FFFFFF] px-1 py-0.2 text-[8px] font-bold bg-[#FFFFFF] text-[#000000] shrink-0">
                        ACTIVE
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Switch Active User Button */}
            <div className="p-2 border-t border-[#262626] bg-[#0A0A0A]">
              <button
                onClick={() => {
                  setActiveMemberId(currentMember.id);
                  onClose();
                }}
                className="w-full py-2 bg-[#171717] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#404040] text-xs font-bold transition-all text-center tracking-wider"
              >
                SWITCH TO {currentMember.name.toUpperCase()}
              </button>
            </div>
          </div>

          {/* Right Column: Member Profile & Personal Instructions */}
          <div className="flex-1 flex flex-col bg-[#080808] overflow-hidden">
            {activeTab === 'create' ? (
              /* Create Member Form */
              <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-between">
                <div>
                  <div className="pb-3 border-b border-[#262626] mb-4">
                    <h2 className="text-sm font-bold text-[#FFFFFF] tracking-wider uppercase">
                      REGISTER NEW WHITE COLLAR
                    </h2>
                    <p className="text-xs text-[#737373] mt-1">
                      Each team member receives their own isolated chat history, personal AI profile, and hardware context.
                    </p>
                  </div>

                  <form onSubmit={handleCreate} id="create-member-form" className="space-y-4 max-w-lg text-xs">
                    <div>
                      <label className="block text-[#A3A3A3] mb-1">FULL NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Elena Rostova"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        className="w-full bg-[#121212] border border-[#262626] focus:border-[#FFFFFF] p-2 text-[#FFFFFF] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A3A3A3] mb-1">ROLE / TITLE</label>
                      <input
                        type="text"
                        placeholder="e.g. COMPILER OPTIMIZATION ENG"
                        value={newRole}
                        onChange={e => setNewRole(e.target.value)}
                        className="w-full bg-[#121212] border border-[#262626] focus:border-[#FFFFFF] p-2 text-[#FFFFFF] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A3A3A3] mb-1">HARDWARE / TECH STACK</label>
                      <input
                        type="text"
                        placeholder="e.g. Windows 11 // RTX 4090 // Node 20 // CUDA 12"
                        value={newHardware}
                        onChange={e => setNewHardware(e.target.value)}
                        className="w-full bg-[#121212] border border-[#262626] focus:border-[#FFFFFF] p-2 text-[#FFFFFF] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A3A3A3] mb-1">PERSONAL SYSTEM INSTRUCTIONS</label>
                      <textarea
                        rows={3}
                        placeholder="Personal AI directives (e.g. Always generate TypeScript with strict types and zero external runtime bloat)..."
                        value={newInstructions}
                        onChange={e => setNewInstructions(e.target.value)}
                        className="w-full bg-[#121212] border border-[#262626] focus:border-[#FFFFFF] p-2 text-[#FFFFFF] outline-none resize-none"
                      />
                    </div>
                  </form>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-[#262626]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className="px-3 py-1.5 border border-[#262626] text-[#A3A3A3] text-xs hover:text-[#FFFFFF]"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    form="create-member-form"
                    className="px-4 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#A3A3A3]"
                  >
                    REGISTER MEMBER
                  </button>
                </div>
              </div>
            ) : (
              /* Config Tabs */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Tabs Strip */}
                <div className="h-10 border-b border-[#262626] bg-[#0C0C0C] px-4 flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-3 py-1 text-xs border transition-all ${
                      activeTab === 'profile'
                        ? 'bg-[#1C1C1C] text-[#FFFFFF] border-[#404040] font-bold'
                        : 'border-transparent text-[#737373] hover:text-[#FFFFFF]'
                    }`}
                  >
                    01 // PERSONAL PROFILE & HARDWARE
                  </button>
                  <button
                    onClick={() => setActiveTab('actions')}
                    className={`px-3 py-1 text-xs border transition-all ${
                      activeTab === 'actions'
                        ? 'bg-[#1C1C1C] text-[#FFFFFF] border-[#404040] font-bold'
                        : 'border-transparent text-[#737373] hover:text-[#FFFFFF]'
                    }`}
                  >
                    02 // SESSION ACTIONS & DANGER
                  </button>

                  {saveFeedback && (
                    <span className="ml-auto text-[11px] text-[#FFFFFF] font-bold flex items-center gap-1">
                      <Check size={12} strokeWidth={3} />
                      <span>SAVED</span>
                    </span>
                  )}
                </div>

                {/* Tab 1: Profile Customization */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleSaveProfile} className="p-6 space-y-4 max-w-xl text-xs overflow-y-auto flex-1">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="block text-[#A3A3A3] mb-1">MEMBER NAME</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="w-full bg-[#121212] border border-[#262626] focus:border-[#FFFFFF] p-2 text-[#FFFFFF] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#A3A3A3] mb-1">2-CHAR BADGE</label>
                        <input
                          type="text"
                          maxLength={2}
                          value={editBadge}
                          onChange={e => setEditBadge(e.target.value.toUpperCase())}
                          className="w-full bg-[#121212] border border-[#262626] focus:border-[#FFFFFF] p-2 text-[#FFFFFF] outline-none uppercase font-bold text-center"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#A3A3A3] mb-1">ENGINEERING ROLE</label>
                      <input
                        type="text"
                        value={editRole}
                        onChange={e => setEditRole(e.target.value)}
                        className="w-full bg-[#121212] border border-[#262626] focus:border-[#FFFFFF] p-2 text-[#FFFFFF] outline-none uppercase"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[#A3A3A3] flex items-center gap-1.5">
                          <Cpu size={12} />
                          <span>HARDWARE & ENVIRONMENT CONTEXT</span>
                        </label>
                        <span className="text-[10px] text-[#737373]">INJECTED INTO GEMINI SYSTEM PROMPT</span>
                      </div>
                      <input
                        type="text"
                        value={editHardware}
                        onChange={e => setEditHardware(e.target.value)}
                        placeholder="e.g. Windows PC // RTX 4090 // Node 20"
                        className="w-full bg-[#121212] border border-[#262626] focus:border-[#FFFFFF] p-2 text-[#FFFFFF] outline-none font-mono"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[#A3A3A3] flex items-center gap-1.5">
                          <FileText size={12} />
                          <span>PERSONAL AI SYSTEM INSTRUCTIONS</span>
                        </label>
                        <span className="text-[10px] text-[#737373]">SHAPES AI REASONING FOR THIS MEMBER</span>
                      </div>
                      <textarea
                        rows={4}
                        value={editInstructions}
                        onChange={e => setEditInstructions(e.target.value)}
                        placeholder="Directives for code style, architectural constraints, and preferences..."
                        className="w-full bg-[#000000] border border-[#262626] focus:border-[#FFFFFF] p-3 text-[#FFFFFF] outline-none resize-none leading-relaxed font-mono"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#A3A3A3]"
                      >
                        SAVE PROFILE CHANGES
                      </button>
                    </div>
                  </form>
                )}

                {/* Tab 2: Actions & Danger */}
                {activeTab === 'actions' && (
                  <div className="p-6 space-y-6 text-xs max-w-lg">
                    {/* Duplicate Member */}
                    <div className="border border-[#262626] bg-[#121212] p-4">
                      <div className="flex items-center gap-2 font-bold text-[#FFFFFF] mb-1">
                        <Copy size={14} />
                        <span>DUPLICATE MEMBER PROFILE</span>
                      </div>
                      <p className="text-[11px] text-[#737373] mb-3">
                        Clone this member&apos;s role, hardware stack, and instructions into a new member profile.
                      </p>
                      <button
                        type="button"
                        onClick={handleDuplicate}
                        className="px-3 py-1.5 bg-[#171717] hover:bg-[#262626] text-[#FFFFFF] border border-[#404040]"
                      >
                        DUPLICATE THIS PROFILE
                      </button>
                    </div>

                    {/* Clear Isolated Chat History */}
                    <div className="border border-[#262626] bg-[#121212] p-4">
                      <div className="flex items-center gap-2 font-bold text-[#FFFFFF] mb-1">
                        <RotateCcw size={14} />
                        <span>CLEAR CHAT HISTORY (SPACE [{activeSpace.badge}])</span>
                      </div>
                      <p className="text-[11px] text-[#737373] mb-3">
                        Erase all private AI conversation messages for this member in the active space.
                      </p>
                      <button
                        type="button"
                        onClick={handleClearChat}
                        className="px-3 py-1.5 bg-[#171717] hover:bg-[#262626] text-[#FFFFFF] border border-[#404040]"
                      >
                        CLEAR ISOLATED CHAT
                      </button>
                    </div>

                    {/* Delete Custom Member */}
                    <div className="border border-[#404040] bg-[#121212] p-4">
                      <div className="flex items-center gap-2 font-bold text-[#FFFFFF] mb-1">
                        <Trash2 size={14} />
                        <span>DELETE MEMBER</span>
                      </div>
                      <p className="text-[11px] text-[#737373] mb-3">
                        Permanently remove this member from the team. Core team members cannot be deleted.
                      </p>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={!currentMember.isCustom || members.length <= 1}
                        className={`px-3 py-1.5 border text-xs font-bold transition-all ${
                          !currentMember.isCustom || members.length <= 1
                            ? 'opacity-40 cursor-not-allowed border-[#262626] text-[#737373]'
                            : 'border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#000000]'
                        }`}
                      >
                        {!currentMember.isCustom ? 'CORE MEMBER (CANNOT DELETE)' : 'DELETE THIS MEMBER'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
