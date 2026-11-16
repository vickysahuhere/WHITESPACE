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
  Copy, 
  Sparkles,
  CheckSquare,
  Square
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
          <div key={`table-${elements.length}`} className="my-4 overflow-x-auto border border-[#262626]">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#121212] border-b border-[#262626]">
                  {headerRow.map((cell, idx) => (
                    <th key={idx} className="p-2 border-r border-[#262626] font-bold text-[#FFFFFF]">
                      {cell.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-[#1A1A1A] hover:bg-[#0E0E0E]">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2 border-r border-[#262626] text-[#A3A3A3]">
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
            <div key={blockId} className="my-3 border border-[#262626] bg-[#0A0A0A] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1 bg-[#121212] border-b border-[#262626] text-[10px] text-[#737373]">
                <span>{codeLanguage.toUpperCase() || 'CODE'}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(codeString);
                    setCopiedCodeId(blockId);
                    setTimeout(() => setCopiedCodeId(null), 1500);
                  }}
                  className="hover:text-[#FFFFFF] flex items-center gap-1 font-mono"
                >
                  {copiedCodeId === blockId ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copiedCodeId === blockId ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
              <pre className="p-3 text-xs font-mono text-[#D4D4D4] overflow-x-auto whitespace-pre">
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
        // Skip separator row like | :--- | :--- |
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
        elements.push(<hr key={i} className="my-4 border-[#262626]" />);
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-lg font-bold text-[#FFFFFF] mt-5 mb-2 pb-1 border-b border-[#262626]">
            {line.substring(2)}
          </h1>
        );
        continue;
      }
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-sm font-bold text-[#FFFFFF] mt-4 mb-2 pb-1 border-b border-[#1F1F1F]">
            {line.substring(3)}
          </h2>
        );
        continue;
      }
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-xs font-bold text-[#E5E5E5] mt-3 mb-1">
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
            className="flex items-center gap-2 py-0.5 text-xs text-[#FFFFFF] cursor-pointer hover:text-[#A3A3A3] select-none"
          >
            {isChecked ? (
              <span className="p-0.5 border border-[#FFFFFF] bg-[#FFFFFF] text-[#000000]">
                <Check size={11} strokeWidth={3} />
              </span>
            ) : (
              <span className="w-3.5 h-3.5 border border-[#555555] bg-[#000000] inline-block" />
            )}
            <span className={isChecked ? 'line-through text-[#666666]' : 'text-[#FFFFFF]'}>
              {text}
            </span>
          </div>
        );
        continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={i} className="my-2 pl-3 border-l-2 border-[#FFFFFF] bg-[#0F0F0F] py-1 text-xs text-[#A3A3A3] font-mono">
            {line.substring(2)}
          </blockquote>
        );
        continue;
      }

      // Bullet List
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        elements.push(
          <div key={i} className="flex items-start gap-2 py-0.5 text-xs text-[#CCCCCC] pl-2">
            <span className="text-[#555555] mt-0.5">-</span>
            <span>{line.trim().substring(2)}</span>
          </div>
        );
        continue;
      }

      // Empty Line
      if (!line.trim()) {
        elements.push(<div key={i} className="h-2" />);
        continue;
      }

      // Normal paragraph
      elements.push(
        <p key={i} className="text-xs text-[#CCCCCC] leading-relaxed my-0.5">
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
      <div className="h-full border border-[#262626] bg-[#0A0A0A] p-8 flex flex-col items-center justify-center font-mono select-none">
        <FileText size={40} className="text-[#333333] mb-4" />
        <h2 className="text-sm font-bold text-[#FFFFFF] tracking-wider mb-2 uppercase">
          NO DOCUMENT ACTIVE
        </h2>
        <p className="text-xs text-[#737373] max-w-sm text-center mb-6 leading-relaxed">
          Select an existing document from the left Notion sidebar or initialize a new blank document for space [{activeSpace.badge}].
        </p>
        <button
          onClick={() => createDocument(activeSpace.id, 'UNTITLED_DOC', '', 'md')}
          className="px-4 py-2 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#A3A3A3] flex items-center gap-2"
        >
          <Plus size={14} />
          <span>CREATE NEW DOCUMENT</span>
        </button>
      </div>
    );
  }

  const formatBadge = FORMAT_BADGES[activeDocument.format] || activeDocument.format.toUpperCase();

  return (
    <div className="h-full border border-[#262626] bg-[#0A0A0A] flex flex-col font-mono select-none overflow-hidden relative">
      {/* Top Header Bar */}
      <div className="h-12 border-b border-[#262626] px-4 flex items-center justify-between bg-[#0F0F0F] shrink-0">
        {/* Document Title Input */}
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-4">
          <span className="px-1.5 py-0.5 text-[10px] font-bold border border-[#404040] bg-[#171717] text-[#FFFFFF] shrink-0">
            {formatBadge}
          </span>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="DOCUMENT TITLE..."
            className="bg-transparent border-b border-transparent focus:border-[#FFFFFF] text-xs font-bold text-[#FFFFFF] tracking-wider outline-none py-1 flex-1 min-w-[120px]"
          />
        </div>

        {/* View Controls & Metrics */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Word/Char Metrics */}
          <div className="text-[10px] text-[#737373] hidden sm:flex items-center gap-2">
            <span>{metrics.words} WORDS</span>
            <span>{metrics.chars} CHARS</span>
            <span>{metrics.lines} LINES</span>
          </div>

          {/* Auto-Save Indicator */}
          <div className="text-[10px] font-bold flex items-center gap-1 text-[#A3A3A3] border-l border-[#262626] pl-3">
            {isSaving ? (
              <span className="text-[#A3A3A3] animate-pulse">SAVING...</span>
            ) : (
              <span className="text-[#FFFFFF] flex items-center gap-1">
                <Check size={11} strokeWidth={3} />
                <span>SAVED</span>
              </span>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-[#262626] bg-[#121212]">
            <button
              onClick={() => setViewMode('edit')}
              title="Editor View"
              className={`p-1.5 text-xs ${viewMode === 'edit' ? 'bg-[#FFFFFF] text-[#000000]' : 'text-[#737373] hover:text-[#FFFFFF]'}`}
            >
              <Edit3 size={13} />
            </button>
            <button
              onClick={() => setViewMode('split')}
              title="Split View"
              className={`p-1.5 text-xs border-x border-[#262626] ${viewMode === 'split' ? 'bg-[#FFFFFF] text-[#000000]' : 'text-[#737373] hover:text-[#FFFFFF]'}`}
            >
              <Columns size={13} />
            </button>
            <button
              onClick={() => setViewMode('preview')}
              title="Preview View"
              className={`p-1.5 text-xs ${viewMode === 'preview' ? 'bg-[#FFFFFF] text-[#000000]' : 'text-[#737373] hover:text-[#FFFFFF]'}`}
            >
              <Eye size={13} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleExport}
              title="Download Document"
              className="p-1.5 border border-[#262626] hover:border-[#404040] text-[#A3A3A3] hover:text-[#FFFFFF]"
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
              className="p-1.5 border border-[#262626] hover:border-[#FFFFFF] text-[#A3A3A3] hover:text-[#FFFFFF]"
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
          <div className={`h-full flex flex-col ${viewMode === 'split' ? 'w-1/2 border-r border-[#262626]' : 'w-full'}`}>
            <div className="flex-1 p-4 overflow-hidden relative flex flex-col">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder="Type '/' for Notion slash commands (/H2, /TODO, /CODE, /TABLE, /AI-SYNTHESIZE)..."
                className="w-full h-full bg-transparent text-[#FFFFFF] text-xs font-mono outline-none resize-none leading-relaxed selection:bg-[#333333] custom-scrollbar"
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
            <div className="h-6 border-t border-[#1C1C1C] px-3 bg-[#0B0B0B] flex items-center justify-between text-[10px] text-[#555555]">
              <span>HINT: TYPE &apos;/&apos; FOR COMMANDS</span>
              <span>TAB FOR 2-SPACE INDENT</span>
            </div>
          </div>
        )}

        {/* Live Preview Column */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`h-full flex flex-col bg-[#070707] overflow-y-auto ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
            <div className="p-6 max-w-3xl mx-auto w-full flex-1">
              {content.trim() ? (
                renderMarkdown(content)
              ) : (
                <div className="text-[11px] text-[#444444] italic">
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
