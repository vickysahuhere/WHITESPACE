import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useRAG } from '../../context/RAGContext';
import { Search, Compass, FileText, Kanban, Radio, Bot, Mic, Volume2, Key, Users, Database, HelpCircle } from 'lucide-react';

interface PaletteItem {
  id: string;
  category: 'SPACES' | 'VIEWS' | 'MEMBERS' | 'ACTIONS';
  title: string;
  badge?: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    spaces,
    setActiveSpaceId,
    activeSpaceId,
    members,
    setActiveMemberId,
    activeMemberId,
    setActiveView,
    toggleMic,
    toggleMute,
    toggleStage,
    audioState,
    setGuideModalOpen
  } = useWorkspace();
  const { setRagInspectorOpen } = useRAG();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keydown Listener for CTRL+K / CMD+K and ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        e.preventDefault();
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Focus input when opened
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  // Aggregate searchable items
  const items: PaletteItem[] = [
    // Spaces
    ...spaces.map(s => ({
      id: `space_${s.id}`,
      category: 'SPACES' as const,
      title: `Switch Space: ${s.name}`,
      badge: s.badge,
      subtitle: s.id === activeSpaceId ? 'Active Space' : s.description,
      icon: <Compass size={14} />,
      action: () => {
        setActiveSpaceId(s.id);
        setCommandPaletteOpen(false);
      }
    })),

    // Views
    {
      id: 'view_editor',
      category: 'VIEWS',
      title: 'Open: Knowledge Docs & Markdown Editor',
      badge: 'DOCS',
      subtitle: 'Notion 3.0 Live Document Editor with Slash Commands',
      icon: <FileText size={14} />,
      action: () => {
        setActiveView('editor');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'view_kanban',
      category: 'VIEWS',
      title: 'Open: OpenClaw Mission Control Kanban',
      badge: 'KANBAN',
      subtitle: '3-Column Autonomous Task Pipeline (DISPATCH AI)',
      icon: <Kanban size={14} />,
      action: () => {
        setActiveView('kanban');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'view_browser',
      category: 'VIEWS',
      title: 'Open: OSS Developer Browser Suite',
      badge: 'DEV',
      subtitle: 'Multi-Tab Browser, GitHub Explorer, Code Sandbox, Vector Board',
      icon: <Compass size={14} />,
      action: () => {
        setActiveView('browser');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'view_stage',
      category: 'VIEWS',
      title: 'Open: Uncompressed Studio Stage',
      badge: 'STAGE',
      subtitle: '48 kHz 510 kbps Stereo Opus Voice & 4K60 Screen Share',
      icon: <Radio size={14} />,
      action: () => {
        setActiveView('stage');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'view_copilot',
      category: 'VIEWS',
      title: 'Open: AI Copilot Drawer',
      badge: 'AI',
      subtitle: 'Sub-millisecond RAG Chat & Task Execution Drawer',
      icon: <Bot size={14} />,
      action: () => {
        setActiveView('copilot');
        setCommandPaletteOpen(false);
      }
    },

    // Members
    ...members.map(m => ({
      id: `member_${m.id}`,
      category: 'MEMBERS' as const,
      title: `Switch User: ${m.name}`,
      badge: m.badge,
      subtitle: m.id === activeMemberId ? 'Active User' : m.role,
      icon: <Users size={14} />,
      action: () => {
        setActiveMemberId(m.id);
        setCommandPaletteOpen(false);
      }
    })),

    // Actions
    {
      id: 'action_guide',
      category: 'ACTIONS',
      title: 'Open: App Demo & Contextual Guide',
      badge: 'CTRL+S+D+F',
      subtitle: 'Complete Page-by-Page Instructions, Feature Diagnostics & Live Tests',
      icon: <HelpCircle size={14} />,
      action: () => {
        setGuideModalOpen(true);
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'action_rag',
      category: 'ACTIONS',
      title: 'Inspect: Local RAG Knowledge Context',
      badge: 'RAG',
      subtitle: 'Sub-millisecond Vector & Keyword Inverted Index Benchmark',
      icon: <Database size={14} />,
      action: () => {
        setRagInspectorOpen(true);
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'action_mic',
      category: 'ACTIONS',
      title: audioState.micActive ? 'Hardware: Mute Microphone' : 'Hardware: Unmute Microphone (MIC ON)',
      badge: 'AUDIO',
      subtitle: audioState.micActive ? 'Mic is currently active' : 'Mic is currently muted',
      icon: <Mic size={14} />,
      action: () => {
        toggleMic();
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'action_deafen',
      category: 'ACTIONS',
      title: audioState.muted ? 'Hardware: Unmute Master Audio' : 'Hardware: Mute Master Audio',
      badge: 'AUDIO',
      subtitle: 'Toggle master sound output',
      icon: <Volume2 size={14} />,
      action: () => {
        toggleMute();
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'action_stage',
      category: 'ACTIONS',
      title: audioState.stageActive ? 'WebRTC: Leave Studio Stage' : 'WebRTC: Join Studio Stage',
      badge: 'RTC',
      subtitle: '510 kbps stereo voice & 60fps screen stage',
      icon: <Radio size={14} />,
      action: () => {
        toggleStage();
        setActiveView('stage');
        setCommandPaletteOpen(false);
      }
    }
  ];

  // Fuzzy filter
  const filteredItems = items.filter(item => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.badge && item.badge.toLowerCase().includes(q)) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );
  });

  // Handle Keyboard Arrows & Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div 
      onClick={() => setCommandPaletteOpen(false)}
      className="fixed inset-0 bg-[#000000]/85 backdrop-blur-xs flex items-start justify-center pt-24 z-50 p-4 select-none font-mono"
    >
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xl bg-[#0F0F0F] border border-[#404040] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Top Search Input */}
        <div className="flex items-center px-3 py-3 border-b border-[#262626] bg-[#0A0A0A]">
          <Search size={15} className="text-[#A3A3A3] mr-2 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="TYPE A COMMAND OR SEARCH (SPACES, VIEWS, ACTIONS)..."
            className="w-full bg-transparent text-xs text-[#FFFFFF] placeholder-[#525252] outline-none font-mono"
          />
          <kbd className="px-1.5 py-0.5 bg-[#171717] border border-[#262626] text-[10px] text-[#A3A3A3] shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-1.5 space-y-0.5">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#737373]">
              NO MATCHING COMMANDS FOUND FOR "{query.toUpperCase()}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2 text-xs cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold'
                      : 'bg-transparent text-[#A3A3A3] border-transparent hover:bg-[#141414] hover:text-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={isSelected ? 'text-[#000000]' : 'text-[#737373]'}>
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate tracking-tight">{item.title}</div>
                      {item.subtitle && (
                        <div className={`text-[10px] truncate ${isSelected ? 'text-[#333333]' : 'text-[#737373]'}`}>
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[9px] border font-bold ${
                        isSelected 
                          ? 'border-[#000000] bg-[#000000] text-[#FFFFFF]' 
                          : 'border-[#262626] bg-[#171717] text-[#A3A3A3]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    <span className={`text-[9px] ${isSelected ? 'text-[#333333]' : 'text-[#525252]'}`}>
                      {item.category}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-3 py-1.5 bg-[#0A0A0A] border-t border-[#262626] flex items-center justify-between text-[10px] text-[#737373]">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 border border-[#262626]">↑</kbd> <kbd className="px-1 border border-[#262626]">↓</kbd> NAVIGATE</span>
            <span><kbd className="px-1 border border-[#262626]">ENTER</kbd> SELECT</span>
            <span><kbd className="px-1 border border-[#262626]">ESC</kbd> CLOSE</span>
          </div>
          <span>WHITE COLLARS // FAST PALETTE</span>
        </div>
      </div>
    </div>
  );
};
