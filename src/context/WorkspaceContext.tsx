import React, { createContext, useContext, useState, useEffect } from 'react';
import { Space, Member, WorkspaceView, AudioState } from '../types';
import { DEFAULT_SPACES, DEFAULT_MEMBERS } from '../constants/theme';

interface WorkspaceContextType {
  spaces: Space[];
  activeSpace: Space;
  activeSpaceId: string;
  setActiveSpaceId: (id: string) => void;
  addSpace: (name: string, description: string, badge: string, soulMd?: string) => Space;
  updateSpace: (id: string, partial: Partial<Space>) => void;
  deleteSpace: (id: string) => void;
  duplicateSpace: (id: string) => Space | null;

  members: Member[];
  activeMember: Member;
  activeMemberId: string;
  setActiveMemberId: (id: string) => void;
  addMember: (name: string, role: string, hardware: string, instructions: string) => Member;

  activeView: WorkspaceView;
  setActiveView: (view: WorkspaceView) => void;

  audioState: AudioState;
  toggleMic: () => void;
  toggleMute: () => void;
  toggleStage: () => void;
  setVolumeBoost: (boost: number) => void;

  geminiKey: string;
  setGeminiKey: (key: string) => void;
  isKeyLinked: boolean;

  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Spaces State with LocalStorage backing
  const [spaces, setSpaces] = useState<Space[]>(() => {
    try {
      const saved = localStorage.getItem('whitespace_spaces');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load spaces from localStorage', e);
    }
    return DEFAULT_SPACES;
  });

  const [activeSpaceId, setActiveSpaceIdState] = useState<string>(() => {
    return localStorage.getItem('whitespace_active_space') || DEFAULT_SPACES[0].id;
  });

  const setActiveSpaceId = (id: string) => {
    setActiveSpaceIdState(id);
    localStorage.setItem('whitespace_active_space', id);
  };

  useEffect(() => {
    localStorage.setItem('whitespace_spaces', JSON.stringify(spaces));
  }, [spaces]);

  const activeSpace = spaces.find(s => s.id === activeSpaceId) || spaces[0] || DEFAULT_SPACES[0];

  const addSpace = (name: string, description: string, badge: string, soulMd?: string): Space => {
    const newSpace: Space = {
      id: `space_${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      badge: badge.toUpperCase().slice(0, 2),
      description,
      soulMd: soulMd || `# SOUL.MD // ${name.toUpperCase()}\nCustom workspace space.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSpaces(prev => [...prev, newSpace]);
    setActiveSpaceId(newSpace.id);
    return newSpace;
  };

  const updateSpace = (id: string, partial: Partial<Space>) => {
    setSpaces(prev => prev.map(s => s.id === id ? { ...s, ...partial, updatedAt: new Date().toISOString() } : s));
  };

  const deleteSpace = (id: string) => {
    if (spaces.length <= 1) return; // Keep at least one space
    const remaining = spaces.filter(s => s.id !== id);
    setSpaces(remaining);
    if (activeSpaceId === id) {
      setActiveSpaceId(remaining[0].id);
    }
  };

  const duplicateSpace = (id: string): Space | null => {
    const target = spaces.find(s => s.id === id);
    if (!target) return null;
    const cloned: Space = {
      ...target,
      id: `space_${Date.now()}`,
      name: `${target.name} (Copy)`,
      slug: `${target.slug}-copy`,
      badge: `${target.badge}+`.slice(0, 2),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSpaces(prev => [...prev, cloned]);
    setActiveSpaceId(cloned.id);
    return cloned;
  };

  // 2. Members State with LocalStorage backing
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem('whitespace_members');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load members from localStorage', e);
    }
    return DEFAULT_MEMBERS;
  });

  const [activeMemberId, setActiveMemberIdState] = useState<string>(() => {
    return localStorage.getItem('whitespace_active_user') || DEFAULT_MEMBERS[0].id;
  });

  const setActiveMemberId = (id: string) => {
    setActiveMemberIdState(id);
    localStorage.setItem('whitespace_active_user', id);
  };

  useEffect(() => {
    localStorage.setItem('whitespace_members', JSON.stringify(members));
  }, [members]);

  const activeMember = members.find(m => m.id === activeMemberId) || members[0] || DEFAULT_MEMBERS[0];

  const addMember = (name: string, role: string, hardware: string, instructions: string): Member => {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'WC';

    const newMember: Member = {
      id: `user_${Date.now()}`,
      name,
      badge: initials,
      role: role.toUpperCase(),
      hardware,
      instructions,
      isCustom: true
    };
    setMembers(prev => [...prev, newMember]);
    setActiveMemberId(newMember.id);
    return newMember;
  };

  // 3. View Switcher
  const [activeView, setActiveView] = useState<WorkspaceView>('editor');

  // 4. Audio & Voice Pod State
  const [audioState, setAudioState] = useState<AudioState>({
    micActive: false,
    muted: false,
    stageActive: false,
    volumeBoost: 100,
    isMonitoring: false,
    currentDevice: 'Studio Mic / Default Hardware'
  });

  const toggleMic = () => {
    setAudioState(prev => ({ ...prev, micActive: !prev.micActive }));
  };

  const toggleMute = () => {
    setAudioState(prev => ({ ...prev, muted: !prev.muted }));
  };

  const toggleStage = () => {
    setAudioState(prev => {
      const nextStage = !prev.stageActive;
      return {
        ...prev,
        stageActive: nextStage,
        micActive: nextStage ? true : prev.micActive
      };
    });
  };

  const setVolumeBoost = (boost: number) => {
    setAudioState(prev => ({ ...prev, volumeBoost: Math.min(200, Math.max(0, boost)) }));
  };

  // 5. Gemini API Key Wiring
  const [geminiKey, setGeminiKeyState] = useState<string>(() => {
    return localStorage.getItem('whitespace_gemini_key') || '';
  });

  const setGeminiKey = (key: string) => {
    const trimmed = key.trim();
    setGeminiKeyState(trimmed);
    localStorage.setItem('whitespace_gemini_key', trimmed);
  };

  const isKeyLinked = geminiKey.length > 5;

  // 6. Global Command Palette
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <WorkspaceContext.Provider
      value={{
        spaces,
        activeSpace,
        activeSpaceId,
        setActiveSpaceId,
        addSpace,
        updateSpace,
        deleteSpace,
        duplicateSpace,

        members,
        activeMember,
        activeMemberId,
        setActiveMemberId,
        addMember,

        activeView,
        setActiveView,

        audioState,
        toggleMic,
        toggleMute,
        toggleStage,
        setVolumeBoost,

        geminiKey,
        setGeminiKey,
        isKeyLinked,

        commandPaletteOpen,
        setCommandPaletteOpen
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
