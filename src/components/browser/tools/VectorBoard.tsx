import React, { useState, useRef, useEffect } from 'react';
import { BrowserTab } from '../../../types';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { useBrowser } from '../../../context/BrowserContext';
import { useDocuments } from '../../../context/DocumentContext';
import { 
  Share2, 
  Plus, 
  Trash2, 
  RotateCcw, 
  FileDown, 
  Check, 
  ArrowRight, 
  MousePointer, 
  Link as LinkIcon,
  Maximize2
} from 'lucide-react';

interface VectorBoardProps {
  tab: BrowserTab;
}

export type VectorBadge = 'API' | 'DB' | 'AI' | 'SVC' | 'GW' | 'UI' | 'RTC';

export interface VectorNode {
  id: string;
  x: number;
  y: number;
  title: string;
  subtitle: string;
  badge: VectorBadge;
  status: 'ACTIVE' | 'IDLE' | 'SYNCING';
}

export interface VectorEdge {
  id: string;
  fromId: string;
  toId: string;
  label?: string;
}

const DEFAULT_WHITE_COLLARS_NODES: VectorNode[] = [
  {
    id: 'node-rail',
    x: 60,
    y: 80,
    title: 'DISCORD RAIL',
    subtitle: 'Space Router & Voice Switcher',
    badge: 'UI',
    status: 'ACTIVE'
  },
  {
    id: 'node-sidebar',
    x: 60,
    y: 220,
    title: 'NOTION SIDEBAR',
    subtitle: 'Page Tree & Ingestion Dropzone',
    badge: 'UI',
    status: 'ACTIVE'
  },
  {
    id: 'node-audio-pod',
    x: 60,
    y: 360,
    title: 'HARDWARE AUDIO POD',
    subtitle: '48kHz GainNode & Dynamics Limiter',
    badge: 'RTC',
    status: 'ACTIVE'
  },
  {
    id: 'node-rag',
    x: 360,
    y: 80,
    title: 'LOCAL RAG ENGINE',
    subtitle: '<1ms In-Memory Inverted Index',
    badge: 'DB',
    status: 'ACTIVE'
  },
  {
    id: 'node-copilot',
    x: 360,
    y: 220,
    title: 'GEMINI AI COPILOT',
    subtitle: 'Direct REST Prompt Assembler',
    badge: 'AI',
    status: 'ACTIVE'
  },
  {
    id: 'node-webrtc',
    x: 360,
    y: 360,
    title: 'WEBRTC STUDIO STAGE',
    subtitle: '510 kbps Stereo Opus Mesh',
    badge: 'SVC',
    status: 'ACTIVE'
  },
  {
    id: 'node-electron',
    x: 660,
    y: 220,
    title: 'ELECTRON RUNTIME',
    subtitle: 'Windows Native Frameless OS',
    badge: 'GW',
    status: 'ACTIVE'
  }
];

const DEFAULT_WHITE_COLLARS_EDGES: VectorEdge[] = [
  { id: 'edge-1', fromId: 'node-rail', toId: 'node-rag', label: 'Space Context' },
  { id: 'edge-2', fromId: 'node-sidebar', toId: 'node-rag', label: 'Raw Token Ingestion' },
  { id: 'edge-3', fromId: 'node-rag', toId: 'node-copilot', label: 'Sub-ms Embeddings' },
  { id: 'edge-4', fromId: 'node-audio-pod', toId: 'node-webrtc', label: 'Opus 48kHz Stream' },
  { id: 'edge-5', fromId: 'node-copilot', toId: 'node-electron', label: 'IPC Bridge' },
  { id: 'edge-6', fromId: 'node-webrtc', toId: 'node-electron', label: 'Hardware Display' }
];

