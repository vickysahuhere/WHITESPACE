import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useWorkspace } from './WorkspaceContext';
import { ChatMessage, ChatHistoryStore } from '../types';

const CHATS_STORAGE_KEY = 'whitespace_chats_v1';

interface ChatContextType {
  chatsByUser: ChatHistoryStore;
  currentMessages: ChatMessage[];
  getMessages: (userId: string, spaceId: string) => ChatMessage[];
  addMessage: (
    userId: string,
    spaceId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    ragSources?: { title: string; score: number; chunk: string }[]
  ) => ChatMessage;
  clearMessages: (userId: string, spaceId: string) => void;
  exportChatHistory: (userId: string, spaceId: string) => string;
}

const ChatContext = createContext<ChatContextType | null>(null);

function getInitialChatStore(): ChatHistoryStore {
  try {
    const raw = localStorage.getItem(CHATS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed reading chat history from storage:', err);
  }
  return {};
}

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeMember, activeSpace } = useWorkspace();
  const [chatsByUser, setChatsByUser] = useState<ChatHistoryStore>(getInitialChatStore);

  // Persist chats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chatsByUser));
    } catch (err) {
      console.error('Failed persisting chat history to storage:', err);
    }
  }, [chatsByUser]);

  const getMessages = useCallback((userId: string, spaceId: string): ChatMessage[] => {
    return chatsByUser[userId]?.[spaceId] || [];
  }, [chatsByUser]);

  const currentMessages = useMemo(() => {
    if (!activeMember || !activeSpace) return [];
    const msgs = chatsByUser[activeMember.id]?.[activeSpace.id];
    if (msgs && msgs.length > 0) return msgs;

    // Seed default isolated briefing message for this user & space if empty
    return [
      {
        id: `sys-welcome-${activeMember.id}-${activeSpace.id}`,
        userId: activeMember.id,
        spaceId: activeSpace.id,
        role: 'system' as const,
        content: `### ISOLATED SESSION INITIALIZED // ${activeMember.name.toUpperCase()} (${activeMember.role})\n` +
          `- Space: **${activeSpace.name}** [${activeSpace.badge}]\n` +
          `- Hardware Profile: \`${activeMember.hardware}\`\n` +
          `- Session Privacy: **STRICTLY ISOLATED** (No other team members can view this thread)\n` +
          `- Local RAG Status: Active with sub-millisecond retrieval grounded in space knowledge.`,
        timestamp: new Date().toISOString()
      }
    ];
  }, [chatsByUser, activeMember, activeSpace]);

  const addMessage = useCallback((
    userId: string,
    spaceId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    ragSources?: { title: string; score: number; chunk: string }[]
  ): ChatMessage => {
    const now = new Date().toISOString();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      spaceId,
      role,
      content,
      timestamp: now,
      ragSources
    };

    setChatsByUser(prev => {
      const userStore = prev[userId] || {};
      const spaceMsgs = userStore[spaceId] || [];
      return {
        ...prev,
        [userId]: {
          ...userStore,
          [spaceId]: [...spaceMsgs, newMsg]
        }
      };
    });

    return newMsg;
  }, []);

  const clearMessages = useCallback((userId: string, spaceId: string) => {
    setChatsByUser(prev => {
      const userStore = prev[userId] || {};
      return {
        ...prev,
        [userId]: {
          ...userStore,
          [spaceId]: []
        }
      };
    });
  }, []);

  const exportChatHistory = useCallback((userId: string, spaceId: string): string => {
    const msgs = getMessages(userId, spaceId);
    if (msgs.length === 0) return '# No messages in this session.';

    const lines: string[] = [
      `# White Collars Chat Session Export`,
      `- Member ID: ${userId}`,
      `- Space ID: ${spaceId}`,
      `- Export Date: ${new Date().toISOString()}`,
      `\n---\n`
    ];

    msgs.forEach(m => {
      lines.push(`### [${m.role.toUpperCase()}] // ${m.timestamp}`);
      lines.push(m.content);
      if (m.ragSources && m.ragSources.length > 0) {
        lines.push(`\n*Grounded Sources:*`);
        m.ragSources.forEach(s => {
          lines.push(`- ${s.title} (Score: ${(s.score * 100).toFixed(0)}%)`);
        });
      }
      lines.push(`\n---\n`);
    });

    return lines.join('\n');
  }, [getMessages]);

  return (
    <ChatContext.Provider value={{
      chatsByUser,
      currentMessages,
      getMessages,
      addMessage,
      clearMessages,
      exportChatHistory
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
