import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useDocuments } from '../../context/DocumentContext';
import { WorkspaceView } from '../../types';
import { FORMAT_BADGES } from '../../services/documentParser';
import { VoicePod } from './VoicePod';
import { DocumentUploader } from '../editor/DocumentUploader';
import { 
  FileText, 
  Kanban, 
  Globe, 
  Radio, 
  Bot, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Plus, 
  Settings, 
  UploadCloud, 
  Trash2 
} from 'lucide-react';

export const NotionSidebar: React.FC<{ 
  onUserClick: () => void;
  onSoulClick: () => void;
  onManageSpaces?: () => void;
  onAssistantClick?: () => void;
}> = ({ onUserClick, onSoulClick, onManageSpaces, onAssistantClick }) => {
  const { activeSpace, activeView, setActiveView } = useWorkspace();
  const { getDocumentsForSpace, activeDocumentId, setActiveDocumentId, createDocument, deleteDocument } = useDocuments();
  const [docsExpanded, setDocsExpanded] = useState(true);
  const [showUploader, setShowUploader] = useState(false);

  const spaceDocs = getDocumentsForSpace(activeSpace.id);

  const navItems: { view: WorkspaceView; label: string; icon: React.ReactNode; shortcut: string }[] = [
    { view: 'editor', label: 'KNOWLEDGE DOCS', icon: <FileText size={14} />, shortcut: '1' },
    { view: 'kanban', label: 'OPENCLAW KANBAN', icon: <Kanban size={14} />, shortcut: '2' },
    { view: 'browser', label: 'OSS DEV BROWSER', icon: <Globe size={14} />, shortcut: '3' },
    { view: 'stage', label: 'STUDIO STAGE', icon: <Radio size={14} />, shortcut: '4' },
    { view: 'copilot', label: 'AI COPILOT', icon: <Bot size={14} />, shortcut: '5' },
  ];

  const handleCreateNewDoc = () => {
    const doc = createDocument(activeSpace.id, 'UNTITLED_DOC', '', 'md');
    setActiveDocumentId(doc.id);
    setActiveView('editor');
  };

  const handleSelectDoc = (id: string) => {
    setActiveDocumentId(id);
    setActiveView('editor');
  };

  return (
    <aside className="w-64 h-screen bg-[#121216] border-r border-[#242430] flex flex-col justify-between shrink-0 select-none">
      {/* Top Space Header & Channels */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Active Space Banner */}
        <div className="h-12 px-3.5 border-b border-[#242430] flex items-center justify-between bg-[#121216] shrink-0">
          <div 
            onClick={onManageSpaces}
            title="Manage Space Configuration"
            className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
          >
            <span className="border border-[#2F2F3E] group-hover:border-[#FFFFFF] bg-[#1E1E26] px-2 py-1 rounded-lg text-xs font-bold text-[#FFFFFF] shrink-0 transition-colors shadow-xs">
              {activeSpace.badge}
            </span>
            <span className="text-sm font-semibold text-[#FFFFFF] truncate group-hover:text-emerald-400 transition-colors">
              {activeSpace.name}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onManageSpaces}
              title="Open Space Settings"
              className="p-1.5 rounded-lg hover:bg-[#1E1E26] text-[#8E8E9E] hover:text-[#FFFFFF] border border-transparent hover:border-[#2F2F3E] transition-all"
            >
              <Settings size={14} />
            </button>
            <button
              onClick={onSoulClick}
              title="Inspect Space SOUL.MD System Prompt"
              className="p-1.5 rounded-lg hover:bg-[#1E1E26] text-[#8E8E9E] hover:text-[#FFFFFF] border border-transparent hover:border-[#2F2F3E] transition-all"
            >
              <Sparkles size={14} />
            </button>
          </div>
        </div>

        {/* Navigation Channels with Rounded Items and Bigger Text */}
        <nav className="p-2.5 space-y-1.5 shrink-0">
          <div className="px-2.5 py-1 text-xs font-semibold text-[#8E8E9E] uppercase tracking-wider">
            Workspace Views
          </div>
          {navItems.map(item => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                  isActive
                    ? 'bg-[#1E1E26] text-[#FFFFFF] border-[#3F3F50] font-semibold shadow-xs'
                    : 'bg-transparent text-[#D4D4DC] border-transparent hover:text-[#FFFFFF] hover:bg-[#17171D] hover:border-[#242430]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={isActive ? 'text-[#FFFFFF]' : 'text-[#8E8E9E]'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-2 h-2 bg-[#FFFFFF] rounded-full shrink-0 shadow-xs" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Document Tree Hierarchy */}
        <div className="mt-2 px-2.5 flex-1 flex flex-col min-h-0">
          <div 
            onClick={() => setDocsExpanded(!docsExpanded)}
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[#8E8E9E] hover:text-[#FFFFFF] hover:bg-[#17171D] cursor-pointer shrink-0 transition-colors"
          >
            <div className="flex items-center gap-2 font-semibold uppercase tracking-wider">
              {docsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span>Documents ({spaceDocs.length})</span>
            </div>
            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setShowUploader(true)}
                className="hover:text-[#FFFFFF] p-1 text-[#8E8E9E] hover:bg-[#1E1E26] rounded-md border border-transparent hover:border-[#2F2F3E] transition-colors" 
                title="Upload Files (.md, .py, .ts, .json, .csv...)"
              >
                <UploadCloud size={14} />
              </button>
              <button 
                onClick={handleCreateNewDoc}
                className="hover:text-[#FFFFFF] p-1 text-[#8E8E9E] hover:bg-[#1E1E26] rounded-md border border-transparent hover:border-[#2F2F3E] transition-colors" 
                title="New Markdown Document"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {docsExpanded && (
            <div className="mt-1 flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {spaceDocs.length === 0 ? (
                <div className="px-3 py-4 text-xs text-[#8E8E9E] rounded-xl border border-dashed border-[#242430] bg-[#17171D]/40 text-center my-1">
                  NO DOCUMENTS
                  <div className="text-[11px] text-[#52525B] mt-1">Click + or Upload File</div>
                </div>
              ) : (
                spaceDocs.map(doc => {
                  const isDocActive = activeView === 'editor' && doc.id === activeDocumentId;
                  const formatBadge = FORMAT_BADGES[doc.format] || doc.format.toUpperCase();
                  return (
                    <div
                      key={doc.id}
                      onClick={() => handleSelectDoc(doc.id)}
                      className={`group px-3 py-2 rounded-xl cursor-pointer flex items-center justify-between transition-all text-xs ${
                        isDocActive
                          ? 'bg-[#1E1E26] text-[#FFFFFF] font-semibold border border-[#3F3F50] shadow-xs'
                          : 'text-[#D4D4DC] hover:text-[#FFFFFF] hover:bg-[#17171D] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold border shrink-0 ${
                          isDocActive 
                            ? 'bg-[#FFFFFF] text-[#0B0B0E] border-[#FFFFFF]' 
                            : 'bg-[#17171D] text-[#8E8E9E] border-[#2F2F3E]'
                        }`}>
                          {formatBadge}
                        </span>
                        <span className="truncate">{doc.title}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDocument(doc.id);
                        }}
                        title="Delete Document"
                        className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 text-[#8E8E9E] transition-opacity"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Persistent Voice & User Pod */}
      <VoicePod onUserClick={onUserClick} onAssistantClick={onAssistantClick} />

      {/* Document Uploader Modal */}
      <DocumentUploader 
        isOpen={showUploader} 
        onClose={() => setShowUploader(false)} 
      />
    </aside>
  );
};
