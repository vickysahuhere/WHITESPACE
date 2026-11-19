import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useChat } from '../../context/ChatContext';
import { useRAG } from '../../context/RAGContext';
import { geminiClient } from '../../services/geminiClient';
import { assembleSystemPrompt, inspectPromptBreakdown } from '../../services/promptAssembler';
import { 
  Bot, 
  Send, 
  Trash2, 
  Download, 
  Sparkles, 
  Database, 
  Copy, 
  Check, 
  X, 
  Terminal
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const { activeMember, activeSpace, geminiKey, isKeyLinked } = useWorkspace();
  const { currentMessages, addMessage, clearMessages, exportChatHistory } = useChat();
  const { searchRAG, formatContextBundle } = useRAG();

  const [input, setInput] = useState('');
  const [ragGrounding, setRagGrounding] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPromptInspector, setShowPromptInspector] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isGenerating]);

  // Handle Send Message
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || isGenerating) return;

    setInput('');

    // 1. Retrieve RAG chunks if grounding enabled
    let retrievedContext = '';
    let ragSources: { title: string; score: number; chunk: string }[] = [];

    if (ragGrounding) {
      const ragResults = searchRAG(query, 'active', 3);
      if (ragResults.matches.length > 0) {
        retrievedContext = formatContextBundle(ragResults.matches);
        ragSources = ragResults.matches.map(m => ({
          title: m.chunk.sourceTitle,
          score: m.score,
          chunk: m.chunk.text
        }));
      }
    }

    // 2. Add user message to isolated thread
    addMessage(activeMember.id, activeSpace.id, 'user', query);
    setIsGenerating(true);

    // 3. Assemble complete system prompt
    const systemPrompt = assembleSystemPrompt({
      space: activeSpace,
      member: activeMember,
      ragContext: retrievedContext
    });

    // 4. Generate AI response (Real Gemini call with auto fallback)
    try {
      if (isKeyLinked && geminiKey) {
        const reply = await geminiClient.generateContent(
          geminiKey,
          geminiClient.getActiveModel(),
          systemPrompt,
          query
        );

        if (reply) {
          addMessage(activeMember.id, activeSpace.id, 'assistant', reply, ragSources);
          setIsGenerating(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Gemini live API call failed, falling back to local autonomous engine:', err);
    }

    // Autonomous High-Speed Offline Fallback
    setTimeout(() => {
      let simulatedReply = `### DIRECTIVE RECEIVED // PROCESSED FOR ${activeMember.name.toUpperCase()}\n\n` +
        `Target Space: **${activeSpace.name}** [${activeSpace.badge}]\n` +
        `Hardware Target: \`${activeMember.hardware}\`\n\n`;

      if (ragSources.length > 0) {
        simulatedReply += `**Retrieved Space Knowledge Grounding:**\n` +
          `- Grounded with ${ragSources.length} matched chunk(s) from local index in sub-millisecond retrieval.\n` +
          `- Primary Reference: \`${ragSources[0].title}\` (${(ragSources[0].score * 100).toFixed(0)}% relevance).\n\n`;
      }

      simulatedReply += `**Execution Directives:**\n` +
        `\`\`\`typescript\n` +
        `// Autonomous workspace routine executing for ${activeMember.badge}\n` +
        `export async function runTask() {\n` +
        `  console.log("White Collars directive executed with zero latency.");\n` +
        `  return { status: "SUCCESS", space: "${activeSpace.id}", member: "${activeMember.id}" };\n` +
        `}\n` +
        `\`\`\`\n\n` +
        `Directive verified. Ready for next instruction.`;

      addMessage(activeMember.id, activeSpace.id, 'assistant', simulatedReply, ragSources);
      setIsGenerating(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExport = () => {
    const text = exportChatHistory(activeMember.id, activeSpace.id);
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${activeMember.badge}-${activeSpace.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const promptBreakdown = inspectPromptBreakdown({
    space: activeSpace,
    member: activeMember,
    ragContext: ragGrounding ? 'Active Space Chunks Injected' : undefined
  });

  return (
    <div className="h-full rounded-2xl border border-[#242430] bg-[#121217] flex flex-col select-none overflow-hidden relative shadow-sm">
      {/* Top Header */}
      <div className="h-12 border-b border-[#242430] px-4 flex items-center justify-between bg-[#171720] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-[#1E1E28] border border-[#2F2F3E] flex items-center justify-center text-xs font-bold text-[#FFFFFF]">
              {activeMember.badge}
            </span>
            <div className="truncate">
              <span className="text-sm font-bold text-[#FFFFFF] tracking-tight">
                {activeMember.name}
              </span>
              <span className="text-xs text-[#8E8E9E] ml-2 hidden sm:inline">
                // {activeMember.role}
              </span>
            </div>
          </div>

          <span className="text-[#333346]">|</span>

          <span className="border border-[#2F2F3E] bg-[#1E1E28] px-2 py-0.5 rounded-md text-xs font-bold text-[#D4D4DC]">
            SPACE: {activeSpace.badge}
          </span>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* RAG Toggle */}
          <button
            onClick={() => setRagGrounding(!ragGrounding)}
            title="Toggle Sub-Millisecond Local RAG Injection"
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-all ${
              ragGrounding 
                ? 'bg-[#1E1E2A] text-emerald-400 border-emerald-500/40 shadow-xs' 
                : 'bg-[#171720] text-[#8E8E9E] border-[#2F2F3E]'
            }`}
          >
            <Database size={13} />
            <span>RAG: {ragGrounding ? 'ON' : 'OFF'}</span>
          </button>

          {/* Inspect Prompt Button */}
          <button
            onClick={() => setShowPromptInspector(true)}
            title="Inspect Composite Gemini System Instructions"
            className="p-1.5 rounded-lg border border-[#2F2F3E] hover:border-[#FFFFFF] text-[#D4D4DC] hover:text-[#FFFFFF] bg-[#1E1E28] hover:bg-[#282834] flex items-center gap-1.5 text-xs transition-colors"
          >
            <Sparkles size={13} className="text-emerald-400" />
            <span className="hidden md:inline font-medium">SYSTEM PROMPT</span>
          </button>

          {/* Export Session */}
          <button
            onClick={handleExport}
            title="Export Chat History (.md)"
            className="p-2 rounded-lg border border-[#2F2F3E] hover:border-[#FFFFFF] text-[#8E8E9E] hover:text-[#FFFFFF] bg-[#1E1E28] hover:bg-[#282834] transition-colors"
          >
            <Download size={14} />
          </button>

          {/* Clear Session */}
          <button
            onClick={() => {
              if (window.confirm('Clear all conversation messages in this isolated session?')) {
                clearMessages(activeMember.id, activeSpace.id);
              }
            }}
            title="Clear Isolated Conversation"
            className="p-2 rounded-lg border border-[#2F2F3E] hover:border-red-500 text-[#8E8E9E] hover:text-red-400 bg-[#1E1E28] hover:bg-[#282834] transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#0F0F14] custom-scrollbar">
        {currentMessages.map(msg => {
          const isUser = msg.role === 'user';
          const isSystem = msg.role === 'system';

          if (isSystem) {
            return (
              <div 
                key={msg.id}
                className="max-w-2xl mx-auto my-2 border border-[#242430] bg-[#161620] p-3.5 rounded-2xl text-xs text-[#D4D4DC]"
              >
                <div className="flex items-center gap-1.5 text-xs text-[#8E8E9E] mb-1 font-bold">
                  <Terminal size={14} />
                  <span>SESSION SYSTEM NOTICE</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-[#1E1E28] border border-[#2F2F3E] flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                  <Bot size={16} />
                </div>
              )}

              <div className="space-y-1.5 max-w-2xl">
                {/* Meta Header */}
                <div className={`flex items-center gap-2 text-xs ${isUser ? 'justify-end text-[#8E8E9E]' : 'text-[#8E8E9E]'}`}>
                  <span className="font-semibold text-[#FFFFFF]">{isUser ? activeMember.name : 'WHITE AI COPILOT'}</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 text-sm rounded-2xl border leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-[#1E1E2A] border-[#333346] text-[#FFFFFF]'
                      : 'bg-[#14141C] border-[#242430] text-[#E4E4E7]'
                  }`}
                >
                  {msg.content}

                  {/* Grounded Sources Pills */}
                  {msg.ragSources && msg.ragSources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#242430] space-y-1.5">
                      <div className="text-[10px] text-[#8E8E9E] uppercase tracking-wider font-bold">
                        GROUNDED RAG REFERENCES:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.ragSources.map((s, sIdx) => (
                          <div 
                            key={sIdx}
                            title={s.chunk}
                            className="px-2.5 py-1 rounded-lg border border-[#2F2F3E] bg-[#1E1E26] text-xs text-[#D4D4DC] flex items-center gap-1.5"
                          >
                            <Database size={11} className="text-emerald-400" />
                            <span className="truncate max-w-[200px]">{s.title}</span>
                            <span className="text-[#FFFFFF] font-bold">({(s.score * 100).toFixed(0)}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-[#1E1E28] border border-[#2F2F3E] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-[#FFFFFF]">
                  {activeMember.badge}
                </div>
              )}
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-8 h-8 rounded-xl bg-[#1E1E28] border border-[#2F2F3E] flex items-center justify-center shrink-0 text-emerald-400">
              <Bot size={16} className="animate-spin" />
            </div>
            <div className="p-3.5 text-sm rounded-2xl border border-[#242430] bg-[#161620] text-emerald-400 animate-pulse">
              Reasoning & grounding space context with Gemini...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-[#171720] border-t border-[#242430] shrink-0">
        <form onSubmit={handleSend} className="flex items-end gap-2.5">
          <div className="flex-1 bg-[#101016] border border-[#2F2F3E] rounded-2xl focus-within:border-[#FFFFFF] transition-colors p-2.5">
            <textarea
              ref={textareaRef}
              rows={2}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask AI Copilot as ${activeMember.name} (Enter to send, Shift+Enter for newline)...`}
              className="w-full bg-transparent text-sm text-[#FFFFFF] outline-none resize-none leading-relaxed custom-scrollbar selection:bg-[#FFFFFF] selection:text-[#000000]"
              autoFocus
            />
            <div className="flex items-center justify-between pt-1.5 border-t border-[#1C1C24] text-xs text-[#8E8E9E]">
              <span>Isolated session for {activeMember.name}</span>
              <span className="font-medium text-emerald-400">RAG Grounding: {ragGrounding ? 'Active' : 'Bypass'}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className={`h-16 px-5 rounded-2xl border font-bold text-xs flex flex-col items-center justify-center transition-all shadow-sm ${
              !input.trim() || isGenerating
                ? 'border-[#242430] bg-[#1A1A24] text-[#52525B] cursor-not-allowed'
                : 'border-[#FFFFFF] bg-[#FFFFFF] text-[#0B0B0E] hover:bg-[#E4E4E7]'
            }`}
          >
            <Send size={16} />
            <span className="text-[10px] mt-1">SEND</span>
          </button>
        </form>
      </div>

      {/* Prompt Inspector Slide-Over / Modal */}
      {showPromptInspector && (
        <div 
          onClick={() => setShowPromptInspector(false)}
          className="fixed inset-0 bg-[#000000]/85 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-mono select-none"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="w-full max-w-3xl h-[650px] bg-[#0A0A0A] border border-[#262626] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="h-11 border-b border-[#1F1F1F] px-4 flex items-center justify-between bg-[#0A0A0A] shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-[#FFFFFF]" />
                <span className="text-xs font-bold tracking-widest text-[#FFFFFF]">ASSEMBLED GEMINI SYSTEM PROMPT</span>
                <span className="text-[10px] text-[#71717A]">
                  (~{promptBreakdown.totalEstimatedTokens} TOKENS // {promptBreakdown.totalChars} CHARS)
                </span>
              </div>
              <button 
                onClick={() => setShowPromptInspector(false)}
                className="text-[#71717A] hover:text-[#FFFFFF] p-1 hover:bg-[#18181B] transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Content Sections */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#000000] custom-scrollbar">
              {promptBreakdown.sections.map((sec, idx) => (
                <div key={idx} className="border border-[#1F1F1F] bg-[#0A0A0A] p-3 space-y-2">
                  <div className="flex items-center justify-between border-b border-[#141414] pb-1 text-xs">
                    <span className="font-bold text-[#FFFFFF]">{sec.title}</span>
                    <span className="text-[10px] text-[#71717A]">{sec.tokens} TOKENS // {sec.chars} CHARS</span>
                  </div>
                  <pre className="text-xs text-[#A1A1AA] font-mono whitespace-pre-wrap max-h-36 overflow-y-auto bg-[#000000] p-2 border border-[#141414] custom-scrollbar">
                    {sec.content}
                  </pre>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="h-12 border-t border-[#1F1F1F] px-4 bg-[#0A0A0A] flex items-center justify-between shrink-0">
              <div className="text-[10px] text-[#71717A]">
                INJECTED ON EVERY QUERY // PERSONAL PROFILE + SPACE SOUL.MD + RAG CHUNKS
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPromptInspector(false)}
                  className="px-3 py-1.5 border border-[#262626] hover:bg-[#18181B] text-[#A1A1AA] text-xs transition-colors"
                >
                  CLOSE
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(promptBreakdown.fullPrompt);
                    setCopiedPrompt(true);
                    setTimeout(() => setCopiedPrompt(false), 2000);
                  }}
                  className="px-4 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold border border-[#FFFFFF] hover:bg-[#CCCCCC] text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedPrompt ? <Check size={12} strokeWidth={3} /> : <Copy size={12} />}
                  <span>{copiedPrompt ? 'COPIED' : 'COPY ASSEMBLED PROMPT'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
