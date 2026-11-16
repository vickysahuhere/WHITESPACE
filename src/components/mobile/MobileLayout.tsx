import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { MobileTopBar } from './MobileTopBar';
import { MobileBottomNav } from './MobileBottomNav';
import { ChatView } from '../chat/ChatView';
import { StageView } from '../stage/StageView';
import { SpaceManagerModal } from '../spaces/SpaceManagerModal';
import { MemberManagerModal } from '../members/MemberManagerModal';
import { ModelDiscoveryModal } from '../common/ModelDiscoveryModal';
import { AudioHardwareModal } from '../stage/AudioHardwareModal';
import { useAudio } from '../../context/AudioContext';

export const MobileLayout: React.FC = () => {
  const { activeView } = useWorkspace();
  const { showHardwareModal, setShowHardwareModal } = useAudio();

  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);

  return (
    <div className="h-[100dvh] w-screen bg-[#000000] text-[#FFFFFF] overflow-hidden flex flex-col font-mono select-none">
      {/* 1. Mobile TopBar */}
      <MobileTopBar
        onOpenSpaceModal={() => setShowSpaceModal(true)}
        onOpenMemberModal={() => setShowMemberModal(true)}
        onOpenModelModal={() => setShowModelModal(true)}
      />

      {/* 2. Main Viewport Content (AI Bot or Studio Stage) */}
      <main className="flex-1 overflow-y-auto bg-[#000000] p-2.5 pb-20">
        {activeView === 'stage' ? (
          <StageView />
        ) : (
          <ChatView />
        )}
      </main>

      {/* 3. Mobile Bottom Navigation Dock */}
      <MobileBottomNav
        onOpenAudioSettings={() => setShowHardwareModal(true)}
      />

      {/* --- Mobile Accessible Modals --- */}
      <SpaceManagerModal
        isOpen={showSpaceModal}
        onClose={() => setShowSpaceModal(false)}
      />

      <MemberManagerModal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
      />

      <ModelDiscoveryModal
        isOpen={showModelModal}
        onClose={() => setShowModelModal(false)}
      />

      <AudioHardwareModal
        isOpen={showHardwareModal}
        onClose={() => setShowHardwareModal(false)}
      />
    </div>
  );
};