export const VectorBoard: React.FC<VectorBoardProps> = ({ tab }) => {
  const { activeSpace, activeMember } = useWorkspace();
  const { updateTab } = useBrowser();
  const { createDocument, setActiveDocumentId } = useDocuments();

  const [nodes, setNodes] = useState<VectorNode[]>(() => tab.data?.nodes || DEFAULT_WHITE_COLLARS_NODES);
  const [edges, setEdges] = useState<VectorEdge[]>(() => tab.data?.edges || DEFAULT_WHITE_COLLARS_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);
  const [connectMode, setConnectMode] = useState<boolean>(false);
  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);
  const [indexedFeedback, setIndexedFeedback] = useState<string | null>(null);

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

  // Sync to tab data
  const persistState = (newNodes: VectorNode[], newEdges: VectorEdge[]) => {
    updateTab(tab.id, { data: { nodes: newNodes, edges: newEdges } });
  };

  const handleMouseDown = (node: VectorNode, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connectMode) {
      if (!connectSourceId) {
        setConnectSourceId(node.id);
      } else if (connectSourceId !== node.id) {
        // Create new edge
        const newEdge: VectorEdge = {
          id: `edge-${Date.now()}`,
          fromId: connectSourceId,
          toId: node.id,
          label: 'Data Link'
        };
        const updatedEdges = [...edges, newEdge];
        setEdges(updatedEdges);
        persistState(nodes, updatedEdges);
        setConnectSourceId(null);
        setConnectMode(false);
      }
      return;
    }

    setSelectedNodeId(node.id);
    setDraggingNodeId(node.id);

    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      dragOffsetRef.current = {
        x: (e.clientX - rect.left) - node.x,
        y: (e.clientY - rect.top) - node.y
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const newX = Math.max(10, Math.min(rect.width - 220, (e.clientX - rect.left) - dragOffsetRef.current.x));
    const newY = Math.max(10, Math.min(rect.height - 100, (e.clientY - rect.top) - dragOffsetRef.current.y));

    setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n));
  };

  const handleMouseUp = () => {
    if (draggingNodeId) {
      setDraggingNodeId(null);
      persistState(nodes, edges);
    }
  };

  const handleAddNode = (badge: VectorBadge) => {
    const newNode: VectorNode = {
      id: `node-${Date.now()}`,
      x: 200 + (nodes.length % 5) * 40,
      y: 120 + (nodes.length % 5) * 30,
      title: `NEW ${badge} COMPONENT`,
      subtitle: 'Configured Node Service',
      badge,
      status: 'ACTIVE'
    };
    const updated = [...nodes, newNode];
    setNodes(updated);
    setSelectedNodeId(newNode.id);
    setShowAddMenu(false);
    persistState(updated, edges);
  };

  const handleDeleteSelected = () => {
    if (!selectedNodeId) return;
    const updatedNodes = nodes.filter(n => n.id !== selectedNodeId);
    const updatedEdges = edges.filter(e => e.fromId !== selectedNodeId && e.toId !== selectedNodeId);
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setSelectedNodeId(null);
    persistState(updatedNodes, updatedEdges);
  };

  const handleResetTopology = () => {
    setNodes(DEFAULT_WHITE_COLLARS_NODES);
    setEdges(DEFAULT_WHITE_COLLARS_EDGES);
    setSelectedNodeId(null);
    setConnectSourceId(null);
    setConnectMode(false);
    persistState(DEFAULT_WHITE_COLLARS_NODES, DEFAULT_WHITE_COLLARS_EDGES);
  };

  const handleExportSpec = () => {
    const title = `ARCHITECTURE_SPEC_${activeSpace.name.toUpperCase().replace(/[^A-Z0-9_]/g, '_')}`;
    const now = new Date().toISOString();
    
    let content = `# Architecture Topology Spec: ${activeSpace.name}\n\n` +
      `- Designed By: \`${activeMember.name}\`\n` +
      `- Space: \`${activeSpace.name}\`\n` +
      `- Node Count: \`${nodes.length}\`\n` +
      `- Edge Count: \`${edges.length}\`\n` +
      `- Timestamp: \`${now}\`\n\n` +
      `## System Architecture Graph\n\n` +
      `\`\`\`mermaid\ngraph LR\n`;

    // Mermaid Nodes
    nodes.forEach(n => {
      content += `  ${n.id}["[${n.badge}] ${n.title}\\n(${n.subtitle})"]\n`;
    });

    // Mermaid Edges
    edges.forEach(e => {
      content += `  ${e.fromId} -->|${e.label || 'connects'}| ${e.toId}\n`;
    });

    content += `\`\`\`\n\n## Component Directory\n\n`;

    nodes.forEach(n => {
      content += `### [${n.badge}] ${n.title}\n` +
        `- **Role / Subtitle**: ${n.subtitle}\n` +
        `- **Status**: \`${n.status}\`\n` +
        `- **Coordinates**: \`(${Math.round(n.x)}, ${Math.round(n.y)})\`\n\n`;
    });

    content += `---\n*Exported directly from Vector Architecture Board and indexed into local RAG.*`;

    const doc = createDocument(activeSpace.id, title, content, 'md');
    if (doc) {
      setActiveDocumentId(doc.id);
      setIndexedFeedback(`EXPORTED // ${doc.title}`);
      setTimeout(() => setIndexedFeedback(null), 2500);
    }
  };

  // Node Center Calculator for Connectors
  const getNodeCenter = (id: string) => {
    const node = nodes.find(n => n.id === id);
    if (!node) return { x: 0, y: 0 };
    return {
      x: node.x + 105, // half of 210 width
      y: node.y + 36   // half of 72 height
    };
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505] text-[#FFFFFF] font-mono select-none overflow-hidden">
      {/* 1. Header Toolbar */}
      <div className="h-10 bg-[#0C0C0C] border-b border-[#262626] px-3 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Share2 size={16} className="text-[#FFFFFF]" />
          <span className="text-xs font-bold tracking-wider text-[#FFFFFF] uppercase">
            VECTOR ARCHITECTURE BOARD
          </span>
          <span className="text-[10px] text-[#737373] bg-[#121212] px-1.5 py-0.2 border border-[#262626]">
            INTERACTIVE GRAPH
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Add Node Menu */}
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="px-2.5 py-1 bg-[#121212] hover:bg-[#1C1C1C] text-[#FFFFFF] border border-[#262626] hover:border-[#404040] text-xs flex items-center gap-1.5"
            >
              <Plus size={12} />
              <span>ADD NODE</span>
            </button>

            {showAddMenu && (
              <div className="absolute top-8 left-0 z-50 w-44 bg-[#0E0E0E] border border-[#404040] shadow-2xl p-1 text-xs space-y-0.5">
                <div className="p-1 text-[9px] text-[#737373] border-b border-[#262626] uppercase font-bold">
                  SELECT COMPONENT TYPE
                </div>
                {(['SVC', 'API', 'DB', 'AI', 'GW', 'UI', 'RTC'] as VectorBadge[]).map(badge => (
                  <button
                    key={badge}
                    onClick={() => handleAddNode(badge)}
                    className="w-full p-1 text-left text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#1C1C1C] flex items-center justify-between"
                  >
                    <span>{badge} Node</span>
                    <span className="text-[9px] bg-[#171717] px-1 border border-[#333333] text-[#FFFFFF]">{badge}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Connect Mode Toggle */}
          <button
            onClick={() => {
              setConnectMode(!connectMode);
              setConnectSourceId(null);
            }}
            className={`px-2.5 py-1 text-xs border flex items-center gap-1.5 transition-colors ${
              connectMode
                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold'
                : 'bg-[#121212] hover:bg-[#1C1C1C] text-[#A3A3A3] hover:text-[#FFFFFF] border-[#262626]'
            }`}
          >
            <LinkIcon size={12} />
            <span>{connectMode ? (connectSourceId ? 'SELECT TARGET' : 'SELECT SOURCE') : 'CONNECT NODES'}</span>
          </button>

          {/* Delete Selected Node */}
          {selectedNodeId && (
            <button
              onClick={handleDeleteSelected}
              className="px-2 py-1 bg-[#1A1A1A] hover:bg-[#262626] text-[#FFFFFF] border border-[#404040] text-xs flex items-center gap-1"
            >
              <Trash2 size={11} />
              <span>DELETE</span>
            </button>
          )}

          {/* Reset Topology */}
          <button
            onClick={handleResetTopology}
            title="Reset to default White Collars topology"
            className="p-1.5 text-[#A3A3A3] hover:text-[#FFFFFF] bg-[#121212] border border-[#262626] hover:border-[#404040]"
          >
            <RotateCcw size={12} />
          </button>

          {/* EXPORT SPEC TO SPACE */}
          <button
            onClick={handleExportSpec}
            title="Export architecture graph to Space Docs and trigger RAG indexing"
            className={`px-3 py-1 text-xs font-bold border flex items-center gap-1.5 transition-all ${
              indexedFeedback
                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                : 'bg-[#121212] hover:bg-[#1C1C1C] text-[#FFFFFF] border-[#333333] hover:border-[#FFFFFF]'
            }`}
          >
            {indexedFeedback ? (
              <>
                <Check size={11} className="text-[#000000]" />
                <span>{indexedFeedback}</span>
              </>
            ) : (
              <>
                <FileDown size={11} />
                <span>EXPORT SPEC TO SPACE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Interactive SVG & HTML Canvas */}
      <div
        ref={boardRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => {
          setSelectedNodeId(null);
          setShowAddMenu(false);
        }}
        className="flex-1 relative bg-[#040404] overflow-hidden cursor-crosshair"
      >
        {/* Architectural Background Grid */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#404040 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* SVG Connectors Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#FFFFFF" />
            </marker>
          </defs>

          {edges.map(edge => {
            const from = getNodeCenter(edge.fromId);
            const to = getNodeCenter(edge.toId);
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;

            return (
              <g key={edge.id}>
                {/* Connector Path */}
                <path
                  d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                  fill="none"
                  stroke="#555555"
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                />
                {/* Edge Label Badge */}
                {edge.label && (
                  <text
                    x={midX}
                    y={midY - 6}
                    fill="#A3A3A3"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Render Draggable Nodes */}
        {nodes.map(node => {
          const isSelected = selectedNodeId === node.id;
          const isConnectSource = connectSourceId === node.id;

          return (
            <div
              key={node.id}
              style={{
                transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
                width: 210,
                height: 72
              }}
              onMouseDown={e => handleMouseDown(node, e)}
              className={`absolute top-0 left-0 bg-[#0B0B0B] border p-2 flex flex-col justify-between cursor-move shadow-xl transition-shadow ${
                isConnectSource
                  ? 'border-[#FFFFFF] ring-2 ring-[#FFFFFF] bg-[#141414]'
                  : isSelected
                  ? 'border-[#FFFFFF] ring-1 ring-[#FFFFFF]'
                  : 'border-[#262626] hover:border-[#444444]'
              }`}
            >
              {/* Header: Badge & Status */}
              <div className="flex items-center justify-between text-[10px]">
                <span className="bg-[#171717] border border-[#333333] px-1 py-0.2 text-[#FFFFFF] font-bold">
                  {node.badge}
                </span>
                <span className="text-[#555555] text-[9px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#FFFFFF] rounded-full inline-block" />
                  <span>{node.status}</span>
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="my-0.5">
                <div className="text-xs font-bold text-[#FFFFFF] truncate tracking-wide">
                  {node.title}
                </div>
                <div className="text-[10px] text-[#737373] truncate">
                  {node.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
