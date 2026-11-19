import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useDocuments } from '../../context/DocumentContext';
import { SlashCommandMenu } from './SlashCommandMenu';
import { FORMAT_BADGES } from '../../services/documentParser';
import { 
  FileText, 
  Eye, 
  Columns, 
  Edit3, 
  Download, 
  Trash2, 
  Check, 
  Plus, 
  Copy 
} from 'lucide-react';

export const NotionEditor: React.FC = () => {
  const { activeSpace } = useWorkspace();
  const { 
    activeDocument, 
    activeDocumentId, 
    getDocumentsForSpace,
    setActiveDocumentId,
    updateDocument, 
    deleteDocument, 
    createDocument 
  } = useDocuments();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Auto-align active document to active space
  const spaceDocs = getDocumentsForSpace(activeSpace.id);
  useEffect(() => {
    if (!activeDocument || activeDocument.spaceId !== activeSpace.id) {
      if (spaceDocs.length > 0) {
        setActiveDocumentId(spaceDocs[0].id);
      }
    }
  }, [activeSpace.id, activeDocument, spaceDocs, setActiveDocumentId]);

  // Slash Command State
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [slashPosition, setSlashPosition] = useState<{ top: number; left: number }>({ top: 60, left: 20 });
  const [slashTriggerIndex, setSlashTriggerIndex] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state when active document changes
  useEffect(() => {
    if (activeDocument) {
      setTitle(activeDocument.title);
      setContent(activeDocument.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [activeDocumentId, activeDocument]);

  // Debounced Auto-Save
  useEffect(() => {
    if (!activeDocument) return;
    if (title === activeDocument.title && content === activeDocument.content) return;

    setIsSaving(true);
    const timer = setTimeout(() => {
      updateDocument(activeDocument.id, { title, content });
      setIsSaving(false);
      setLastSaved(new Date());
    }, 400);

    return () => clearTimeout(timer);
  }, [title, content, activeDocument, updateDocument]);

  // Word and Character Counts
  const metrics = useMemo(() => {
    const chars = content.length;
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const lines = content.split('\n').length;
    return { chars, words, lines };
  }, [content]);

  // Handle Textarea Input & Slash Command Trigger
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const cursor = e.target.selectionStart;
    setContent(newText);

    // Detect if slash command was just triggered
    const textBeforeCursor = newText.substring(0, cursor);
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

    if (lastSlashIndex !== -1) {
      const charBeforeSlash = lastSlashIndex > 0 ? textBeforeCursor[lastSlashIndex - 1] : '\n';
      const textAfterSlash = textBeforeCursor.substring(lastSlashIndex + 1);

      // Slash is valid if at start of line or preceded by whitespace, and no newline between slash and cursor
      if (
        (charBeforeSlash === '\n' || charBeforeSlash === ' ' || lastSlashIndex === 0) &&
        !textAfterSlash.includes('\n') &&
        textAfterSlash.length <= 15
      ) {
        setSlashTriggerIndex(lastSlashIndex);
        setSlashQuery(textAfterSlash);
        setSlashMenuOpen(true);
        return;
      }
    }

    setSlashMenuOpen(false);
  };

  // Handle Tab Indentation and Keyboard in Textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && !slashMenuOpen) {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const updated = content.substring(0, start) + '  ' + content.substring(end);
      setContent(updated);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // Insert template from Slash Menu
  const handleSelectSlashCommand = (template: string) => {
    if (slashTriggerIndex === null || !textareaRef.current) return;
    const cursor = textareaRef.current.selectionStart;
    const before = content.substring(0, slashTriggerIndex);
    const after = content.substring(cursor);

    const newContent = before + template + after;
    setContent(newContent);
    setSlashMenuOpen(false);

    const newCursorPos = before.length + template.length;
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newCursorPos;
      }
    }, 10);
  };

  // Export current document as file
  const handleExport = () => {
    if (!activeDocument) return;
    const ext = activeDocument.format || 'md';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'document'}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Interactive Checkbox Toggle in Preview Mode
  const toggleTodoItem = (targetLineText: string) => {
    const lines = content.split('\n');
    const newLines = lines.map(line => {
      if (line.trim() === targetLineText.trim()) {
        if (line.includes('- [ ]')) {
          return line.replace('- [ ]', '- [x]');
        } else if (line.includes('- [x]')) {
          return line.replace('- [x]', '- [ ]');
        }
      }
      return line;
    });
    setContent(newLines.join('\n'));
  };

  // Markdown Parser for Preview Mode
  const renderMarkdown = (raw: string) => {
    const lines = raw.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer: string[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = () => {
      if (tableRows.length > 0) {
        const [headerRow, ...bodyRows] = tableRows;
        elements.push(
          <div key={`table-${elements.length}`} className="my-4 overflow-x-auto border border-[#1F1F1F]">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#111111] border-b border-[#1F1F1F]">
                  {headerRow.map((cell, idx) => (
                    <th key={idx} className="p-2 border-r border-[#1F1F1F] font-bold text-[#FFFFFF]">
                      {cell.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-[#141414] hover:bg-[#111111] transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2 border-r border-[#1F1F1F] text-[#A1A1AA]">
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Fenced Code Block
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          const codeString = codeBuffer.join('\n');
          const blockId = `code-${elements.length}`;
          elements.push(
            <div key={blockId} className="my-3 border border-[#2F2F3E] bg-[#14141C] rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#1E1E28] border-b border-[#2F2F3E] text-[11px] text-[#8E8E9E]">
                <span className="font-bold text-[#FFFFFF]">{codeLanguage.toUpperCase() || 'CODE'}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(codeString);
                    setCopiedCodeId(blockId);
                    setTimeout(() => setCopiedCodeId(null), 1500);
                  }}
                  className="hover:text-[#FFFFFF] flex items-center gap-1 font-mono transition-colors"
                >
                  {copiedCodeId === blockId ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  <span>{copiedCodeId === blockId ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
              <pre className="p-3.5 text-xs font-mono text-[#E4E4E7] overflow-x-auto whitespace-pre custom-scrollbar">
                {codeString}
              </pre>
            </div>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          flushTable();
          inCodeBlock = true;
          codeLanguage = line.trim().replace(/^```/, '');
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Tables
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const cells = line.split('|').slice(1, -1);
        if (cells.some(c => c.trim().match(/^:?-+:?$/))) {
          continue;
        }
        inTable = true;
        tableRows.push(cells);
        continue;
      } else if (inTable) {
        flushTable();
      }

      // Horizontal Rule
      if (line.trim() === '---' || line.trim() === '***') {
        elements.push(<hr key={i} className="my-4 border-[#1F1F1F]" />);
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-xl font-display font-extrabold text-[#FFFFFF] mt-6 mb-3 pb-2 border-b border-[#242432] tracking-tight">
            {line.substring(2)}
          </h1>
        );
        continue;
      }
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-base font-display font-bold text-[#FFFFFF] mt-5 mb-2 pb-1 border-b border-[#242432] tracking-tight">
            {line.substring(3)}
          </h2>
        );
        continue;
      }
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-sm font-display font-bold text-[#E4E4E7] mt-4 mb-1.5 tracking-tight">
            {line.substring(4)}
          </h3>
        );
        continue;
      }

      // Interactive Checkbox / Task Item
      if (line.trim().startsWith('- [ ]') || line.trim().startsWith('- [x]')) {
        const isChecked = line.trim().startsWith('- [x]');
        const text = line.replace(/^- \[( |x)\]/, '').trim();
        elements.push(
          <div 
            key={i} 
            onClick={() => toggleTodoItem(line)}
            className="flex items-center gap-2.5 py-1 text-sm font-sans text-[#FFFFFF] cursor-pointer hover:text-[#A1A1B4] select-none transition-colors"
          >
            {isChecked ? (
              <span className="p-0.5 border border-emerald-400 bg-emerald-400 rounded text-[#000000]">
                <Check size={12} strokeWidth={3} />
              </span>
            ) : (
              <span className="w-4 h-4 border border-[#3F3F50] rounded bg-[#171720] inline-block" />
            )}
            <span className={isChecked ? 'line-through text-[#717182]' : 'text-[#FFFFFF]'}>
              {text}
            </span>
          </div>
        );
        continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={i} className="my-2.5 pl-3.5 border-l-2 border-[#FFFFFF] bg-[#14141C] py-2 rounded-r-xl text-xs font-mono text-[#A1A1B4]">
            {line.substring(2)}
          </blockquote>
        );
        continue;
      }

      // Bullet List
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        elements.push(
          <div key={i} className="flex items-start gap-2.5 py-0.5 text-sm font-sans text-[#D4D4DC] pl-2">
            <span className="text-emerald-400 font-bold mt-0.5">•</span>
            <span>{line.trim().substring(2)}</span>
          </div>
        );
        continue;
      }

      // Empty Line
      if (!line.trim()) {
        elements.push(<div key={i} className="h-2.5" />);
        continue;
      }

      // Normal paragraph
      elements.push(
        <p key={i} className="text-sm font-sans text-[#D4D4DC] leading-relaxed my-1.5">
          {line}
        </p>
      );
    }

    if (inTable) {
      flushTable();
    }

    return elements;
  };

  // If no document is selected
  if (!activeDocument) {
    return (
      <div className="h-full border border-[#242432] bg-[#121217] rounded-2xl p-8 flex flex-col items-center justify-center font-mono select-none">
        <div className="w-16 h-16 rounded-2xl bg-[#1A1A24] border border-[#2F2F3E] flex items-center justify-center mb-4 text-[#8E8E9E]">
          <FileText size={32} />
        </div>
        <h2 className="text-sm font-bold text-[#FFFFFF] tracking-wider mb-2 uppercase">
          NO DOCUMENT ACTIVE
        </h2>
        <p className="text-xs text-[#8E8E9E] max-w-sm text-center mb-6 leading-relaxed">
          Select an existing document from the left Notion sidebar or initialize a new blank document for space [{activeSpace.badge}].
        </p>
        <button
          onClick={() => createDocument(activeSpace.id, 'UNTITLED_DOC', '', 'md')}
          className="px-5 py-2.5 bg-[#FFFFFF] text-[#000000] font-bold text-xs rounded-xl border border-[#FFFFFF] hover:bg-[#E2E2E8] flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus size={15} />
          <span>CREATE NEW DOCUMENT</span>
        </button>
      </div>
    );
  }

  const formatBadge = FORMAT_BADGES[activeDocument.format] || activeDocument.format.toUpperCase();

  return (
    <div className="h-full border border-[#242432] bg-[#0E0E14] rounded-2xl flex flex-col font-mono select-none overflow-hidden relative shadow-lg">
      {/* Top Header Bar */}
      <div className="h-12 border-b border-[#242432] px-4 flex items-center justify-between bg-[#14141C] shrink-0">
        {/* Document Title Input */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0 mr-4">
          <span className="px-2 py-0.5 text-[10px] font-bold border border-[#2F2F3E] bg-[#1E1E28] rounded-lg text-[#FFFFFF] shrink-0">
            {formatBadge}
          </span>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="DOCUMENT TITLE..."
            className="bg-transparent border-b border-transparent focus:border-[#FFFFFF] font-display text-sm font-bold text-[#FFFFFF] tracking-wide outline-none py-1 flex-1 min-w-[120px] transition-colors"
          />
        </div>

        {/* View Controls & Metrics */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Word/Char Metrics */}
          <div className="text-[10px] font-mono text-[#8E8E9E] hidden sm:flex items-center gap-2 font-medium">
            <span>{metrics.words} WORDS</span>
            <span>{metrics.chars} CHARS</span>
            <span>{metrics.lines} LINES</span>
          </div>

          {/* Auto-Save Indicator */}
          <div className="text-[10px] font-bold flex items-center gap-1.5 text-[#8E8E9E] border-l border-[#242432] pl-3">
            {isSaving ? (
              <span className="text-amber-400 animate-pulse">SAVING...</span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check size={12} strokeWidth={2.5} />
                <span>SAVED</span>
              </span>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-[#2F2F3E] bg-[#1E1E28] rounded-xl p-0.5 gap-0.5">
            <button
              onClick={() => setViewMode('edit')}
              title="Editor View"
              className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === 'edit' ? 'bg-[#FFFFFF] text-[#000000]' : 'text-[#8E8E9E] hover:text-[#FFFFFF]'}`}
            >
              <Edit3 size={13} />
            </button>
            <button
              onClick={() => setViewMode('split')}
              title="Split View"
              className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === 'split' ? 'bg-[#FFFFFF] text-[#000000]' : 'text-[#8E8E9E] hover:text-[#FFFFFF]'}`}
            >
              <Columns size={13} />
            </button>
            <button
              onClick={() => setViewMode('preview')}
              title="Preview View"
              className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === 'preview' ? 'bg-[#FFFFFF] text-[#000000]' : 'text-[#8E8E9E] hover:text-[#FFFFFF]'}`}
            >
              <Eye size={13} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleExport}
              title="Download Document"
              className="p-1.5 border border-[#2F2F3E] hover:border-[#FFFFFF] rounded-xl text-[#8E8E9E] hover:text-[#FFFFFF] transition-colors"
            >
              <Download size={13} />
            </button>
            <button
              onClick={() => {
                if (window.confirm(`DELETE DOCUMENT "${title}"?`)) {
                  deleteDocument(activeDocument.id);
                }
              }}
              title="Delete Document"
              className="p-1.5 border border-[#2F2F3E] hover:border-rose-500 rounded-xl text-[#8E8E9E] hover:text-rose-400 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Editor Column */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`h-full flex flex-col ${viewMode === 'split' ? 'w-1/2 border-r border-[#242432]' : 'w-full'}`}>
            <div className="flex-1 p-4 overflow-hidden relative flex flex-col bg-[#0B0B0E]">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder="Type '/' for Notion slash commands (/H2, /TODO, /CODE, /TABLE, /AI-SYNTHESIZE)..."
                className="w-full h-full bg-transparent text-[#FFFFFF] text-xs font-mono outline-none resize-none leading-relaxed selection:bg-[#FFFFFF] selection:text-[#000000] custom-scrollbar"
                autoFocus
              />

              {/* Floating Slash Command Menu */}
              <SlashCommandMenu
                isOpen={slashMenuOpen}
                query={slashQuery}
                onSelect={handleSelectSlashCommand}
                onClose={() => setSlashMenuOpen(false)}
                position={slashPosition}
              />
            </div>
            <div className="h-6 border-t border-[#242432] px-3 bg-[#14141C] flex items-center justify-between text-[10px] text-[#8E8E9E]">
              <span>HINT: TYPE &apos;/&apos; FOR COMMANDS</span>
              <span>TAB FOR 2-SPACE INDENT</span>
            </div>
          </div>
        )}

        {/* Live Preview Column */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`h-full flex flex-col bg-[#0E0E13] overflow-y-auto ${viewMode === 'split' ? 'w-1/2' : 'w-full'} custom-scrollbar`}>
            <div className="p-6 max-w-3xl mx-auto w-full flex-1">
              {content.trim() ? (
                renderMarkdown(content)
              ) : (
                <div className="text-[11px] text-[#8E8E9E] italic">
                  Document is empty. Enter markdown text in the editor.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
