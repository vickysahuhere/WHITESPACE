import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useRAG } from '../../context/RAGContext';
import { firebaseSync } from '../../services/firebaseSync';
import { WindowControls } from './WindowControls';
import { Search, Database, Bot, Cloud, Download, HelpCircle, Terminal, Sparkles, BookOpen } from 'lucide-react';

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
      className="h-12 bg-[#121216] border-b border-[#242430] px-4 flex items-center justify-between select-none shrink-0 z-20 gap-4"
      style={{ WebkitAppRegion: 'drag' } as any}
    >
      {/* Left: Refined Breadcrumb with Space Context */}
      <div 
        className="flex items-center gap-2 text-sm text-[#D4D4DC] shrink-0 whitespace-nowrap overflow-hidden max-w-[280px] sm:max-w-[360px]"
        style={{ WebkitAppRegion: 'no-drag' } as any}
      >
        <span className="text-[#FFFFFF] font-bold tracking-tight text-sm">WHITESPACE</span>
        <span className="text-[#454558]">/</span>
        <span className="text-[#D4D4DC] font-medium truncate text-sm" title={activeSpace.name}>
          {activeSpace.name}
        </span>
        <span className="text-[#454558]">/</span>
        <span className="text-[#8E8E9E] uppercase shrink-0 text-xs tracking-wider font-semibold bg-[#1E1E26] px-2 py-0.5 rounded-md border border-[#2F2F3E]">
          {activeView}
        </span>
      </div>

      {/* Center: Command Bar / Quick Search (CTRL+K) with Rounded Pill Design */}
      <div 
        className="flex-1 flex justify-center px-2 min-w-0"
        style={{ WebkitAppRegion: 'no-drag' } as any}
      >
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="w-full max-w-[380px] h-8 flex items-center justify-between px-3.5 bg-[#17171D] hover:bg-[#1E1E26] border border-[#2F2F3E] hover:border-[#454558] rounded-full text-xs text-[#8E8E9E] hover:text-[#FFFFFF] transition-all shadow-xs"
          title="Open Command Palette (CTRL+K)"
        >
          <span className="flex items-center gap-2.5 truncate">
            <Search size={14} className="text-[#8E8E9E] shrink-0" />
            <span className="text-xs truncate">Search commands, docs, tasks...</span>
          </span>
          <kbd className="text-[10px] bg-[#121216] border border-[#2F2F3E] rounded-md px-1.5 py-0.5 text-[#8E8E9E] shrink-0 font-mono font-semibold">CTRL+K</kbd>
        </button>
      </div>

      {/* Right: Unified Status & Tooling Actions */}
      <div 
        className="flex items-center gap-2 shrink-0 whitespace-nowrap"
        style={{ WebkitAppRegion: 'no-drag' } as any}
      >
        {/* Prominent Help & Easy Guide Launcher */}
        <button
          type="button"
          onClick={() => setGuideModalOpen(true)}
          className={`h-8 flex items-center gap-1.5 px-3 rounded-xl border text-xs font-semibold shrink-0 transition-all cursor-pointer ${
            guideModalOpen
              ? 'bg-[#FFFFFF] text-[#0B0B0E] border-[#FFFFFF] shadow-sm'
              : 'border-[#2F2F3E] bg-[#17171D] hover:bg-[#1E1E26] text-[#D4D4DC] hover:text-[#FFFFFF] hover:border-[#454558]'
          }`}
          title="Open App Guide & Interactive Help (F1 or Ctrl+H)"
        >
          <BookOpen size={13} className={guideModalOpen ? "text-[#0B0B0E]" : "text-emerald-400"} />
          <span>GUIDE</span>
        </button>

        {/* Gemini AI Status Pill */}
        <button
          type="button"
          onClick={onOpenModelDiscovery}
          className={`h-8 flex items-center gap-1.5 px-3 rounded-xl border text-xs shrink-0 transition-all cursor-pointer ${
            isKeyLinked 
              ? 'border-[#2F2F3E] hover:border-[#FFFFFF] bg-[#17171D] hover:bg-[#1E1E26] text-[#FFFFFF]' 
              : 'border-[#242430] bg-[#121216] text-[#8E8E9E]'
          }`}
          title="Google Gemini Models & REST API Key"
        >
          <div className={`w-2 h-2 rounded-full ${isKeyLinked ? 'bg-emerald-400 shadow-xs shadow-emerald-400/50 animate-pulse' : 'bg-[#52525B]'}`} />
          <span className="font-semibold text-xs">{isKeyLinked ? 'GEMINI' : 'LOCAL RAG'}</span>
        </button>

        {/* In-Memory Local RAG Metrics */}
        <button
          type="button"
          onClick={() => setRagInspectorOpen(true)}
          title="Local RAG Context Inspector (<1ms retrieval)"
          className="h-8 flex items-center gap-1.5 px-3 rounded-xl border border-[#2F2F3E] hover:border-[#FFFFFF] bg-[#17171D] hover:bg-[#1E1E26] text-xs text-[#D4D4DC] hover:text-[#FFFFFF] transition-all shrink-0"
        >
          <Database size={13} className="text-[#8E8E9E]" />
          <span>RAG</span>
          <span className="text-[#FFFFFF] font-bold">({totalChunksIndexed})</span>
        </button>

        {/* Consolidated Rounded Utility Strip */}
        <div className="flex items-center border border-[#2F2F3E] bg-[#17171D] rounded-xl overflow-hidden divide-x divide-[#2F2F3E] h-8 shrink-0">
          {/* Cloud Sync Status */}
          {onOpenCloudSync && (
            <button
              type="button"
              onClick={onOpenCloudSync}
              title={`Firebase Cloud Firestore (${isCloudAuthorized ? 'Synced' : 'Local / Offline'})`}
              className="w-8 h-full flex items-center justify-center hover:bg-[#282834] text-[#8E8E9E] hover:text-[#FFFFFF] transition-colors"
            >
              <Cloud size={14} className={isCloudAuthorized ? "text-[#FFFFFF]" : "text-[#52525B]"} />
            </button>
          )}

          {/* Workspace Exporter */}
          {onOpenExport && (
            <button
              type="button"
              onClick={onOpenExport}
              title="Export Workspace Docs, Python Bridge & Backups"
              className="w-8 h-full flex items-center justify-center hover:bg-[#282834] text-[#8E8E9E] hover:text-[#FFFFFF] transition-colors"
            >
              <Download size={14} />
            </button>
          )}

          {/* AI Copilot Drawer Toggle */}
          {onToggleCopilotDrawer && (
            <button
              type="button"
              onClick={onToggleCopilotDrawer}
              title="Toggle AI Copilot Drawer"
              className={`w-8 h-full flex items-center justify-center transition-colors ${
                isCopilotDrawerOpen
                  ? 'bg-[#FFFFFF] text-[#0B0B0E]'
                  : 'hover:bg-[#282834] text-[#8E8E9E] hover:text-[#FFFFFF]'
              }`}
            >
              <Bot size={14} />
            </button>
          )}
        </div>

        {/* Active Member Avatar Monogram */}
        <button
          type="button"
          onClick={onUserClick}
          className="h-8 px-2 flex items-center gap-2 bg-[#17171D] hover:bg-[#1E1E26] border border-[#2F2F3E] hover:border-[#FFFFFF] rounded-xl text-xs text-[#FFFFFF] transition-all shrink-0 shadow-xs"
          title={`Team Member: ${activeMember.name} (${activeMember.role})`}
        >
          <span className="text-xs font-bold text-[#0B0B0E] bg-[#FFFFFF] px-1.5 py-0.5 rounded-lg">{activeMember.badge}</span>
          <span className="hidden xl:inline text-xs truncate max-w-[90px] font-medium">{activeMember.name}</span>
        </button>

        {/* Native Frameless Window Controls (Desktop Only) */}
        <WindowControls />
      </div>
    </header>
  );
};
