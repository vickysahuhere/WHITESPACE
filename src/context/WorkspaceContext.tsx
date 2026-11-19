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
  updateMember: (id: string, partial: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  duplicateMember: (id: string) => Member | null;

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

  guideModalOpen: boolean;
  setGuideModalOpen: (open: boolean) => void;
  toggleGuideModal: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Spaces State with LocalStorage backing & legacy space ID normalization
  const [spaces, setSpaces] = useState<Space[]>(() => {
    try {
      const saved = localStorage.getItem('whitespace_spaces');
      if (saved) {
        const parsed: Space[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize legacy space IDs
          return parsed.map(s => {
            if (s.id === 'space_wc_core') return { ...s, id: 'wc-core', slug: 'wc-core' };
            if (s.id === 'space_signbridge') return { ...s, id: 'signbridge', slug: 'signbridge' };
            if (s.id === 'space_mai_reads') return { ...s, id: 'mai-reads', slug: 'mai-reads' };
            return s;
          });
        }
      }
    } catch (e) {
      console.error('Failed to load spaces from localStorage', e);
    }
    return DEFAULT_SPACES;
  });

  const [activeSpaceId, setActiveSpaceIdState] = useState<string>(() => {
    const saved = localStorage.getItem('whitespace_active_space');
    if (saved === 'space_wc_core') return 'wc-core';
    if (saved === 'space_signbridge') return 'signbridge';
    if (saved === 'space_mai_reads') return 'mai-reads';
    return saved || DEFAULT_SPACES[0].id;
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

  const updateMember = (id: string, partial: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...partial } : m));
  };

  const deleteMember = (id: string) => {
    if (members.length <= 1) return;
    const remaining = members.filter(m => m.id !== id);
    setMembers(remaining);
    if (activeMemberId === id) {
      setActiveMemberId(remaining[0].id);
    }
  };

  const duplicateMember = (id: string): Member | null => {
    const target = members.find(m => m.id === id);
    if (!target) return null;
    const cloned: Member = {
      ...target,
      id: `user_${Date.now()}`,
      name: `${target.name} (Clone)`,
      badge: `${target.badge}+`.slice(0, 2),
      isCustom: true
    };
    setMembers(prev => [...prev, cloned]);
    setActiveMemberId(cloned.id);
    return cloned;
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
    return localStorage.getItem('whitespace_gemini_key') || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
  });

  const setGeminiKey = (key: string) => {
    const trimmed = key.trim();
    setGeminiKeyState(trimmed);
    localStorage.setItem('whitespace_gemini_key', trimmed);
  };

  const isKeyLinked = geminiKey.length > 5;

  // 6. Global Command Palette
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // 7. Interactive App Demo & Contextual Guide
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const toggleGuideModal = () => setGuideModalOpen(prev => !prev);

  // Global Keydown Listener for easy guide opening (F1 or Ctrl+H or chord)
  useEffect(() => {
    const heldKeys = new Set<string>();
    let chordBuffer: string[] = [];
    let chordTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 0. Easy Single-Key Help: F1 or Ctrl+H
      if (e.key === 'F1' || ((e.ctrlKey || e.metaKey) && (e.key === 'h' || e.key === 'H'))) {
        e.preventDefault();
        setGuideModalOpen(prev => !prev);
        return;
      }

      const key = e.key.toLowerCase();
      heldKeys.add(key);

      // Prevent default save-page if ctrl is held with 's' to allow smooth typing of s+d+f
      if ((e.ctrlKey || e.metaKey) && key === 's') {
        e.preventDefault();
      }

      // 1. Simultaneous trigger: Ctrl held + 's', 'd', 'f' all held
      if (e.ctrlKey || e.metaKey) {
        if (heldKeys.has('s') && heldKeys.has('d') && heldKeys.has('f')) {
          e.preventDefault();
          setGuideModalOpen(prev => !prev);
          heldKeys.clear();
          chordBuffer = [];
          return;
        }
      }

      // 2. Chord / Sequential trigger: user presses s, then d, then f while Ctrl is active
      if (e.ctrlKey || e.metaKey || chordBuffer.length > 0) {
        if (key === 's' || key === 'd' || key === 'f') {
          chordBuffer.push(key);
          if (chordTimeout) clearTimeout(chordTimeout);
          chordTimeout = setTimeout(() => {
            chordBuffer = [];
          }, 1500);

          const sequence = chordBuffer.slice(-3).join('');
          if (sequence === 'sdf' || sequence === 'sfd' || sequence === 'dsf') {
            e.preventDefault();
            setGuideModalOpen(prev => !prev);
            chordBuffer = [];
            heldKeys.clear();
            return;
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      heldKeys.delete(e.key.toLowerCase());
    };

    const handleBlur = () => {
      heldKeys.clear();
      chordBuffer = [];
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      if (chordTimeout) clearTimeout(chordTimeout);
    };
  }, []);

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
        updateMember,
        deleteMember,
        duplicateMember,

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
        setCommandPaletteOpen,

        guideModalOpen,
        setGuideModalOpen,
        toggleGuideModal
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
