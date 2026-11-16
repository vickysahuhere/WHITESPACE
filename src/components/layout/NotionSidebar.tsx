import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useDocuments } from '../../context/DocumentContext';
import { WorkspaceView } from '../../types';
import { FORMAT_BADGES } from '../../services/documentParser';
import { VoicePod } from './VoicePod';
import { DocumentUploader } from '../editor/DocumentUploader';
import { FileText, Kanban, Globe, Radio, Bot, ChevronDown, ChevronRight, Sparkles, Plus, Settings, UploadCloud, Trash2 } from 'lucide-react';

export const NotionSidebar: React.FC<{ 
  onUserClick: () => void;
  onSoulClick: () => void;
  onManageSpaces?: () => void;
}> = ({ onUserClick, onSoulClick, onManageSpaces }) => {
  const { activeSpace, activeView, setActiveView } = useWorkspace();
  const { getDocumentsForSpace, activeDocumentId, setActiveDocumentId, createDocument, deleteDocument } = useDocuments();
  const [docsExpanded, setDocsExpanded] = useState(true);
  const [showUploader, setShowUploader] = useState(false);

  const spaceDocs = getDocumentsForSpace(activeSpace.id);

  const navItems: { view: WorkspaceView; label: string; icon: React.ReactNode }[] = [
    { view: 'editor', label: 'KNOWLEDGE DOCS', icon: <FileText size={15} /> },
    { view: 'kanban', label: 'OPENCLAW KANBAN', icon: <Kanban size={15} /> },
    { view: 'browser', label: 'OSS DEV BROWSER', icon: <Globe size={15} /> },
    { view: 'stage', label: 'STUDIO STAGE', icon: <Radio size={15} /> },
    { view: 'copilot', label: 'AI COPILOT', icon: <Bot size={15} /> },
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
    <aside className="w-60 h-screen bg-[#0D0D0D] border-r border-[#262626] flex flex-col justify-between shrink-0 select-none">
      {/* Top Space Header */}
      <div>
        <div className="p-3 border-b border-[#262626] flex items-center justify-between">
          <div 
            onClick={onManageSpaces}
            title="Manage Spaces (Click to configure)"
            className="flex items-center gap-2 min-w-0 cursor-pointer group"
          >
            <span className="border border-[#404040] group-hover:border-[#FFFFFF] bg-[#171717] px-1.5 py-0.5 text-[11px] font-mono font-bold text-[#FFFFFF] shrink-0">
              {activeSpace.badge}
            </span>
            <span className="font-mono text-xs font-bold text-[#FFFFFF] truncate group-hover:text-[#FFFFFF]">
              {activeSpace.name}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onManageSpaces}
              title="Open Space Manager"
              className="p-1 hover:bg-[#1C1C1C] text-[#A3A3A3] hover:text-[#FFFFFF] border border-transparent hover:border-[#262626] transition-all"
            >
              <Settings size={13} />
            </button>
            <button
              onClick={onSoulClick}
              title="Inspect Space SOUL.MD"
              className="p-1 hover:bg-[#1C1C1C] text-[#A3A3A3] hover:text-[#FFFFFF] border border-transparent hover:border-[#262626] transition-all"
            >
              <Sparkles size={13} />
            </button>
          </div>
        </div>

        {/* View Switcher Links */}
        <nav className="p-2 space-y-1">
          {navItems.map(item => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-mono transition-all border ${
                  isActive
                    ? 'bg-[#1C1C1C] text-[#FFFFFF] border-[#404040] font-bold'
                    : 'bg-transparent text-[#A3A3A3] border-transparent hover:text-[#FFFFFF] hover:bg-[#141414]'
                }`}
              >
                <span className={isActive ? 'text-[#FFFFFF]' : 'text-[#737373]'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Document Tree Hierarchy */}
        <div className="mt-2 px-2">
          <div 
            onClick={() => setDocsExpanded(!docsExpanded)}
            className="flex items-center justify-between px-2 py-1 text-[11px] font-mono text-[#737373] hover:text-[#FFFFFF] cursor-pointer"
          >
            <div className="flex items-center gap-1">
              {docsExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              <span>SPACE DOCUMENTS ({spaceDocs.length})</span>
            </div>
            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setShowUploader(true)}
                className="hover:text-[#FFFFFF] p-0.5 text-[#737373]" 
                title="Upload Files (.md, .py, .ts, .json, .csv...)"
              >
                <UploadCloud size={12} />
              </button>
              <button 
                onClick={handleCreateNewDoc}
                className="hover:text-[#FFFFFF] p-0.5 text-[#737373]" 
                title="New Markdown Document"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          {docsExpanded && (
            <div className="mt-1 pl-2 space-y-0.5 text-xs font-mono max-h-56 overflow-y-auto no-scrollbar">
              {spaceDocs.length === 0 ? (
                <div className="px-2 py-2 text-[10px] text-[#555555]">
                  NO DOCUMENTS // CLICK + OR UPLOAD
                </div>
              ) : (
                spaceDocs.map(doc => {
                  const isDocActive = activeView === 'editor' && doc.id === activeDocumentId;
                  const formatBadge = FORMAT_BADGES[doc.format] || doc.format.toUpperCase();
                  return (
                    <div 
                      key={doc.id}
                      onClick={() => handleSelectDoc(doc.id)}
                      className={`group px-2 py-1 cursor-pointer flex items-center justify-between border-l transition-all ${
                        isDocActive
                          ? 'border-[#FFFFFF] bg-[#1A1A1A] text-[#FFFFFF] font-bold'
                          : 'border-[#262626] text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#141414]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`px-1 py-0.2 text-[9px] font-bold border ${
                          isDocActive 
                            ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]' 
                            : 'bg-[#000000] text-[#737373] border-[#333333]'
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
                        className="opacity-0 group-hover:opacity-100 hover:text-[#FFFFFF] p-0.5 text-[#737373] transition-opacity"
                      >
                        <Trash2 size={11} />
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
      <VoicePod onUserClick={onUserClick} />

      {/* Document Uploader Modal */}
      <DocumentUploader 
        isOpen={showUploader} 
        onClose={() => setShowUploader(false)} 
      />
    </aside>
  );
};
