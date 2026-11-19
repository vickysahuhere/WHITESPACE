import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Space } from '../../types';
import { X, Sparkles, Copy, Trash2, Plus, Check, Compass, AlertTriangle } from 'lucide-react';

export const SpaceManagerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { spaces, activeSpace, activeSpaceId, setActiveSpaceId, addSpace, updateSpace, deleteSpace, duplicateSpace } = useWorkspace();

  const [selectedSpaceId, setSelectedSpaceId] = useState<string>(activeSpaceId);
  const [activeTab, setActiveTab] = useState<'general' | 'soul' | 'danger' | 'create'>('general');

  // Space Edit Form State
  const currentSpace = spaces.find(s => s.id === selectedSpaceId) || activeSpace;
  const [editName, setEditName] = useState(currentSpace.name);
  const [editBadge, setEditBadge] = useState(currentSpace.badge);
  const [editDesc, setEditDesc] = useState(currentSpace.description);
  const [editSoul, setEditSoul] = useState(currentSpace.soulMd);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // New Space Form State
  const [newName, setNewName] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Sync edit state on space select
  const handleSelectSpace = (space: Space) => {
    setSelectedSpaceId(space.id);
    setEditName(space.name);
    setEditBadge(space.badge);
    setEditDesc(space.description);
    setEditSoul(space.soulMd);
    setActiveTab('general');
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSpace(currentSpace.id, {
      name: editName,
      badge: editBadge.toUpperCase().slice(0, 2),
      description: editDesc
    });
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  const handleSaveSoul = () => {
    updateSpace(currentSpace.id, {
      soulMd: editSoul
    });
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const created = addSpace(
      newName.trim(),
      newDesc.trim() || 'Custom workspace space.',
      newBadge.trim() || newName.slice(0, 2)
    );
    setNewName('');
    setNewBadge('');
    setNewDesc('');
    handleSelectSpace(created);
  };

  const handleDuplicate = () => {
    const cloned = duplicateSpace(currentSpace.id);
    if (cloned) {
      handleSelectSpace(cloned);
    }
  };

  const handleDelete = () => {
    if (spaces.length <= 1) return;
    if (window.confirm(`PERMANENTLY DELETE SPACE: ${currentSpace.name.toUpperCase()}?`)) {
      deleteSpace(currentSpace.id);
      setSelectedSpaceId(spaces[0].id);
      handleSelectSpace(spaces[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-[#000000]/85 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none font-mono"
    >
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-4xl h-[650px] bg-[#0A0A0A] border border-[#1F1F1F] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Top Header */}
        <div className="h-12 border-b border-[#1F1F1F] px-4 flex items-center justify-between bg-[#0A0A0A] shrink-0">
          <div className="flex items-center gap-2">
            <Compass size={15} className="text-[#FFFFFF]" />
            <span className="text-xs font-bold tracking-widest text-[#FFFFFF]">SPACE MANAGEMENT SYSTEM</span>
            <span className="text-[10px] text-[#71717A]">({spaces.length} ACTIVE SPACES)</span>
          </div>
          <button 
            onClick={onClose}
            className="text-[#71717A] hover:text-[#FFFFFF] p-1 border border-transparent hover:border-[#1F1F1F] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* 2-Column Split Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Spaces List */}
          <div className="w-72 border-r border-[#1F1F1F] bg-[#0A0A0A] flex flex-col justify-between shrink-0">
            <div className="p-2.5 border-b border-[#1F1F1F] flex items-center justify-between text-[10px] text-[#71717A]">
              <span>SPACES REGISTRY</span>
              <button
                onClick={() => setActiveTab('create')}
                className="hover:text-[#FFFFFF] flex items-center gap-1 font-bold transition-colors"
              >
                <Plus size={11} />
                <span>NEW</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {spaces.map(s => {
                const isSelected = s.id === currentSpace.id;
                const isCurrentActive = s.id === activeSpaceId;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSpace(s)}
                    className={`p-2 border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#18181B] text-[#FFFFFF] border-[#3F3F46]'
                        : 'bg-[#111111] text-[#A1A1AA] border-[#1F1F1F] hover:border-[#262626] hover:bg-[#141414] hover:text-[#FFFFFF]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold border ${
                        isSelected ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]' : 'bg-[#141414] text-[#FFFFFF] border-[#1F1F1F]'
                      }`}>
                        {s.badge}
                      </span>
                      <div className="truncate">
                        <div className="truncate font-bold text-[#FFFFFF]">{s.name}</div>
                        <div className="text-[10px] text-[#71717A] truncate">{s.description}</div>
                      </div>
                    </div>
                    {isCurrentActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] shrink-0" title="Active Space" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Switch Button at base */}
            <div className="p-2 border-t border-[#1F1F1F] bg-[#0A0A0A]">
              <button
                onClick={() => {
                  setActiveSpaceId(currentSpace.id);
                  onClose();
                }}
                className="w-full py-2 bg-[#141414] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#1F1F1F] text-xs font-bold transition-all text-center tracking-wider"
              >
                SWITCH TO THIS SPACE
              </button>
            </div>
          </div>

          {/* Right Column: Space Configuration & SOUL.MD */}
          <div className="flex-1 flex flex-col bg-[#000000] overflow-hidden">
            {activeTab === 'create' ? (
              /* Create Space Form */
              <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-between">
                <div>
                  <div className="pb-3 border-b border-[#1F1F1F] mb-4">
                    <h2 className="text-sm font-bold text-[#FFFFFF] tracking-wider uppercase">CREATE NEW AUTONOMOUS SPACE</h2>
                    <p className="text-xs text-[#71717A] mt-1">Each space maintains its own isolated documents, SOUL.MD prompt, tasks, and tabs.</p>
                  </div>

                  <form onSubmit={handleCreate} id="create-space-form" className="space-y-4 max-w-lg text-xs">
                    <div>
                      <label className="block text-[#A1A1AA] mb-1">SPACE TITLE</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SignBridge Vision Engine"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-[#1F1F1F] focus:border-[#FFFFFF] p-2 text-[#FFFFFF] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A1A1AA] mb-1">2-LETTER BADGE</label>
                      <input
                        type="text"
                        maxLength={2}
                        placeholder="e.g. SB"
                        value={newBadge}
                        onChange={e => setNewBadge(e.target.value.toUpperCase())}
                        className="w-24 bg-[#0A0A0A] border border-[#1F1F1F] focus:border-[#FFFFFF] p-2 text-[#FFFFFF] outline-none uppercase font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A1A1AA] mb-1">DOMAIN DESCRIPTION</label>
                      <textarea
                        rows={3}
                        placeholder="High-frame-rate gesture recognition and video streaming..."
                        value={newDesc}
                        onChange={e => setNewDesc(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-[#1F1F1F] focus:border-[#FFFFFF] p-2 text-[#FFFFFF] outline-none resize-none"
                      />
                    </div>
                  </form>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-[#1F1F1F]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('general')}
                    className="px-3 py-1.5 border border-[#1F1F1F] text-[#A1A1AA] text-xs hover:text-[#FFFFFF] transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    form="create-space-form"
                    className="px-4 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#A1A1AA] transition-colors"
                  >
                    INITIALIZE SPACE
                  </button>
                </div>
              </div>
            ) : (
              /* Config Tabs */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Tabs Strip */}
                <div className="h-10 border-b border-[#1F1F1F] bg-[#0A0A0A] px-4 flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`px-3 py-1 text-xs border transition-all ${
                      activeTab === 'general'
                        ? 'bg-[#18181B] text-[#FFFFFF] border-[#3F3F46] font-bold'
                        : 'border-transparent text-[#71717A] hover:text-[#FFFFFF]'
                    }`}
                  >
                    01 // GENERAL INFO
                  </button>
                  <button
                    onClick={() => setActiveTab('soul')}
                    className={`px-3 py-1 text-xs border transition-all flex items-center gap-1.5 ${
                      activeTab === 'soul'
                        ? 'bg-[#18181B] text-[#FFFFFF] border-[#3F3F46] font-bold'
                        : 'border-transparent text-[#71717A] hover:text-[#FFFFFF]'
                    }`}
                  >
                    <Sparkles size={12} />
                    <span>02 // SOUL.MD PROMPT</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('danger')}
                    className={`px-3 py-1 text-xs border transition-all ${
                      activeTab === 'danger'
                        ? 'bg-[#18181B] text-[#FFFFFF] border-[#3F3F46] font-bold'
                        : 'border-transparent text-[#71717A] hover:text-[#FFFFFF]'
                    }`}
                  >
                    03 // SPACE ACTIONS
                  </button>

                  {saveFeedback && (
                    <span className="ml-auto text-[11px] text-[#FFFFFF] font-bold flex items-center gap-1 font-mono">
                      <Check size={12} strokeWidth={3} />
                      <span>SAVED</span>
                    </span>
                  )}
                </div>

                {/* Tab 1: General */}
                {activeTab === 'general' && (
                  <form onSubmit={handleSaveGeneral} className="p-6 space-y-4 max-w-lg text-xs overflow-y-auto flex-1">
                    <div>
                      <label className="block text-[#A1A1AA] mb-1">SPACE NAME</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-[#1F1F1F] focus:border-[#FFFFFF] p-2 text-[#FFFFFF] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A1A1AA] mb-1">BADGE</label>
                      <input
                        type="text"
                        maxLength={2}
                        value={editBadge}
                        onChange={e => setEditBadge(e.target.value.toUpperCase())}
                        className="w-20 bg-[#0A0A0A] border border-[#1F1F1F] focus:border-[#FFFFFF] p-2 text-[#FFFFFF] outline-none uppercase font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A1A1AA] mb-1">DESCRIPTION</label>
                      <textarea
                        rows={3}
                        value={editDesc}
                        onChange={e => setEditDesc(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-[#1F1F1F] focus:border-[#FFFFFF] p-2 text-[#FFFFFF] outline-none resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#A1A1AA] transition-colors"
                      >
                        SAVE GENERAL CHANGES
                      </button>
                    </div>
                  </form>
                )}

                {/* Tab 2: SOUL.MD */}
                {activeTab === 'soul' && (
                  <div className="p-4 flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between pb-2 text-xs">
                      <span className="text-[#A1A1AA]">SYSTEM PROMPT (INJECTED INTO GEMINI REST & LOCAL RAG)</span>
                      <span className="text-[10px] text-[#71717A]">
                        {editSoul.split(/\s+/).filter(Boolean).length} WORDS // {editSoul.length} CHARS
                      </span>
                    </div>

                    <textarea
                      value={editSoul}
                      onChange={e => setEditSoul(e.target.value)}
                      placeholder="# SOUL.MD // INSTRUCTIONS FOR THIS SPACE..."
                      className="flex-1 bg-[#0A0A0A] border border-[#1F1F1F] focus:border-[#FFFFFF] p-3 text-xs font-mono text-[#FFFFFF] outline-none resize-none leading-relaxed"
                    />

                    <div className="flex justify-end gap-2 pt-3 shrink-0">
                      <button
                        type="button"
                        onClick={handleSaveSoul}
                        className="px-4 py-2 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#A1A1AA] transition-colors"
                      >
                        SAVE SOUL.MD
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 3: Danger & Actions */}
                {activeTab === 'danger' && (
                  <div className="p-6 space-y-6 text-xs max-w-lg">
                    <div className="border border-[#1F1F1F] bg-[#111111] p-4">
                      <div className="flex items-center gap-2 font-bold text-[#FFFFFF] mb-1">
                        <Copy size={14} className="text-[#A1A1AA]" />
                        <span>DUPLICATE SPACE</span>
                      </div>
                      <p className="text-[11px] text-[#71717A] mb-3">
                        Clone all metadata, SOUL.MD system prompt, and configurations into a new independent space.
                      </p>
                      <button
                        type="button"
                        onClick={handleDuplicate}
                        className="px-3 py-1.5 bg-[#141414] hover:bg-[#18181B] text-[#FFFFFF] border border-[#1F1F1F] transition-colors"
                      >
                        DUPLICATE THIS SPACE
                      </button>
                    </div>

                    <div className="border border-[#1F1F1F] bg-[#111111] p-4">
                      <div className="flex items-center gap-2 font-bold text-[#FFFFFF] mb-1">
                        <Trash2 size={14} className="text-[#A1A1AA]" />
                        <span>DELETE SPACE</span>
                      </div>
                      <p className="text-[11px] text-[#71717A] mb-3">
                        Permanently remove this space. At least one space must remain in the workspace.
                      </p>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={spaces.length <= 1}
                        className={`px-3 py-1.5 border text-xs font-bold transition-all ${
                          spaces.length <= 1
                            ? 'opacity-30 cursor-not-allowed border-[#1F1F1F] text-[#71717A]'
                            : 'border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#000000]'
                        }`}
                      >
                        {spaces.length <= 1 ? 'CANNOT DELETE LAST SPACE' : 'DELETE THIS SPACE'}
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
