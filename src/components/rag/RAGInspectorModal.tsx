import React, { useState, useEffect, useMemo } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useRAG } from '../../context/RAGContext';
import { RAGSearchResult, RAGMatch } from '../../types';
import { 
  Database, 
  Search, 
  X, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  SlidersHorizontal,
  FileText,
  Radio
} from 'lucide-react';

export const RAGInspectorModal: React.FC = () => {
  const { activeSpace } = useWorkspace();
  const { 
    ragInspectorOpen, 
    setRagInspectorOpen, 
    totalChunksIndexed, 
    searchRAG, 
    formatContextBundle,
    rebuildAllIndices,
    isIndexing 
  } = useRAG();

  const [query, setQuery] = useState('architecture audio webrtc pipeline');
  const [scope, setScope] = useState<'active' | 'all'>('active');
  const [topK, setTopK] = useState<number>(5);
  const [results, setResults] = useState<RAGSearchResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Run search whenever query, scope, or topK changes
  useEffect(() => {
    if (!ragInspectorOpen) return;
    if (query.trim()) {
      const res = searchRAG(query.trim(), scope, topK);
      setResults(res);
    } else {
      setResults(null);
    }
  }, [query, scope, topK, ragInspectorOpen, searchRAG, activeSpace.id]);

  const handleCopyBundle = () => {
    if (!results || results.matches.length === 0) return;
    const bundleText = formatContextBundle(results.matches);
    navigator.clipboard.writeText(bundleText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!ragInspectorOpen) return null;

  return (
    <div 
      onClick={() => setRagInspectorOpen(false)}
      className="fixed inset-0 bg-[#000000]/85 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-mono select-none"
    >
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-4xl h-[700px] bg-[#0A0A0A] border border-[#404040] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Top Header */}
        <div className="h-12 border-b border-[#262626] px-4 flex items-center justify-between bg-[#0F0F0F] shrink-0">
          <div className="flex items-center gap-2">
            <Database size={15} className="text-[#FFFFFF]" />
            <span className="text-xs font-bold tracking-widest text-[#FFFFFF]">LOCAL RAG CONTEXT INSPECTOR</span>
            <span className="border border-[#333333] bg-[#141414] px-1.5 py-0.5 text-[10px] text-[#A3A3A3] font-bold">
              {totalChunksIndexed} CHUNKS INDEXED
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => rebuildAllIndices()}
              title="Force Rebuild In-Memory Index"
              className="p-1.5 border border-[#262626] hover:border-[#FFFFFF] text-[#A3A3A3] hover:text-[#FFFFFF] flex items-center gap-1 text-[10px]"
            >
              <RefreshCw size={11} className={isIndexing ? 'animate-spin' : ''} />
              <span>REINDEX</span>
            </button>
            <button 
              onClick={() => setRagInspectorOpen(false)}
              className="text-[#A3A3A3] hover:text-[#FFFFFF] p-1 border border-transparent hover:border-[#262626]"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Search & Query Bench Controls */}
        <div className="p-4 bg-[#0D0D0D] border-b border-[#262626] space-y-3 shrink-0">
          {/* Query Bar */}
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-3 text-[#737373]" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search local knowledge index (BM25 + Cosine similarity)..."
              autoFocus
              className="w-full bg-[#000000] border border-[#262626] focus:border-[#FFFFFF] pl-9 pr-3 py-2 text-xs font-mono text-[#FFFFFF] outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 text-[#737373] hover:text-[#FFFFFF]"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Controls Strip: Scope, TopK, Latency Benchmark */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#737373] uppercase">SEARCH SCOPE:</span>
              <div className="flex border border-[#262626]">
                <button
                  onClick={() => setScope('active')}
                  className={`px-2.5 py-1 text-[11px] font-bold transition-all ${
                    scope === 'active'
                      ? 'bg-[#FFFFFF] text-[#000000]'
                      : 'bg-[#121212] text-[#A3A3A3] hover:text-[#FFFFFF]'
                  }`}
                >
                  ACTIVE SPACE [{activeSpace.badge}]
                </button>
                <button
                  onClick={() => setScope('all')}
                  className={`px-2.5 py-1 text-[11px] font-bold border-l border-[#262626] transition-all ${
                    scope === 'all'
                      ? 'bg-[#FFFFFF] text-[#000000]'
                      : 'bg-[#121212] text-[#A3A3A3] hover:text-[#FFFFFF]'
                  }`}
                >
                  ALL SPACES
                </button>
              </div>

              <span className="text-[10px] text-[#737373] uppercase ml-2">TOP-K:</span>
              <div className="flex border border-[#262626]">
                {[3, 5, 8, 12].map(k => (
                  <button
                    key={k}
                    onClick={() => setTopK(k)}
                    className={`px-2 py-0.5 text-[10px] font-bold border-r border-[#262626] last:border-r-0 ${
                      topK === k ? 'bg-[#FFFFFF] text-[#000000]' : 'bg-[#121212] text-[#A3A3A3] hover:text-[#FFFFFF]'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Millisecond Benchmark Pill */}
            {results && (
              <div className="flex items-center gap-1.5 border border-[#333333] bg-[#121212] px-2.5 py-1 text-[10px]">
                <span className="text-[#A3A3A3]">RETRIEVAL LATENCY:</span>
                <span className={`font-bold ${results.durationMs < 1.0 ? 'text-[#FFFFFF]' : 'text-[#A3A3A3]'}`}>
                  {results.durationMs} ms
                </span>
                <span className="text-[#737373]">({results.matches.length} MATCHES)</span>
              </div>
            )}
          </div>
        </div>

        {/* Results Matches List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#080808]">
          {!results || results.matches.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <Database size={32} className="text-[#333333] mb-3" />
              <div className="text-xs font-bold text-[#FFFFFF] mb-1">
                {query.trim() ? 'NO RELEVANT CHUNKS FOUND' : 'ENTER A QUERY TO BENCHMARK LOCAL RAG'}
              </div>
              <p className="text-[11px] text-[#737373] max-w-sm">
                In-memory BM25 index parses workspace documentation, space SOUL.MD prompts, tasks, and shared tabs for instant injection into Google Gemini queries.
              </p>
            </div>
          ) : (
            results.matches.map((match, idx) => {
              const relevancePercent = Math.round(match.score * 100);
              const chunk = match.chunk;
              return (
                <div 
                  key={chunk.id}
                  className="border border-[#262626] bg-[#0E0E0E] p-3 text-xs space-y-2 hover:border-[#404040] transition-colors"
                >
                  {/* Match Top Bar */}
                  <div className="flex items-center justify-between pb-1 border-b border-[#1A1A1A]">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 text-[9px] font-bold border border-[#FFFFFF] bg-[#FFFFFF] text-[#000000]">
                        #{idx + 1}
                      </span>
                      <span className="border border-[#333333] bg-[#171717] px-1.5 py-0.2 text-[9px] font-bold text-[#A3A3A3] uppercase">
                        {chunk.sourceType}
                      </span>
                      <span className="font-bold text-[#FFFFFF] truncate max-w-md">
                        {chunk.sourceTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Score Percentage */}
                      <span className="text-[10px] text-[#A3A3A3] font-bold">
                        {relevancePercent}% RELEVANCE
                      </span>
                      {/* Score Bar */}
                      <div className="w-16 h-1.5 bg-[#1F1F1F] border border-[#333333] overflow-hidden">
                        <div 
                          className="h-full bg-[#FFFFFF]" 
                          style={{ width: `${relevancePercent}%` }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Matched Text Snippet */}
                  <pre className="text-xs text-[#CCCCCC] font-mono whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto bg-[#070707] p-2 border border-[#1F1F1F]">
                    {chunk.text}
                  </pre>

                  {/* Bottom Meta */}
                  <div className="flex items-center justify-between text-[10px] text-[#737373] pt-1">
                    <div className="flex items-center gap-3">
                      <span>SPACE ID: {chunk.spaceId}</span>
                      <span>TOKENS: {chunk.tokenCount}</span>
                      {match.matchedTerms.length > 0 && (
                        <span>MATCHED TERMS: {match.matchedTerms.join(', ')}</span>
                      )}
                    </div>
                    <span>CHUNK ID: {chunk.id}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Action Footer */}
        <div className="h-12 border-t border-[#262626] px-4 bg-[#0F0F0F] flex items-center justify-between shrink-0">
          <div className="text-[10px] text-[#737373]">
            LATENCY GUARANTEE: &lt; 1 MS // IN-MEMORY INVERTED INDEX // ZERO SERVER CALLS
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRagInspectorOpen(false)}
              className="px-3 py-1.5 border border-[#262626] hover:bg-[#171717] text-[#A3A3A3] text-xs"
            >
              CLOSE
            </button>
            <button
              onClick={handleCopyBundle}
              disabled={!results || results.matches.length === 0}
              className={`px-4 py-1.5 border text-xs font-bold flex items-center gap-1.5 transition-all ${
                !results || results.matches.length === 0
                  ? 'opacity-40 cursor-not-allowed border-[#262626] text-[#737373]'
                  : 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] hover:bg-[#A3A3A3]'
              }`}
            >
              {copied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} />}
              <span>{copied ? 'CONTEXT COPIED' : 'COPY AI CONTEXT BUNDLE'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
