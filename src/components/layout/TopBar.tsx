import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useRAG } from '../../context/RAGContext';
import { Key, Eye, EyeOff, Check, AlertCircle, Search, User, Database } from 'lucide-react';

export const TopBar: React.FC<{
  onUserClick: () => void;
  onOpenCommandPalette: () => void;
}> = ({ onUserClick, onOpenCommandPalette }) => {
  const { activeSpace, activeView, activeMember, geminiKey, setGeminiKey, isKeyLinked } = useWorkspace();
  const { totalChunksIndexed, setRagInspectorOpen } = useRAG();
  const [inputKey, setInputKey] = useState(geminiKey);
  const [showKey, setShowKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLink = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiKey(inputKey);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <header className="h-11 bg-[#0A0A0A] border-b border-[#262626] px-3 flex items-center justify-between select-none shrink-0 z-20">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 font-mono text-xs text-[#A3A3A3]">
        <span className="text-[#FFFFFF] font-bold tracking-wider">WHITESPACE</span>
        <span className="text-[#404040]">/</span>
        <span className="text-[#FFFFFF]">{activeSpace.name.toUpperCase()}</span>
        <span className="text-[#404040]">/</span>
        <span className="text-[#737373] uppercase">{activeView}</span>
      </div>

      {/* Center: Instant Gemini API Key Wiring */}
      <form onSubmit={handleLink} className="flex items-center gap-2 max-w-lg flex-1 justify-center mx-4">
        <div className="relative flex items-center w-full max-w-md">
          <Key size={13} className="absolute left-2.5 text-[#737373] pointer-events-none" />
          <input
            type={showKey ? 'text' : 'password'}
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="PASTE GOOGLE GEMINI API KEY..."
            className="w-full bg-[#121212] border border-[#262626] focus:border-[#FFFFFF] pl-8 pr-16 py-1 text-xs font-mono text-[#FFFFFF] placeholder-[#525252] outline-none transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            title={showKey ? "Mask Key" : "Reveal Key"}
            className="absolute right-2 text-[#737373] hover:text-[#FFFFFF] p-0.5"
          >
            {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>

        <button
          type="submit"
          className="px-2.5 py-1 bg-[#171717] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#404040] hover:border-[#FFFFFF] text-xs font-mono font-bold tracking-wider transition-all shrink-0 flex items-center gap-1"
        >
          {saveSuccess ? (
            <>
              <Check size={12} strokeWidth={3} />
              <span>LINKED</span>
            </>
          ) : (
            'LINK'
          )}
        </button>

        {/* Status Indicator */}
        <div 
          className={`flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-mono shrink-0 transition-colors ${
            isKeyLinked 
              ? 'border-[#FFFFFF] bg-[#141414] text-[#FFFFFF]' 
              : 'border-[#262626] bg-[#0A0A0A] text-[#737373]'
          }`}
          title={isKeyLinked ? "Gemini REST API active" : "Using local in-memory fallback RAG"}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${isKeyLinked ? 'bg-[#FFFFFF] animate-pulse' : 'bg-[#525252]'}`} />
          <span>{isKeyLinked ? 'GEMINI READY' : 'LOCAL RAG ONLY'}</span>
        </div>
      </form>

      {/* Right: Actions & User Quick Profile */}
      <div className="flex items-center gap-2">
        {/* Live RAG Metrics Status Pill */}
        <button
          type="button"
          onClick={() => setRagInspectorOpen(true)}
          title="Open Local RAG Context Inspector (< 1ms In-Memory Retrieval)"
          className="flex items-center gap-1.5 px-2 py-1 border border-[#333333] hover:border-[#FFFFFF] bg-[#121212] hover:bg-[#1A1A1A] text-xs font-mono text-[#A3A3A3] hover:text-[#FFFFFF] transition-all"
        >
          <Database size={12} />
          <span className="hidden sm:inline">RAG: &lt;1ms</span>
          <span className="text-[#FFFFFF] font-bold">({totalChunksIndexed})</span>
        </button>

        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1 bg-[#121212] hover:bg-[#171717] border border-[#262626] hover:border-[#404040] text-xs font-mono text-[#A3A3A3] hover:text-[#FFFFFF] transition-all"
        >
          <Search size={12} />
          <span className="hidden sm:inline">SEARCH</span>
          <kbd className="px-1 py-0.2 bg-[#000000] border border-[#404040] text-[10px] text-[#FFFFFF]">CTRL+K</kbd>
        </button>

        {/* Member Switcher Trigger */}
        <button
          onClick={onUserClick}
          className="flex items-center gap-1.5 pl-2 pr-1.5 py-1 bg-[#121212] hover:bg-[#171717] border border-[#262626] text-xs font-mono text-[#FFFFFF] transition-all"
          title="Switch Active Team Member"
        >
          <span className="text-[11px] font-bold text-[#A3A3A3]">{activeMember.badge}</span>
          <span className="hidden md:inline text-xs truncate max-w-[90px]">{activeMember.name}</span>
        </button>
      </div>
    </header>
  );
};
