import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useBrowser } from '../../context/BrowserContext';
import { BrowserTabType, BrowserTab } from '../../types';
import { 
  Globe, 
  Plus, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Lock, 
  Users, 
  Code, 
  Share2, 
  Terminal, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const BrowserView: React.FC = () => {
  const { activeMember, activeSpace } = useWorkspace();
  const { 
    activeTab, 
    activeTabId, 
    setActiveTabId, 
    getUserTabs, 
    createTab, 
    closeTab, 
    toggleTabSharing, 
    navigateTab, 
    goBack, 
    goForward 
  } = useBrowser();

  const userTabs = getUserTabs(activeMember.id, activeSpace.id);

  const [urlInput, setUrlInput] = useState(activeTab?.url || 'https://docs.github.com');
  const [showNewTabMenu, setShowNewTabMenu] = useState(false);

  useEffect(() => {
    if (activeTab) {
      setUrlInput(activeTab.url);
    }
  }, [activeTab?.id, activeTab?.url]);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTab || !urlInput.trim()) return;
    navigateTab(activeTab.id, urlInput);
  };

  const handleCreateNew = (type: BrowserTabType) => {
    createTab(activeMember.id, activeSpace.id, { type });
    setShowNewTabMenu(false);
  };

  const getTabIcon = (type: BrowserTabType) => {
    switch (type) {
      case 'github': return <Code size={12} />;
      case 'sandbox': return <Code size={12} />;
      case 'vector': return <Share2 size={12} />;
      case 'rest': return <Terminal size={12} />;
      default: return <Globe size={12} />;
    }
  };

  if (!activeTab || userTabs.length === 0) {
    return (
      <div className="h-full border border-[#262626] bg-[#0A0A0A] flex flex-col items-center justify-center font-mono select-none p-8">
        <Globe size={40} className="text-[#333333] mb-4" />
        <h2 className="text-sm font-bold text-[#FFFFFF] tracking-wider mb-2 uppercase">
          NO BROWSER TABS OPEN FOR {activeMember.name.toUpperCase()}
        </h2>
        <p className="text-xs text-[#737373] max-w-sm text-center mb-6 leading-relaxed">
          Initialize a personal developer tab. All new tabs default to PRIVATE (ONLY ME).
        </p>
        <button
          onClick={() => createTab(activeMember.id, activeSpace.id, { type: 'web', url: 'https://docs.github.com', title: 'GitHub Docs' })}
          className="px-4 py-2 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#A3A3A3] flex items-center gap-2"
        >
          <Plus size={14} />
          <span>OPEN NEW WEB TAB</span>
        </button>
      </div>
    );
  }

  const canGoBack = (activeTab.historyIndex ?? 0) > 0;
  const canGoForward = (activeTab.historyIndex ?? 0) < (activeTab.history?.length ?? 1) - 1;

  return (
    <div className="h-full border border-[#262626] bg-[#0A0A0A] flex flex-col font-mono select-none overflow-hidden relative">
      {/* 1. Personal Tabs Strip */}
      <div className="h-10 bg-[#0C0C0C] border-b border-[#262626] px-2 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
        {userTabs.map(tab => {
          const isActive = tab.id === activeTab.id;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`group max-w-[200px] h-8 px-2.5 flex items-center gap-2 border-t border-x cursor-pointer transition-all shrink-0 text-xs ${
                isActive
                  ? 'bg-[#171717] text-[#FFFFFF] border-[#404040] font-bold border-b-transparent'
                  : 'bg-[#0E0E0E] text-[#737373] border-transparent hover:text-[#FFFFFF] hover:bg-[#141414]'
              }`}
            >
              <span className={isActive ? 'text-[#FFFFFF]' : 'text-[#555555]'}>
                {getTabIcon(tab.type)}
              </span>

              <span className="truncate flex-1 text-[11px]">{tab.title}</span>

              {/* Privacy Badge */}
              <span 
                title={tab.isShared ? "SHARED WITH TEAM (Visible in team shared strip)" : "PRIVATE (ONLY ME)"} 
                className={`p-0.5 ${tab.isShared ? 'text-[#FFFFFF]' : 'text-[#555555]'}`}
              >
                {tab.isShared ? <Users size={10} /> : <Lock size={10} />}
              </span>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:text-[#FFFFFF] text-[#737373] p-0.5"
                title="Close Tab"
              >
                <X size={11} />
              </button>
            </div>
          );
        })}

        {/* New Tab Button */}
        <div className="relative">
          <button
            onClick={() => setShowNewTabMenu(!showNewTabMenu)}
            title="Open New Tab"
            className="w-7 h-7 flex items-center justify-center border border-[#262626] hover:border-[#FFFFFF] bg-[#121212] hover:bg-[#1A1A1A] text-[#A3A3A3] hover:text-[#FFFFFF] text-xs transition-colors ml-1"
          >
            <Plus size={13} />
          </button>

          {/* New Tab Dropdown Menu */}
          {showNewTabMenu && (
            <div className="absolute top-8 left-0 z-50 w-52 bg-[#0E0E0E] border border-[#404040] shadow-2xl p-1 text-xs space-y-0.5">
              <div className="p-1.5 text-[9px] text-[#737373] border-b border-[#262626] uppercase font-bold">
                SELECT TAB TYPE
              </div>
              <button
                onClick={() => handleCreateNew('web')}
                className="w-full p-1.5 text-left text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#1C1C1C] flex items-center gap-2"
              >
                <Globe size={12} />
                <span>External Web Viewport</span>
              </button>
              <button
                onClick={() => handleCreateNew('github')}
                className="w-full p-1.5 text-left text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#1C1C1C] flex items-center gap-2"
              >
                <Code size={12} />
                <span>GitHub OSS Explorer</span>
              </button>
              <button
                onClick={() => handleCreateNew('sandbox')}
                className="w-full p-1.5 text-left text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#1C1C1C] flex items-center gap-2"
              >
                <Code size={12} />
                <span>Code Sandbox (HTML/JS)</span>
              </button>
              <button
                onClick={() => handleCreateNew('vector')}
                className="w-full p-1.5 text-left text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#1C1C1C] flex items-center gap-2"
              >
                <Share2 size={12} />
                <span>Vector Architecture Board</span>
              </button>
              <button
                onClick={() => handleCreateNew('rest')}
                className="w-full p-1.5 text-left text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#1C1C1C] flex items-center gap-2"
              >
                <Terminal size={12} />
                <span>REST API Tester</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Navigation & Privacy Controls Bar */}
      <div className="h-11 bg-[#0F0F0F] border-b border-[#262626] px-3 flex items-center justify-between gap-3 shrink-0">
        {/* Navigation History Buttons */}
        <div className="flex items-center gap-1 text-[#A3A3A3]">
          <button
            onClick={() => goBack(activeTab.id)}
            disabled={!canGoBack}
            title="Go Back"
            className={`p-1.5 border border-[#262626] transition-colors ${
              canGoBack ? 'hover:text-[#FFFFFF] hover:border-[#404040]' : 'opacity-30 cursor-not-allowed'
            }`}
          >
            <ArrowLeft size={13} />
          </button>
          <button
            onClick={() => goForward(activeTab.id)}
            disabled={!canGoForward}
            title="Go Forward"
            className={`p-1.5 border border-[#262626] transition-colors ${
              canGoForward ? 'hover:text-[#FFFFFF] hover:border-[#404040]' : 'opacity-30 cursor-not-allowed'
            }`}
          >
            <ArrowRight size={13} />
          </button>
          <button
            onClick={() => navigateTab(activeTab.id, activeTab.url)}
            title="Reload Tab"
            className="p-1.5 border border-[#262626] hover:text-[#FFFFFF] hover:border-[#404040] transition-colors"
          >
            <RotateCw size={13} />
          </button>
        </div>

        {/* Address URL Bar */}
        <form onSubmit={handleNavigate} className="flex-1 max-w-2xl relative flex items-center">
          <input
            type="text"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="ENTER HTTPS:// URL OR DEVELOPER PROTOCOL..."
            className="w-full bg-[#000000] border border-[#262626] focus:border-[#FFFFFF] px-3 py-1.5 text-xs text-[#FFFFFF] font-mono outline-none"
          />
        </form>

        {/* Privacy Toggle Button (Selective Tab Privacy) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleTabSharing(activeTab.id)}
            title={activeTab.isShared ? "Click to make this tab PRIVATE (Only you)" : "Click to SHARE this tab with your team"}
            className={`px-3 py-1 text-xs font-bold border flex items-center gap-1.5 transition-all ${
              activeTab.isShared
                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                : 'bg-[#121212] text-[#A3A3A3] border-[#333333] hover:border-[#FFFFFF] hover:text-[#FFFFFF]'
            }`}
          >
            {activeTab.isShared ? (
              <>
                <Users size={12} />
                <span>TAB: SHARED WITH TEAM</span>
              </>
            ) : (
              <>
                <Lock size={12} />
                <span>PRIVATE (ONLY ME)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Viewport Container */}
      <div className="flex-1 bg-[#050505] overflow-hidden flex flex-col">
        {activeTab.type === 'web' ? (
          <div className="flex-1 flex flex-col p-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#262626] text-xs text-[#737373]">
              <div className="flex items-center gap-2">
                <Globe size={13} />
                <span className="font-bold text-[#FFFFFF]">{activeTab.url}</span>
              </div>
              <a 
                href={activeTab.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-[#FFFFFF]"
              >
                <span>OPEN EXTERNAL</span>
                <ExternalLink size={11} />
              </a>
            </div>
            <div className="flex-1 mt-2 border border-[#262626] bg-[#000000] relative overflow-hidden">
              <iframe
                key={activeTab.url}
                src={activeTab.url}
                title={activeTab.title}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6 flex flex-col items-center justify-center font-mono">
            <div className="border border-[#262626] bg-[#0D0D0D] p-6 max-w-lg text-center space-y-3">
              <div className="w-10 h-10 mx-auto bg-[#000000] border border-[#404040] flex items-center justify-center text-[#FFFFFF]">
                {getTabIcon(activeTab.type)}
              </div>
              <div className="text-xs font-bold text-[#FFFFFF] tracking-wider uppercase">
                {activeTab.title} // [{activeTab.type.toUpperCase()}]
              </div>
              <p className="text-[11px] text-[#737373] leading-relaxed">
                Developer suite tool loaded in workspace session for {activeMember.name}. State is {activeTab.isShared ? 'SHARED WITH TEAM' : 'PRIVATE TO YOU'}.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
