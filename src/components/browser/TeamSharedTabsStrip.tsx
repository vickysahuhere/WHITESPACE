import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useBrowser } from '../../context/BrowserContext';
import { BrowserTab, BrowserTabType } from '../../types';
import { Users, Copy, Eye, Globe, Code, Share2, Terminal } from 'lucide-react';

interface TeamSharedTabsStripProps {
  onPreviewTab?: (tab: BrowserTab) => void;
}

export const TeamSharedTabsStrip: React.FC<TeamSharedTabsStripProps> = ({ onPreviewTab }) => {
  const { activeMember, activeSpace, members } = useWorkspace();
  const { getTeamSharedTabs, cloneTab, setActiveTabId } = useBrowser();

  // Filter: space match, isShared=true, and created by a teammate (not active user)
  const sharedTabs = getTeamSharedTabs(activeSpace.id, activeMember.id);

  const getTabIcon = (type: BrowserTabType) => {
    switch (type) {
      case 'github': return <Code size={11} />;
      case 'sandbox': return <Code size={11} />;
      case 'vector': return <Share2 size={11} />;
      case 'rest': return <Terminal size={11} />;
      default: return <Globe size={11} />;
    }
  };

  const getDomain = (url: string) => {
    try {
      if (url.startsWith('http')) {
        return new URL(url).hostname;
      }
      return url;
    } catch {
      return url;
    }
  };

  const handlePreview = (tab: BrowserTab) => {
    if (onPreviewTab) {
      onPreviewTab(tab);
    } else {
      setActiveTabId(tab.id);
    }
  };

  const handleClone = (tab: BrowserTab) => {
    const forked = cloneTab(tab.id, activeMember.id);
    if (forked) {
      setActiveTabId(forked.id);
    }
  };

  if (sharedTabs.length === 0) {
    return (
      <div className="h-8 bg-[#0A0A0A] border-b border-[#1F1F1F] px-3 flex items-center justify-between text-[11px] font-mono text-[#52525B] select-none shrink-0">
        <div className="flex items-center gap-2">
          <Users size={12} className="text-[#3F3F46]" />
          <span className="font-bold text-[#71717A]">TEAM SHARED TABS:</span>
          <span className="text-[#52525B]">NO SHARED TABS IN THIS SPACE // TOGGLE &apos;SHARED&apos; ON ANY TAB TO SHARE</span>
        </div>
        <span className="text-[10px] text-[#52525B]">ISOLATED PERSISTENCE</span>
      </div>
    );
  }

  return (
    <div className="h-9 bg-[#0A0A0A] border-b border-[#1F1F1F] px-3 flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs select-none shrink-0">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#A1A1AA] shrink-0 pr-2 border-r border-[#1F1F1F]">
        <Users size={12} className="text-[#FFFFFF]" />
        <span>TEAM SHARED:</span>
        <span className="bg-[#18181B] text-[#FFFFFF] border border-[#3F3F46] px-1.5 py-0.2 text-[10px]">
          {sharedTabs.length}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {sharedTabs.map(tab => {
          const owner = members.find(m => m.id === tab.userId);
          const ownerBadge = owner ? owner.badge : 'TM';
          const ownerName = owner ? owner.name : tab.userId;

          return (
            <div
              key={tab.id}
              className="flex items-center gap-2 bg-[#111111] border border-[#1F1F1F] hover:border-[#3F3F46] px-2 py-1 text-xs shrink-0 transition-colors"
            >
              {/* Teammate Badge */}
              <span
                title={`Created by ${ownerName}`}
                className="bg-[#000000] border border-[#262626] text-[#FFFFFF] px-1 py-0.2 text-[10px] font-bold"
              >
                {ownerBadge}
              </span>

              {/* Tool Icon & Title */}
              <div className="flex items-center gap-1 text-[#FFFFFF]">
                <span className="text-[#71717A]">{getTabIcon(tab.type)}</span>
                <span className="max-w-[130px] truncate text-[11px] font-medium" title={tab.title}>
                  {tab.title}
                </span>
              </div>

              {/* Domain / Type Badge */}
              <span className="text-[9px] text-[#71717A] bg-[#0A0A0A] px-1 py-0.2 border border-[#1F1F1F] truncate max-w-[100px]">
                {getDomain(tab.url)}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 pl-1 border-l border-[#1F1F1F]">
                <button
                  onClick={() => handlePreview(tab)}
                  title="Preview Teammate Tab"
                  className="px-1.5 py-0.5 bg-[#141414] hover:bg-[#18181B] text-[#A1A1AA] hover:text-[#FFFFFF] text-[10px] border border-[#262626] flex items-center gap-1 transition-colors"
                >
                  <Eye size={10} />
                  <span>PREVIEW</span>
                </button>

                <button
                  onClick={() => handleClone(tab)}
                  title="Fork a copy into your personal tabs"
                  className="px-1.5 py-0.5 bg-[#FFFFFF] hover:bg-[#CCCCCC] text-[#000000] font-bold text-[10px] border border-[#FFFFFF] flex items-center gap-1 transition-colors"
                >
                  <Copy size={10} />
                  <span>CLONE</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
