import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Compass, Sparkles, User, Layers } from 'lucide-react';

interface MobileTopBarProps {
  onOpenSpaceModal: () => void;
  onOpenMemberModal: () => void;
  onOpenModelModal: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  onOpenSpaceModal,
  onOpenMemberModal,
  onOpenModelModal
}) => {
  const { activeSpace, activeView, activeMember, isKeyLinked } = useWorkspace();

  return (
    <header 
      className="h-12 bg-[#0A0A0A] border-b border-[#262626] px-3 flex items-center justify-between select-none shrink-0 z-30 font-mono text-xs pt-[env(safe-area-inset-top)]"
    >
      {/* Left: Active Space Badge & Switcher */}
      <button
        onClick={onOpenSpaceModal}
        className="flex items-center gap-1.5 p-1 bg-[#121212] hover:bg-[#181818] border border-[#262626] text-left shrink-0 active:scale-95 transition-transform"
        title="Switch or Manage Spaces"
      >
        <span className="text-[10px] font-bold bg-[#FFFFFF] text-[#000000] px-1.5 py-0.2">
          {activeSpace.badge}
        </span>
        <span className="text-[11px] font-bold text-[#FFFFFF] truncate max-w-[100px]">
          {activeSpace.name.toUpperCase()}
        </span>
      </button>

      {/* Center: Active View Tag */}
      <div className="flex items-center gap-1 text-[10px] text-[#A3A3A3] tracking-widest uppercase">
        <span className="text-[#555555]">VIEW //</span>
        <span className="text-[#FFFFFF] font-bold">
          {activeView === 'stage' ? '02 STUDIO' : '01 AI BOT'}
        </span>
      </div>

      {/* Right: Quick Member Profile & Gemini Status */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Gemini AI Status Indicator */}
        <button
          onClick={onOpenModelModal}
          className={`flex items-center gap-1 px-1.5 py-1 border text-[10px] ${
            isKeyLinked 
              ? 'border-[#333333] bg-[#121212] text-[#FFFFFF]' 
              : 'border-[#262626] bg-[#0A0A0A] text-[#737373]'
          }`}
          title="Google Gemini Models & Key"
        >
          <div className={`w-1.5 h-1.5 rounded-full ${isKeyLinked ? 'bg-[#FFFFFF] animate-pulse' : 'bg-[#525252]'}`} />
          <span className="text-[9px]">{isKeyLinked ? 'AI' : 'LOCAL'}</span>
        </button>

        {/* Member Avatar Badge */}
        <button
          onClick={onOpenMemberModal}
          className="flex items-center gap-1 px-2 py-1 bg-[#121212] border border-[#262626] active:scale-95 transition-transform"
          title="Switch Active Team Member"
        >
          <span className="text-[10px] font-bold text-[#FFFFFF]">{activeMember.badge}</span>
        </button>
      </div>
    </header>
  );
};
