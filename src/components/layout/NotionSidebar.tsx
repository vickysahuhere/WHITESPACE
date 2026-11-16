import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { WorkspaceView } from '../../types';
import { VoicePod } from './VoicePod';
import { FileText, Kanban, Globe, Radio, Bot, ChevronDown, ChevronRight, Sparkles, Plus, Settings } from 'lucide-react';

export const NotionSidebar: React.FC<{ 
  onUserClick: () => void;
  onSoulClick: () => void;
  onManageSpaces?: () => void;
}> = ({ onUserClick, onSoulClick, onManageSpaces }) => {
  const { activeSpace, activeView, setActiveView } = useWorkspace();
  const [docsExpanded, setDocsExpanded] = useState(true);

  const navItems: { view: WorkspaceView; label: string; icon: React.ReactNode }[] = [
    { view: 'editor', label: 'KNOWLEDGE DOCS', icon: <FileText size={15} /> },
    { view: 'kanban', label: 'OPENCLAW KANBAN', icon: <Kanban size={15} /> },
    { view: 'browser', label: 'OSS DEV BROWSER', icon: <Globe size={15} /> },
    { view: 'stage', label: 'STUDIO STAGE', icon: <Radio size={15} /> },
    { view: 'copilot', label: 'AI COPILOT', icon: <Bot size={15} /> },
  ];

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
              <span>SPACE DOCUMENTS</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveView('editor');
              }}
              className="hover:text-[#FFFFFF] p-0.5" 
              title="New Document"
            >
              <Plus size={12} />
            </button>
          </div>

          {docsExpanded && (
            <div className="mt-1 pl-4 space-y-0.5 text-xs font-mono">
              <div 
                onClick={() => setActiveView('editor')}
                className="px-2 py-1 text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#141414] cursor-pointer flex items-center gap-1.5 truncate border-l border-[#262626]"
              >
                <span className="text-[10px] text-[#737373]">MD</span>
                <span className="truncate">Architecture Specs</span>
              </div>
              <div 
                onClick={() => setActiveView('editor')}
                className="px-2 py-1 text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#141414] cursor-pointer flex items-center gap-1.5 truncate border-l border-[#262626]"
              >
                <span className="text-[10px] text-[#737373]">MD</span>
                <span className="truncate">SOUL.MD (System Prompt)</span>
              </div>
              <div 
                onClick={() => setActiveView('editor')}
                className="px-2 py-1 text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#141414] cursor-pointer flex items-center gap-1.5 truncate border-l border-[#262626]"
              >
                <span className="text-[10px] text-[#737373]">TS</span>
                <span className="truncate">Audio & WebRTC Pipeline</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Persistent Voice & User Pod */}
      <VoicePod onUserClick={onUserClick} />
    </aside>
  );
};
