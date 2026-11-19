import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWorkspace } from './WorkspaceContext';
import { useDocuments } from './DocumentContext';
import { useTasks } from './TaskContext';
import { useBrowser } from './BrowserContext';
import { RAGSearchResult, RAGMatch } from '../types';
import { ragEngine } from '../services/ragEngine';

interface RAGContextType {
  totalChunksIndexed: number;
  isIndexing: boolean;
  lastQueryResult: RAGSearchResult | null;
  ragInspectorOpen: boolean;
  setRagInspectorOpen: (open: boolean) => void;
  searchRAG: (query: string, scope?: 'active' | 'all', topK?: number) => RAGSearchResult;
  formatContextBundle: (matches: RAGMatch[]) => string;
  rebuildAllIndices: () => void;
}

const RAGContext = createContext<RAGContextType | null>(null);

export const RAGProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { spaces, activeSpace } = useWorkspace();
  const { documents } = useDocuments();
  const { tasks } = useTasks();
  const { tabs } = useBrowser();

  const [totalChunksIndexed, setTotalChunksIndexed] = useState<number>(0);
  const [isIndexing, setIsIndexing] = useState<boolean>(false);
  const [lastQueryResult, setLastQueryResult] = useState<RAGSearchResult | null>(null);
  const [ragInspectorOpen, setRagInspectorOpen] = useState<boolean>(false);

  // Full Index Rebuild
  const rebuildAllIndices = useCallback(() => {
    setIsIndexing(true);
    ragEngine.clear();

    // 1. Index all Space SOUL.MD prompts
    spaces.forEach(space => {
      ragEngine.indexSoul(space);
    });

    // 2. Index all workspace documents
    documents.forEach(doc => {
      ragEngine.indexDocument(doc);
    });

    // 3. Index all workspace tasks
    tasks.forEach(task => {
      ragEngine.indexTask(task);
    });

    // 4. Index all team-shared browser tabs
    tabs.forEach(tab => {
      if (tab.isShared) {
        ragEngine.indexTab(tab);
      }
    });

    setTotalChunksIndexed(ragEngine.totalChunks);
    setIsIndexing(false);
  }, [spaces, documents, tasks, tabs]);

  // Synchronize index whenever spaces, documents, tasks, or tabs change
  useEffect(() => {
    rebuildAllIndices();
  }, [rebuildAllIndices]);

  // Execute RAG Query
  const searchRAG = useCallback((
    query: string, 
    scope: 'active' | 'all' = 'active', 
    topK = 5
  ): RAGSearchResult => {
    const result = ragEngine.search(query, {
      spaceId: activeSpace?.id,
      scope,
      topK
    });
    setLastQueryResult(result);
    return result;
  }, [activeSpace]);

  // Generate clean prompt injection bundle from matches
  const formatContextBundle = useCallback((matches: RAGMatch[]): string => {
    if (matches.length === 0) return '';

    const lines: string[] = [
      '### RETRIEVED WORKSPACE KNOWLEDGE (SUB-MILLISECOND LOCAL RAG)',
      'The following context chunks were retrieved from persistent space documents and SOUL.MD prompts based on vector similarity:',
      ''
    ];

    matches.forEach((m, idx) => {
      const typeTag = m.chunk.sourceType.toUpperCase();
      lines.push(`--- [CHUNK ${idx + 1} // ${typeTag}: ${m.chunk.sourceTitle} (RELEVANCE: ${(m.score * 100).toFixed(0)}%)] ---`);
      lines.push(m.chunk.text.trim());
      lines.push('');
    });

    lines.push('--- END OF RETRIEVED KNOWLEDGE ---');
    return lines.join('\n');
  }, []);

  return (
    <RAGContext.Provider value={{
      totalChunksIndexed,
      isIndexing,
      lastQueryResult,
      ragInspectorOpen,
      setRagInspectorOpen,
      searchRAG,
      formatContextBundle,
      rebuildAllIndices
    }}>
      {children}
    </RAGContext.Provider>
  );
};

export const useRAG = (): RAGContextType => {
  const context = useContext(RAGContext);
  if (!context) {
    throw new Error('useRAG must be used within a RAGProvider');
  }
  return context;
};
