import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useWorkspace } from './WorkspaceContext';
import { useDocuments } from './DocumentContext';
import { BrowserTab, BrowserTabType, Document } from '../types';

const TABS_STORAGE_KEY = 'whitespace_browser_tabs_v1';
const ACTIVE_TAB_STORAGE_KEY = 'whitespace_active_tab_id_v1';

interface BrowserContextType {
  tabs: BrowserTab[];
  activeTabId: string | null;
  activeTab: BrowserTab | null;
  setActiveTabId: (id: string | null) => void;
  getUserTabs: (userId: string, spaceId: string) => BrowserTab[];
  getTeamSharedTabs: (spaceId: string, excludeUserId?: string) => BrowserTab[];
  createTab: (userId: string, spaceId: string, options?: Partial<BrowserTab>) => BrowserTab;
  updateTab: (tabId: string, partial: Partial<BrowserTab>) => void;
  closeTab: (tabId: string) => void;
  toggleTabSharing: (tabId: string) => void;
  navigateTab: (tabId: string, url: string) => void;
  goBack: (tabId: string) => void;
  goForward: (tabId: string) => void;
  cloneTab: (tabId: string, targetUserId: string) => BrowserTab | null;
  indexTabToSpace: (tab: BrowserTab) => Document;
}

const BrowserContext = createContext<BrowserContextType | null>(null);

function createDefaultStarterTabs(): BrowserTab[] {
  const now = new Date().toISOString();
  return [
    // Vicky Sahu's Tabs in wc-core
    {
      id: 'tab-vs-web-1',
      userId: 'user_vicky',
      spaceId: 'wc-core',
      title: 'GitHub Docs // REST API',
      url: 'https://docs.github.com/en/rest',
      type: 'web',
      isShared: false,
      history: ['https://docs.github.com/en/rest'],
      historyIndex: 0,
      createdAt: now
    },
    {
      id: 'tab-vs-github-1',
      userId: 'user_vicky',
      spaceId: 'wc-core',
      title: 'GitHub OSS Explorer',
      url: 'github://explore',
      type: 'github',
      isShared: false,
      history: ['github://explore'],
      historyIndex: 0,
      createdAt: now
    },
    {
      id: 'tab-vs-sandbox-1',
      userId: 'user_vicky',
      spaceId: 'wc-core',
      title: 'HTML/JS Code Sandbox',
      url: 'sandbox://main',
      type: 'sandbox',
      isShared: false,
      history: ['sandbox://main'],
      historyIndex: 0,
      createdAt: now
    },
    {
      id: 'tab-vs-vector-1',
      userId: 'user_vicky',
      spaceId: 'wc-core',
      title: 'Vector Architecture Board',
      url: 'vector://canvas',
      type: 'vector',
      isShared: false,
      history: ['vector://canvas'],
      historyIndex: 0,
      createdAt: now
    },
    {
      id: 'tab-vs-rest-1',
      userId: 'user_vicky',
      spaceId: 'wc-core',
      title: 'Hoppscotch REST Tester',
      url: 'rest://client',
      type: 'rest',
      isShared: false,
      history: ['rest://client'],
      historyIndex: 0,
      createdAt: now
    },

    // Teammate Shared Tab: Arnav Suryavanshi (Shared with team!)
    {
      id: 'tab-as-shared-1',
      userId: 'user_arnav',
      spaceId: 'wc-core',
      title: 'Web Audio API // Opus 510kbps Specs',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API',
      type: 'web',
      isShared: true, // SHARED WITH TEAM!
      history: ['https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API'],
      historyIndex: 0,
      createdAt: now
    },

    // Teammate Shared Tab: Lakshay Arora (Shared with team!)
    {
      id: 'tab-la-shared-1',
      userId: 'user_lakshay',
      spaceId: 'wc-core',
      title: 'Three.js Geodesic Wireframe Docs',
      url: 'https://threejs.org/docs/#api/en/geometries/IcosahedronGeometry',
      type: 'web',
      isShared: true, // SHARED WITH TEAM!
      history: ['https://threejs.org/docs/#api/en/geometries/IcosahedronGeometry'],
      historyIndex: 0,
      createdAt: now
    }
  ];
}

