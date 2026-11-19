import React, { useState, useEffect, useRef } from 'react';
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  CheckSquare, 
  Code, 
  Table, 
  Quote, 
  Minus, 
  Sparkles 
} from 'lucide-react';

export interface SlashCommandItem {
  id: string;
  command: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  template: string;
}

export const SLASH_COMMANDS: SlashCommandItem[] = [
  {
    id: 'h1',
    command: '/H1',
    label: 'HEADING 1',
    description: 'Primary page section title',
    icon: <Heading1 size={14} />,
    template: '# '
  },
  {
    id: 'h2',
    command: '/H2',
    label: 'HEADING 2',
    description: 'Medium section subheading',
    icon: <Heading2 size={14} />,
    template: '## '
  },
  {
    id: 'h3',
    command: '/H3',
    label: 'HEADING 3',
    description: 'Small subsection title',
    icon: <Heading3 size={14} />,
    template: '### '
  },
  {
    id: 'todo',
    command: '/TODO',
    label: 'TASK CHECKBOX',
    description: 'Interactive markdown todo item',
    icon: <CheckSquare size={14} />,
    template: '- [ ] '
  },
  {
    id: 'code',
    command: '/CODE',
    label: 'CODE BLOCK',
    description: 'Syntax-highlighted code block',
    icon: <Code size={14} />,
    template: "```typescript\n// Autonomous script\n\n```\n"
  },
  {
    id: 'table',
    command: '/TABLE',
    label: '3-COLUMN TABLE',
    description: 'Formatted markdown data matrix',
    icon: <Table size={14} />,
    template: "| Metric | Specification | Status |\n| :--- | :--- | :--- |\n| Target | Description | Operational |\n"
  },
  {
    id: 'quote',
    command: '/QUOTE',
    label: 'BLOCKQUOTE',
    description: 'Indented quote or callout block',
    icon: <Quote size={14} />,
    template: '> '
  },
  {
    id: 'divider',
    command: '/DIVIDER',
    label: 'DIVIDER LINE',
    description: 'Horizontal thematic break',
    icon: <Minus size={14} />,
    template: "\n---\n\n"
  },
  {
    id: 'ai-synthesize',
    command: '/AI-SYNTHESIZE',
    label: 'AI SYNTHESIZE BLOCK',
    description: 'Space knowledge RAG synthesis directive',
    icon: <Sparkles size={14} />,
    template: "> [AI-SYNTHESIS // DIRECTIVE]\n> Synthesize key requirements and map actionable engineering dependencies.\n\n"
  }
];

interface SlashCommandMenuProps {
  isOpen: boolean;
  query: string;
  onSelect: (template: string) => void;
  onClose: () => void;
  position?: { top: number; left: number };
}

export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  isOpen,
  query,
  onSelect,
  onClose,
  position
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const cleanQuery = query.replace(/^\//, '').toLowerCase().trim();
  const filteredCommands = SLASH_COMMANDS.filter(cmd => 
    cmd.command.toLowerCase().includes(cleanQuery) ||
    cmd.label.toLowerCase().includes(cleanQuery) ||
    cmd.description.toLowerCase().includes(cleanQuery)
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [cleanQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || filteredCommands.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        onSelect(filteredCommands[selectedIndex].template);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onSelect, onClose]);

  if (!isOpen || filteredCommands.length === 0) return null;

  const style: React.CSSProperties = position 
    ? { top: `${position.top}px`, left: `${position.left}px` } 
    : {};

  return (
    <div
      ref={menuRef}
      style={style}
      className="absolute z-50 w-72 bg-[#0A0A0A] border border-[#262626] shadow-2xl font-mono select-none overflow-hidden"
    >
      <div className="px-3 py-1.5 bg-[#111111] border-b border-[#1F1F1F] text-[10px] text-[#71717A] flex items-center justify-between font-bold">
        <span>SLASH COMMANDS</span>
        <span>{filteredCommands.length} AVAILABLE</span>
      </div>

      <div className="max-h-64 overflow-y-auto p-1 space-y-0.5 custom-scrollbar">
        {filteredCommands.map((cmd, index) => {
          const isSelected = index === selectedIndex;
          return (
            <div
              key={cmd.id}
              onClick={() => onSelect(cmd.template)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`px-2.5 py-1.5 flex items-center gap-2 cursor-pointer transition-colors text-xs border ${
                isSelected 
                  ? 'bg-[#18181B] text-[#FFFFFF] border-[#FFFFFF]' 
                  : 'bg-transparent text-[#A1A1AA] border-transparent hover:text-[#FFFFFF]'
              }`}
            >
              <span className={`p-1 border shrink-0 ${
                isSelected 
                  ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]' 
                  : 'bg-[#141414] text-[#71717A] border-[#262626]'
              }`}>
                {cmd.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-bold flex items-center justify-between">
                  <span>{cmd.label}</span>
                  <span className="text-[10px] text-[#71717A] font-normal">{cmd.command}</span>
                </div>
                <div className="text-[10px] text-[#71717A] truncate">{cmd.description}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-2 py-1 bg-[#0A0A0A] border-t border-[#1F1F1F] text-[9px] text-[#52525B] flex justify-between">
        <span>UP/DOWN NAVIGATE</span>
        <span>ENTER SELECT</span>
        <span>ESC DISMISS</span>
      </div>
    </div>
  );
};
