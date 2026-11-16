import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useRAG } from '../../context/RAGContext';
import { firebaseSync } from '../../services/firebaseSync';
import { WindowControls } from './WindowControls';
import { Search, Database, Bot, Cloud, Download, HelpCircle } from 'lucide-react';

export const TopBar: React.FC<{
  onUserClick: () => void;
  onOpenCommandPalette: () => void;
  onToggleCopilotDrawer?: () => void;
  isCopilotDrawerOpen?: boolean;
  onOpenModelDiscovery?: () => void;
  onOpenCloudSync?: () => void;
  onOpenExport?: () => void;
}> = ({ 
  onUserClick, 
  onOpenCommandPalette, 
  onToggleCopilotDrawer, 
  isCopilotDrawerOpen, 
  onOpenModelDiscovery, 
  onOpenCloudSync, 
  onOpenExport 
}) => {
  const { activeSpace, activeView, activeMember, isKeyLinked, guideModalOpen, setGuideModalOpen } = useWorkspace();
  const { totalChunksIndexed, setRagInspectorOpen } = useRAG();
  const [isCloudAuthorized, setIsCloudAuthorized] = useState(() => firebaseSync.isAuthorized());

  useEffect(() => {
    const checkSync = () => setIsCloudAuthorized(firebaseSync.isAuthorized());
    window.addEventListener('storage', checkSync);
    return () => window.removeEventListener('storage', checkSync);
  }, []);

  return (
    <header 
      className="h-11 bg-[#0A0A0A] border-b border-[#262626] px-3 flex items-center justify-between select-none shrink-0 z-20 gap-3 font-mono"
      style={{ WebkitAppRegion: 'drag' } as any}
    >
      {/* Left: Minimal Single-Line Breadcrumb */}
      <div 
        className="flex items-center gap-2 text-xs text-[#A3A3A3] shrink-0 whitespace-nowrap overflow-hidden max-w-[240px] sm:max-w-[280px]"
        style={{ WebkitAppRegion: 'no-drag' } as any}
      >
        <span className="text-[#FFFFFF] font-bold tracking-wider">WHITESPACE</span>
        <span className="text-[#333333]">/</span>
        <span className="text-[#CCCCCC] font-semibold truncate max-w-[120px] sm:max-w-[150px]" title={activeSpace.name}>
          {activeSpace.name.toUpperCase()}
        </span>
        <span className="text-[#333333]">/</span>
        <span className="text-[#737373] uppercase shrink-0 text-[11px]">{activeView}</span>
      </div>

      {/* Center: Minimal Command Bar / Quick Search */}
      <div 
        className="flex-1 flex justify-center px-2 min-w-0"
        style={{ WebkitAppRegion: 'no-drag' } as any}
      >
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="w-full max-w-[260px] h-7 flex items-center justify-between px-2.5 bg-[#121212] hover:bg-[#181818] border border-[#262626] hover:border-[#404040] text-xs text-[#666666] hover:text-[#A3A3A3] transition-colors"
          title="Open Command Palette (CTRL+K)"
        >
          <span className="flex items-center gap-2 truncate">
            <Search size={12} className="text-[#555555] shrink-0" />
            <span className="text-[11px] truncate text-[#737373]">Search or jump to...</span>
          </span>
          <kbd className="text-[9px] bg-[#000000] border border-[#262626] px-1 py-0.2 text-[#737373] shrink-0 font-mono">CTRL+K</kbd>
        </button>
      </div>

      {/* Right: Minimal Unified Status & Tooling Actions */}
      <div 
        className="flex items-center gap-1.5 shrink-0 whitespace-nowrap"
        style={{ WebkitAppRegion: 'no-drag' } as any}
      >
        {/* Gemini AI Status Pill */}
        <button
          type="button"
          onClick={onOpenModelDiscovery}
          className={`h-7 flex items-center gap-1.5 px-2 border text-[10px] shrink-0 transition-colors cursor-pointer hover:border-[#FFFFFF] ${
            isKeyLinked 
              ? 'border-[#333333] bg-[#121212] text-[#FFFFFF]' 
              : 'border-[#262626] bg-[#0A0A0A] text-[#737373]'
          }`}
          title="Google Gemini Models & API Key"
        >
          <div className={`w-1.5 h-1.5 rounded-full ${isKeyLinked ? 'bg-[#FFFFFF] animate-pulse' : 'bg-[#525252]'}`} />
          <span>{isKeyLinked ? 'GEMINI' : 'LOCAL RAG'}</span>
        </button>

        {/* In-Memory Local RAG Metrics */}
        <button
          type="button"
          onClick={() => setRagInspectorOpen(true)}
          title="Local RAG Context Inspector (<1ms)"
          className="h-7 flex items-center gap-1.5 px-2 border border-[#262626] hover:border-[#FFFFFF] bg-[#121212] hover:bg-[#181818] text-[10px] text-[#A3A3A3] hover:text-[#FFFFFF] transition-colors shrink-0"
        >
          <Database size={11} className="text-[#737373]" />
          <span>RAG</span>
          <span className="text-[#FFFFFF] font-bold">({totalChunksIndexed})</span>
        </button>

        {/* Consolidated Utility Icon Strip (Cloud, Guide, Export, Copilot) */}
        <div className="flex items-center border border-[#262626] bg-[#121212] divide-x divide-[#262626] h-7 shrink-0">
          {/* Cloud Sync Status */}
          {onOpenCloudSync && (
            <button
              type="button"
              onClick={onOpenCloudSync}
              title={`Firebase Cloud Firestore (${isCloudAuthorized ? 'Synced' : 'Local / Offline'})`}
              className="w-7 h-full flex items-center justify-center hover:bg-[#1E1E1E] text-[#888888] hover:text-[#FFFFFF] transition-colors"
            >
              <Cloud size={12} className={isCloudAuthorized ? "text-[#FFFFFF]" : "text-[#555555]"} />
            </button>
          )}

          {/* Interactive App Demo & Contextual Guide (CTRL+S+D+F) */}
          <button
            type="button"
            onClick={() => setGuideModalOpen(true)}
            className={`w-7 h-full flex items-center justify-center transition-colors cursor-pointer ${
              guideModalOpen
                ? 'bg-[#FFFFFF] text-[#000000]'
                : 'hover:bg-[#1E1E1E] text-[#888888] hover:text-[#FFFFFF]'
            }`}
            title="App Demo & Guide (Shortcut: CTRL+S+D+F)"
          >
            <HelpCircle size={12} />
          </button>

          {/* Workspace Exporter */}
          {onOpenExport && (
            <button
              type="button"
              onClick={onOpenExport}
              title="Export Workspace Docs, Python Bridge & Backups"
              className="w-7 h-full flex items-center justify-center hover:bg-[#1E1E1E] text-[#888888] hover:text-[#FFFFFF] transition-colors"
            >
              <Download size={12} />
            </button>
          )}

          {/* AI Copilot Drawer Toggle */}
          {onToggleCopilotDrawer && (
            <button
              type="button"
              onClick={onToggleCopilotDrawer}
              title="Toggle AI Copilot Drawer"
              className={`w-7 h-full flex items-center justify-center transition-colors ${
                isCopilotDrawerOpen
                  ? 'bg-[#FFFFFF] text-[#000000]'
                  : 'hover:bg-[#1E1E1E] text-[#888888] hover:text-[#FFFFFF]'
              }`}
            >
              <Bot size={12} />
            </button>
          )}
        </div>

        {/* Active Member Avatar Monogram */}
        <button
          type="button"
          onClick={onUserClick}
          className="h-7 px-1.5 flex items-center gap-1.5 bg-[#121212] hover:bg-[#181818] border border-[#262626] hover:border-[#404040] text-xs text-[#FFFFFF] transition-colors shrink-0"
          title={`Team Member: ${activeMember.name} (${activeMember.role})`}
        >
          <span className="text-[10px] font-bold text-[#000000] bg-[#FFFFFF] px-1 py-0.2">{activeMember.badge}</span>
          <span className="hidden xl:inline text-xs truncate max-w-[70px]">{activeMember.name}</span>
        </button>

        {/* Native Frameless Window Controls (Desktop Only) */}
        <WindowControls />
      </div>
    </header>
  );
};