function getInitialTabs(): BrowserTab[] {
  try {
    const raw = localStorage.getItem(TABS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed reading browser tabs from storage:', err);
  }
  return createDefaultStarterTabs();
}

export const BrowserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeMember, activeSpace } = useWorkspace();
  const { createDocument } = useDocuments();

  const [tabs, setTabs] = useState<BrowserTab[]>(getInitialTabs);
  const [activeTabId, setActiveTabIdState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ACTIVE_TAB_STORAGE_KEY) || (tabs[0]?.id ?? null);
    } catch {
      return null;
    }
  });

  // Save tabs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(tabs));
    } catch (err) {
      console.error('Failed saving browser tabs to storage:', err);
    }
  }, [tabs]);

  // Save activeTabId
  const setActiveTabId = useCallback((id: string | null) => {
    setActiveTabIdState(id);
    try {
      if (id) {
        localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, id);
      } else {
        localStorage.removeItem(ACTIVE_TAB_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  const getUserTabs = useCallback((userId: string, spaceId: string): BrowserTab[] => {
    return tabs.filter(t => t.userId === userId && t.spaceId === spaceId);
  }, [tabs]);

  const getTeamSharedTabs = useCallback((spaceId: string, excludeUserId?: string): BrowserTab[] => {
    return tabs.filter(t => t.spaceId === spaceId && t.isShared && (!excludeUserId || t.userId !== excludeUserId));
  }, [tabs]);

  // Auto-resolve activeTab for current user and space
  const userTabs = useMemo(() => {
    if (!activeMember || !activeSpace) return [];
    return getUserTabs(activeMember.id, activeSpace.id);
  }, [activeMember, activeSpace, getUserTabs]);

  const activeTab = useMemo(() => {
    if (!activeTabId) return userTabs[0] || null;
    return tabs.find(t => t.id === activeTabId) || userTabs[0] || null;
  }, [tabs, activeTabId, userTabs]);

  // Align active tab when user or space switches
  useEffect(() => {
    if (userTabs.length > 0) {
      const match = userTabs.find(t => t.id === activeTabId);
      if (!match) {
        setActiveTabId(userTabs[0].id);
      }
    }
  }, [activeMember.id, activeSpace.id, userTabs, activeTabId, setActiveTabId]);

  const createTab = useCallback((
    userId: string,
    spaceId: string,
    options: Partial<BrowserTab> = {}
  ): BrowserTab => {
    const now = new Date().toISOString();
    const type: BrowserTabType = options.type || 'web';
    const defaultUrl = options.url || (
      type === 'github' ? 'github://explore' :
      type === 'sandbox' ? 'sandbox://main' :
      type === 'vector' ? 'vector://canvas' :
      type === 'rest' ? 'rest://client' :
      'https://docs.github.com'
    );
    const defaultTitle = options.title || (
      type === 'github' ? 'GitHub OSS Explorer' :
      type === 'sandbox' ? 'Code Sandbox' :
      type === 'vector' ? 'Vector Board' :
      type === 'rest' ? 'REST API Tester' :
      'New Tab'
    );

    const newTab: BrowserTab = {
      id: `tab-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      spaceId,
      title: defaultTitle,
      url: defaultUrl,
      type,
      isShared: false, // Default is strictly PRIVATE (ONLY ME)
      history: [defaultUrl],
      historyIndex: 0,
      data: options.data,
      createdAt: now,
      ...options
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    return newTab;
  }, [setActiveTabId]);

  const updateTab = useCallback((tabId: string, partial: Partial<BrowserTab>) => {
    setTabs(prev => prev.map(t => t.id === tabId ? { ...t, ...partial } : t));
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const remaining = prev.filter(t => t.id !== tabId);
      if (activeTabId === tabId) {
        const next = remaining.find(t => t.userId === activeMember.id && t.spaceId === activeSpace.id);
        setActiveTabId(next ? next.id : null);
      }
      return remaining;
    });
  }, [activeTabId, activeMember.id, activeSpace.id, setActiveTabId]);

  const toggleTabSharing = useCallback((tabId: string) => {
    setTabs(prev => prev.map(t => {
      if (t.id === tabId) {
        return { ...t, isShared: !t.isShared };
      }
      return t;
    }));
  }, []);

  const navigateTab = useCallback((tabId: string, url: string) => {
    setTabs(prev => prev.map(t => {
      if (t.id === tabId) {
        let cleanUrl = url.trim();
        if (!cleanUrl.includes('://') && !cleanUrl.startsWith('github://') && !cleanUrl.startsWith('sandbox://') && !cleanUrl.startsWith('vector://') && !cleanUrl.startsWith('rest://')) {
          cleanUrl = `https://${cleanUrl}`;
        }

        const history = t.history || [t.url];
        const historyIndex = typeof t.historyIndex === 'number' ? t.historyIndex : 0;
        const newHistory = [...history.slice(0, historyIndex + 1), cleanUrl];

        let title = t.title;
        try {
          if (cleanUrl.startsWith('http')) {
            const parsed = new URL(cleanUrl);
            title = parsed.hostname;
          }
        } catch {
          // ignore
        }

        return {
          ...t,
          url: cleanUrl,
          title,
          history: newHistory,
          historyIndex: newHistory.length - 1
        };
      }
      return t;
    }));
  }, []);

  const goBack = useCallback((tabId: string) => {
    setTabs(prev => prev.map(t => {
      if (t.id === tabId && t.history && typeof t.historyIndex === 'number' && t.historyIndex > 0) {
        const newIndex = t.historyIndex - 1;
        const prevUrl = t.history[newIndex];
        return {
          ...t,
          url: prevUrl,
          historyIndex: newIndex
        };
      }
      return t;
    }));
  }, []);

  const goForward = useCallback((tabId: string) => {
    setTabs(prev => prev.map(t => {
      if (t.id === tabId && t.history && typeof t.historyIndex === 'number' && t.historyIndex < t.history.length - 1) {
        const newIndex = t.historyIndex + 1;
        const nextUrl = t.history[newIndex];
        return {
          ...t,
          url: nextUrl,
          historyIndex: newIndex
        };
      }
      return t;
    }));
  }, []);

  const cloneTab = useCallback((tabId: string, targetUserId: string): BrowserTab | null => {
    const sourceTab = tabs.find(t => t.id === tabId);
    if (!sourceTab) return null;

    const cloned: BrowserTab = {
      ...sourceTab,
      id: `tab-clone-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: targetUserId,
      title: `${sourceTab.title} (Fork)`,
      isShared: false, // Default cloned tab to private
      createdAt: new Date().toISOString()
    };

    setTabs(prev => [...prev, cloned]);
    setActiveTabId(cloned.id);
    return cloned;
  }, [tabs, setActiveTabId]);

  const indexTabToSpace = useCallback((tab: BrowserTab): Document => {
    const title = `${tab.title.toUpperCase().replace(/[^A-Z0-9_\-\s]/g, '')}_SNAPSHOT`;
    const now = new Date().toISOString();
    const content = `# Snapshot: ${tab.title}\n\n` +
      `- Source URL: \`${tab.url}\`\n` +
      `- Tool Type: \`${tab.type.toUpperCase()}\`\n` +
      `- Captured By: \`${tab.userId}\`\n` +
      `- Timestamp: \`${now}\`\n\n` +
      `## Captured Content & Reference Specs\n` +
      (typeof tab.data === 'string' ? tab.data : JSON.stringify(tab.data || `Documentation snapshot from ${tab.url}`, null, 2)) +
      `\n\n---\n*Indexed directly into Space Knowledge Base for sub-millisecond local RAG grounding.*`;

    const doc = createDocument(tab.spaceId, title, content, 'md');
    return doc;
  }, [createDocument]);

  return (
    <BrowserContext.Provider value={{
      tabs,
      activeTabId,
      activeTab,
      setActiveTabId,
      getUserTabs,
      getTeamSharedTabs,
      createTab,
      updateTab,
      closeTab,
      toggleTabSharing,
      navigateTab,
      goBack,
      goForward,
      cloneTab,
      indexTabToSpace
    }}>
      {children}
    </BrowserContext.Provider>
  );
};

export const useBrowser = (): BrowserContextType => {
  const context = useContext(BrowserContext);
  if (!context) {
    throw new Error('useBrowser must be used within a BrowserProvider');
  }
  return context;
};
