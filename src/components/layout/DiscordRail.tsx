import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAudio } from '../../context/AudioContext';
import { WhiteAssistant3D } from '../assistant/WhiteAssistant3D';
import { Plus, Radio, Compass, Sparkles } from 'lucide-react';

export const DiscordRail: React.FC<{ onAddSpaceClick: () => void }> = ({ onAddSpaceClick }) => {
  const { spaces, activeSpaceId, setActiveSpaceId, audioState, toggleStage, activeView, setActiveView } = useWorkspace();
  const { isMicOn } = useAudio();

  const isLive = isMicOn && !audioState.muted;

  return (
    <aside className="w-18 h-screen bg-[#121216] border-r border-[#242430] flex flex-col items-center py-3 select-none z-30 shrink-0">
      {/* 3D Voice Assistant Official App Logo */}
      <div className="relative group w-full flex items-center justify-center mb-3">
        <button 
          onClick={() => setActiveView('editor')}
          className="w-12 h-12 rounded-2xl bg-[#1E1E26] border border-[#2F2F3E] hover:border-[#FFFFFF] hover:bg-[#282834] flex items-center justify-center cursor-pointer transition-all duration-200 group p-1 shadow-md overflow-hidden relative"
          title="White Collars OS // 3D Core Logo"
        >
          <div className="w-full h-full pointer-events-none">
            <WhiteAssistant3D 
              geometryMode="monogram" 
              isAudioActive={isLive} 
              interactive={false} 
              rotationSpeed={1.2}
              className="w-full h-full"
            />
          </div>
          {isLive && (
            <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#1E1E26] animate-pulse" />
          )}
        </button>

        {/* Floating Tooltip */}
        <div className="absolute left-18 ml-2 px-3 py-1.5 bg-[#1E1E26] border border-[#2F2F3E] rounded-xl shadow-2xl text-xs font-semibold text-[#FFFFFF] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center gap-1.5">
          <Sparkles size={13} className="text-emerald-400" />
          <span>WHITE // OS Core</span>
        </div>
      </div>

      <div className="w-9 h-[1px] bg-[#242430] mb-3" />

      {/* Spaces Vertical List with Rounded Buttons */}
      <div className="flex-1 w-full flex flex-col items-center gap-3 overflow-y-auto no-scrollbar px-2">
        {spaces.map(space => {
          const isActive = space.id === activeSpaceId;
          return (
            <div key={space.id} className="relative group w-full flex items-center justify-center">
              {/* Active Space Indicator Pill */}
              <div 
                className={`absolute -left-2 w-1.5 bg-[#FFFFFF] transition-all duration-200 rounded-r-full ${
                  isActive ? 'h-9 opacity-100' : 'h-2 group-hover:h-5 opacity-0 group-hover:opacity-100'
                }`} 
              />
              
              <button
                onClick={() => setActiveSpaceId(space.id)}
                className={`w-12 h-12 flex items-center justify-center border text-xs font-bold transition-all duration-200 shadow-xs ${
                  isActive
                    ? 'rounded-2xl bg-[#FFFFFF] text-[#0B0B0E] border-[#FFFFFF] shadow-sm scale-105'
                    : 'rounded-2xl bg-[#17171D] text-[#D4D4DC] border-[#2F2F3E] hover:rounded-xl hover:text-[#FFFFFF] hover:border-[#454558] hover:bg-[#282834]'
                }`}
              >
                {space.badge}
              </button>

              {/* Floating Tooltip */}
              <div className="absolute left-18 ml-2 px-3 py-1.5 bg-[#1E1E26] border border-[#2F2F3E] rounded-xl shadow-2xl text-xs text-[#FFFFFF] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center gap-2">
                <span className="font-semibold text-[#FFFFFF]">{space.name}</span>
                <span className="text-[#8E8E9E] text-xs">[{space.badge}]</span>
              </div>
            </div>
          );
        })}

        {/* Add Space Button */}
        <div className="relative group w-full flex items-center justify-center mt-1">
          <button
            onClick={onAddSpaceClick}
            className="w-12 h-12 rounded-2xl flex items-center justify-center border border-dashed border-[#2F2F3E] text-[#8E8E9E] hover:text-[#FFFFFF] hover:border-[#FFFFFF] hover:bg-[#282834] hover:rounded-xl transition-all duration-200"
          >
            <Plus size={18} strokeWidth={2.2} />
          </button>
          <div className="absolute left-18 ml-2 px-3 py-1.5 bg-[#1E1E26] border border-[#2F2F3E] rounded-xl shadow-2xl text-xs font-medium text-[#FFFFFF] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Create New Space
          </div>
        </div>
      </div>

      <div className="w-9 h-[1px] bg-[#242430] my-3" />

      {/* Voice/Stage Channel Quick Action */}
      <div className="relative group w-full flex items-center justify-center mb-2">
        <div 
          className={`absolute -left-2 w-1.5 bg-[#FFFFFF] transition-all duration-200 rounded-r-full ${
            audioState.stageActive ? 'h-9 opacity-100' : 'h-2 group-hover:h-5 opacity-0 group-hover:opacity-100'
          }`} 
        />
        <button
          onClick={toggleStage}
          className={`w-12 h-12 flex items-center justify-center border transition-all duration-200 shadow-xs ${
            audioState.stageActive 
              ? 'rounded-2xl bg-[#FFFFFF] text-[#0B0B0E] border-[#FFFFFF] animate-pulse scale-105'
              : 'rounded-2xl bg-[#17171D] text-[#D4D4DC] border-[#2F2F3E] hover:rounded-xl hover:text-[#FFFFFF] hover:border-[#454558] hover:bg-[#282834]'
          }`}
        >
          <Radio size={18} strokeWidth={2} />
        </button>
        <div className="absolute left-18 ml-2 px-3 py-1.5 bg-[#1E1E26] border border-[#2F2F3E] rounded-xl shadow-2xl text-xs text-[#FFFFFF] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center gap-1.5">
          <span className="font-semibold">{audioState.stageActive ? "Leave WebRTC Stage" : "Join WebRTC Stage"}</span>
          <span className="text-[#8E8E9E] text-xs">(510 kbps)</span>
        </div>
      </div>

      {/* Explorer / Workspace Overview */}
      <div className="relative group w-full flex items-center justify-center">
        <div 
          className={`absolute -left-2 w-1.5 bg-[#FFFFFF] transition-all duration-200 rounded-r-full ${
            activeView === 'browser' ? 'h-9 opacity-100' : 'h-2 group-hover:h-5 opacity-0 group-hover:opacity-100'
          }`} 
        />
        <button
          onClick={() => setActiveView(activeView === 'browser' ? 'editor' : 'browser')}
          className={`w-12 h-12 flex items-center justify-center border transition-all duration-200 shadow-xs ${
            activeView === 'browser'
              ? 'rounded-2xl bg-[#FFFFFF] text-[#0B0B0E] border-[#FFFFFF] scale-105'
              : 'rounded-2xl bg-[#17171D] text-[#D4D4DC] border-[#2F2F3E] hover:rounded-xl hover:text-[#FFFFFF] hover:border-[#454558] hover:bg-[#282834]'
          }`}
        >
          <Compass size={18} strokeWidth={2} />
        </button>
        <div className="absolute left-18 ml-2 px-3 py-1.5 bg-[#1E1E26] border border-[#2F2F3E] rounded-xl shadow-2xl text-xs font-medium text-[#FFFFFF] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
          OSS Developer Browser
        </div>
      </div>
    </aside>
  );
};
