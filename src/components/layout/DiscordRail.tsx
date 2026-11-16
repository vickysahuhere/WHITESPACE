import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Plus, Radio, Compass } from 'lucide-react';

export const DiscordRail: React.FC<{ onAddSpaceClick: () => void }> = ({ onAddSpaceClick }) => {
  const { spaces, activeSpaceId, setActiveSpaceId, audioState, toggleStage, activeView, setActiveView } = useWorkspace();

  return (
    <aside className="w-16 h-screen bg-[#0A0A0A] border-r border-[#262626] flex flex-col items-center py-3 select-none z-30 shrink-0">
      {/* Brand Header Badge */}
      <div 
        onClick={() => setActiveView('editor')}
        title="White Collars OS"
        className="w-11 h-11 bg-[#000000] border border-[#FFFFFF] hover:bg-[#171717] flex items-center justify-center cursor-pointer transition-colors mb-3 group"
      >
        <span className="font-mono text-sm font-bold tracking-tighter text-[#FFFFFF] group-hover:scale-105 transition-transform">
          WC
        </span>
      </div>

      <div className="w-8 h-[1px] bg-[#262626] mb-3" />

      {/* Spaces Vertical List */}
      <div className="flex-1 w-full flex flex-col items-center gap-2 overflow-y-auto no-scrollbar">
        {spaces.map(space => {
          const isActive = space.id === activeSpaceId;
          return (
            <div key={space.id} className="relative group w-full flex items-center justify-center">
              {/* Active Space Indicator Pill */}
              <div 
                className={`absolute left-0 w-1 bg-[#FFFFFF] transition-all duration-150 rounded-r ${
                  isActive ? 'h-8' : 'h-2 group-hover:h-5 opacity-0 group-hover:opacity-100'
                }`} 
              />
              
              <button
                onClick={() => setActiveSpaceId(space.id)}
                title={`${space.name} (${space.description})`}
                className={`w-11 h-11 flex items-center justify-center border font-mono text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                    : 'bg-[#121212] text-[#A3A3A3] border-[#262626] hover:text-[#FFFFFF] hover:border-[#404040] hover:bg-[#171717]'
                }`}
              >
                {space.badge}
              </button>
            </div>
          );
        })}

        {/* Add Space Button */}
        <button
          onClick={onAddSpaceClick}
          title="Create New Space"
          className="w-11 h-11 flex items-center justify-center border border-dashed border-[#404040] text-[#A3A3A3] hover:text-[#FFFFFF] hover:border-[#FFFFFF] hover:bg-[#171717] transition-all mt-1"
        >
          <Plus size={16} strokeWidth={2} />
        </button>
      </div>

      <div className="w-8 h-[1px] bg-[#262626] my-3" />

      {/* Voice/Stage Channel Quick Action */}
      <div className="relative group flex items-center justify-center">
        <button
          onClick={toggleStage}
          title={audioState.stageActive ? "Leave WebRTC Stage" : "Join WebRTC Stage Channel"}
          className={`w-11 h-11 flex items-center justify-center border transition-all ${
            audioState.stageActive 
              ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] animate-pulse'
              : 'bg-[#121212] text-[#A3A3A3] border-[#262626] hover:text-[#FFFFFF] hover:border-[#404040]'
          }`}
        >
          <Radio size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Explorer / Workspace Overview */}
      <div className="mt-2 flex items-center justify-center">
        <button
          onClick={() => setActiveView(activeView === 'browser' ? 'editor' : 'browser')}
          title="Toggle OSS Developer Browser"
          className={`w-11 h-11 flex items-center justify-center border transition-all ${
            activeView === 'browser'
              ? 'bg-[#262626] text-[#FFFFFF] border-[#FFFFFF]'
              : 'bg-[#121212] text-[#A3A3A3] border-[#262626] hover:text-[#FFFFFF] hover:border-[#404040]'
          }`}
        >
          <Compass size={16} strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
};
