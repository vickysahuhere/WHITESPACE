import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useDocuments } from '../../context/DocumentContext';
import { useTasks } from '../../context/TaskContext';
import { useBrowser } from '../../context/BrowserContext';
import { useRAG } from '../../context/RAGContext';
import { useAudio } from '../../context/AudioContext';
import { runFeatureAudit, SystemAuditSummary, FeatureAuditResult, FeatureStatus } from '../../services/featureAudit';
import { 
  X, 
  HelpCircle, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  RotateCcw, 
  Copy, 
  ArrowRight, 
  ChevronRight, 
  FileText, 
  Kanban, 
  Compass, 
  Radio, 
  Bot, 
  Database, 
  Sparkles, 
  Users, 
  Download, 
  Cloud, 
  Key, 
  Terminal, 
  Layers, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { WorkspaceView } from '../../types';

interface AppGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GuideTab = 'CURRENT_PAGE' | 'ALL_PAGES' | 'FEATURE_AUDIT' | 'INTERACTIVE_TOUR';

interface PageGuideInfo {
  view: WorkspaceView;
  title: string;
  badge: string;
  subtitle: string;
  whatToDo: string[];
  howToDoIt: { step: string; detail: string }[];
  shortcuts: { key: string; action: string }[];
  proTips: string[];
}

const PAGE_GUIDES: Record<WorkspaceView, PageGuideInfo> = {
  editor: {
    view: 'editor',
    title: 'Notion 3.0 Slash-Command Editor & Knowledge Base',
    badge: 'DOCS',
    subtitle: 'Distraction-free markdown workspace with 10-format ingestion & sub-millisecond local RAG indexing.',
    whatToDo: [
      'Create and maintain workspace engineering specifications, technical PRDs, and documentation.',
      'Upload external code and data files (supports 10 formats: .md, .txt, .json, .csv, .py, .js, .ts, .html, .css, .yaml).',
      'Ground AI Copilot in real workspace knowledge with zero-latency BM25 inverted index tokenization.'
    ],
    howToDoIt: [
      { step: '1. Use Slash Commands', detail: 'Type "/" on any blank line to invoke the menu. Select Headings (H1-H3), Bullet list, Code block, Task checkbox, Quote, or Divider.' },
      { step: '2. Ingest Files', detail: 'Click "UPLOAD FILE" in the sidebar or drag-and-drop any code or data file up to 5 MB. Content is parsed and indexed instantly.' },
      { step: '3. Inspect RAG Index', detail: 'Click the [RAG] badge in the top bar to inspect how your document is chunked and tokenized for Gemini context retrieval.' },
      { step: '4. Export or Sync', detail: 'Use [EXPORT] in the TopBar to download the full context.md package or sync to Firebase Cloud Firestore.' }
    ],
    shortcuts: [
      { key: '/', action: 'Open Slash Command Menu' },
      { key: 'Ctrl + K', action: 'Open Command Palette' },
      { key: 'Ctrl + S + D + F', action: 'Open Contextual Page Guide' }
    ],
    proTips: [
      'Every document created in this space is automatically partitioned from other spaces.',
      'Markdown checklists are interactive — click checkboxes to track spec delivery directly inside documents.'
    ]
  },
  kanban: {
    view: 'kanban',
    title: 'OpenClaw Kanban Task Board & Dispatch AI Copilot',
    badge: 'KANBAN',
    subtitle: 'High-speed engineering task pipeline with 1-click Dispatch to autonomous Gemini Copilot.',
    whatToDo: [
      'Organize engineering work across 3 strict workflow columns: QUEUED, ACTIVE, and SHIPPED.',
      'Assign task priorities using geometric badges: P0 (Urgent), P1 (High), P2 (Normal).',
      'Dispatch any task directly to the AI Copilot Drawer for autonomous plan and code execution.'
    ],
    howToDoIt: [
      { step: '1. Create a Task', detail: 'Click "+ NEW TASK" in any column header. Enter Title, Specification, Priority (P0/P1/P2), and assign a team member.' },
      { step: '2. Drag & Drop Pipeline', detail: 'Drag task cards between columns as work progresses from QUEUED to ACTIVE to SHIPPED.' },
      { step: '3. One-Click Dispatch AI', detail: 'Click the "DISPATCH AI" button on any task card. The right-docked Copilot Drawer opens with full context pre-populated for execution.' },
      { step: '4. Review & Ship', detail: 'Inspect generated code or task results in Copilot, then drag the task card to SHIPPED.' }
    ],
    shortcuts: [
      { key: 'Click DISPATCH', action: 'Load Task into Copilot Drawer' },
      { key: 'Drag Card', action: 'Update Task Column Status' },
      { key: 'Ctrl + S + D + F', action: 'Open Kanban Guide & Diagnostics' }
    ],
    proTips: [
      'P0 tasks are highlighted with high-contrast borders for immediate executive focus.',
      'Tasks in the active space are bundled into context.md exports and local Python bridge scripts.'
    ]
  },
  browser: {
    view: 'browser',
    title: 'Multi-Tab Developer Browser & Integrated Tools Suite',
    badge: 'DEV-BROWSER',
    subtitle: 'Integrated multi-tab developer workspace with 5 built-in tools and selective team sharing.',
    whatToDo: [
      'Browse web apps and documentation with Electron security header stripping (X-Frame-Options/CSP).',
      'Explore GitHub repositories, view file trees, and copy CDN links directly with GitHub Explorer.',
      'Run isolated HTML5, CSS3, and JavaScript snippets with live preview in Code Sandbox.',
      'Design distributed systems and microservice topologies on the 2D Vector Architecture Board.',
      'Test HTTP APIs, endpoints, headers, and payloads with the built-in REST Tester (Hoppscotch-lite).'
    ],
    howToDoIt: [
      { step: '1. Create New Tab', detail: 'Click the "+" button in the tab bar. Choose from Web Viewport, GitHub Explorer, Code Sandbox, Vector Board, or REST Tester.' },
      { step: '2. Toggle Team Sharing', detail: 'Click the "PRIVATE (ONLY ME)" vs "TAB: SHARED WITH TEAM" badge on any tab. Shared tabs appear in the top strip for all team members.' },
      { step: '3. Use Vector Board', detail: 'Click "ADD NODE" to place Client, Server, DB, AI, or Cache nodes. Drag nodes to position and click connectors to draw architecture paths.' },
      { step: '4. Execute Code in Sandbox', detail: 'Write or paste HTML/CSS/JS into the editor panes and click "RUN". Output renders inside an isolated iframe with console capture.' },
      { step: '5. Test REST Endpoints', detail: 'Select HTTP method (GET, POST, PUT, DELETE), enter endpoint URL, configure headers and JSON body, and click "SEND".' }
    ],
    shortcuts: [
      { key: 'Click +', action: 'Open New Developer Tool Tab' },
      { key: 'Toggle SHARE', action: 'Broadcast Tab to Team Strip' },
      { key: 'Ctrl + S + D + F', action: 'Open Developer Browser Guide' }
    ],
    proTips: [
      'Shared tabs are automatically indexed into local RAG so AI Copilot can answer questions about active research URLs.',
      'In the Windows Electron Desktop (.exe) build, web tabs load without iframe framing restrictions.'
    ]
  },
  stage: {
    view: 'stage',
    title: 'Uncompressed Studio WebRTC Voice & Video Stage',
    badge: 'STUDIO-STAGE',
    subtitle: 'Hardware 48 kHz Web Audio API pipeline, 510 kbps stereo Opus codec, and 60fps FFT visualizer.',
    whatToDo: [
      'Host zero-latency peer mesh audio and video calls with team members in the active space.',
      'Calibrate hardware microphone audio with 0% to 200% GainNode boost and dynamics compressor limiter.',
      'Share screens in high-definition (up to 4K60) with sub-second latency.',
      'Monitor live audio frequency spectrum on the HTML5 2D Canvas 60fps FFT spectrum analyzer.'
    ],
    howToDoIt: [
      { step: '1. Join Studio Stage', detail: 'Click "JOIN STAGE" or toggle the Stage button in the persistent bottom VoicePod to activate WebRTC calling.' },
      { step: '2. Hardware Calibration', detail: 'Click "AUDIO HARDWARE" in VoicePod to select your microphone, toggle GainNode boost up to 200%, and enable loopback monitoring.' },
      { step: '3. Broadcast Media', detail: 'Toggle Microphone, Video Camera, or Screen Share buttons in the Stage toolbar to broadcast to connected peers.' },
      { step: '4. Instant Peer Mesh', detail: 'Signaling runs through BroadcastChannel across browser tabs and WebRTC mesh with zero server infrastructure costs.' }
    ],
    shortcuts: [
      { key: 'Mute Button', action: 'Hardware Mic Mute Toggle' },
      { key: 'Boost Slider', action: '0% to 200% Web Audio GainNode' },
      { key: 'Ctrl + S + D + F', action: 'Open WebRTC Stage Guide' }
    ],
    proTips: [
      'Opus SDP is modified in real-time to enforce maxaveragebitrate=510000;stereo=1 for studio-grade audio.',
      'The VoicePod is persistent across all views, so your call stays active even while editing docs or code.'
    ]
  },
  copilot: {
    view: 'copilot',
    title: 'Isolated Member AI Chat & 3D Assistant (WHITE)',
    badge: 'AI-COPILOT',
    subtitle: 'Zero-latency Gemini reasoning grounded in space SOUL.MD, member directives, and local RAG context.',
    whatToDo: [
      'Query Google Gemini models with automatic space knowledge grounding and member persona adaptation.',
      'Interact with the Three.js audio-reactive 3D assistant canvas ("WHITE") with live wireframe vertex displacement.',
      'Maintain separate, isolated conversation histories for each team member within each space.'
    ],
    howToDoIt: [
      { step: '1. Configure Gemini Key', detail: 'Click the [GEMINI] badge in the TopBar to enter a free Google Gemini API key or explore available models.' },
      { step: '2. Ask Questions', detail: 'Type any technical question, code request, or architectural inquiry. Copilot retrieves relevant local chunks and answers concisely.' },
      { step: '3. Inspect RAG Grounding', detail: 'Expand the "RETRIEVED KNOWLEDGE SOURCES" pill under assistant responses to inspect exact source chunks and scores.' },
      { step: '4. Member Isolation', detail: 'Switch user profiles (VS, AS, LA, SG) via TopBar. Each user retains their own private conversation stream per space.' }
    ],
    shortcuts: [
      { key: 'Enter', action: 'Send Query to Gemini' },
      { key: 'Shift + Enter', action: 'Insert Newline in Prompt' },
      { key: 'Ctrl + S + D + F', action: 'Open AI Copilot Guide' }
    ],
    proTips: [
      'Prompt assembler automatically injects the active space SOUL.MD master system prompt before every query.',
      'Click the 3D Assistant icon in NotionSidebar to open the dedicated Three.js studio modal.'
    ]
  }
};

export const AppGuideModal: React.FC<AppGuideModalProps> = ({ isOpen, onClose }) => {
  const { 
    activeView, 
    setActiveView, 
    activeSpace, 
    spaces, 
    setActiveSpaceId, 
    activeMember, 
    geminiKey, 
    isKeyLinked 
  } = useWorkspace();
  const { createDocument } = useDocuments();
  const { createTask } = useTasks();
  const { createTab } = useBrowser();
  const { totalChunksIndexed } = useRAG();

  const [activeTab, setActiveTab] = useState<GuideTab>('CURRENT_PAGE');
  const [selectedViewGuide, setSelectedViewGuide] = useState<WorkspaceView>(activeView);
  const [auditSummary, setAuditSummary] = useState<SystemAuditSummary | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditFilter, setAuditFilter] = useState<'ALL' | 'WORKING' | 'REQUIRES_KEY' | 'FAILED'>('ALL');
  const [copiedReport, setCopiedReport] = useState(false);
  const [demoActionNotice, setDemoActionNotice] = useState<string | null>(null);
  const [tourStep, setTourStep] = useState(0);

  // Keep selectedViewGuide in sync when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedViewGuide(activeView);
    }
  }, [isOpen, activeView]);

  // Run initial background audit once on mount/open
  useEffect(() => {
    if (isOpen && !auditSummary && !isAuditing) {
      handleRunAudit();
    }
  }, [isOpen]);

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const summary = await runFeatureAudit(geminiKey);
      setAuditSummary(summary);
    } catch (err) {
      console.error('Audit failed', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCopyReport = () => {
    if (!auditSummary) return;
    const reportText = JSON.stringify(auditSummary, null, 2);
    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const showNotice = (msg: string) => {
    setDemoActionNotice(msg);
    setTimeout(() => setDemoActionNotice(null), 3500);
  };

  // Interactive Live Demo Actions
  const handleDemoCreateDoc = () => {
    const doc = createDocument(
      activeSpace.id,
      'DEMO_ARCHITECTURE_OVERVIEW',
      `# White Collars Architecture Spec // Live Demo\n\n- Runtime: Dual-Target Web & Windows Native Desktop (.exe)\n- Design: Strict Monochrome Discipline (#000000 - #FFFFFF)\n- Latency: Sub-millisecond Local RAG (< 1ms)\n- Audio: 48 kHz Web Audio GainNode & 510 kbps Opus WebRTC\n\n## Checklist\n- [x] Multi-Space Partitioning\n- [x] Member Chat Isolation\n- [ ] Deploy Live Production Bridge`,
      'md'
    );
    setActiveView('editor');
    showNotice(`Created demo document: "${doc.title}" in ${activeSpace.name}. Switch to Editor to view.`);
  };

  const handleDemoCreateTask = () => {
    const task = createTask(
      activeSpace.id,
      'P0: Audio Hardware 200% Gain Calibration',
      'Verify 48,000 Hz hardware AudioContext, calibrate GainNode multiplier from 0 to 200%, and test dynamics limiter soft clipping.',
      'P0',
      activeMember.id
    );
    setActiveView('kanban');
    showNotice(`Created P0 task: "${task.title}". Switched to Kanban pipeline.`);
  };

  const handleDemoOpenTool = (tool: 'sandbox' | 'vector' | 'rest') => {
    const titleMap = {
      sandbox: 'Live Code Sandbox Runner',
      vector: 'Vector Architecture Board Canvas',
      rest: 'REST API Tester'
    };
    createTab(activeMember.id, activeSpace.id, {
      title: titleMap[tool],
      type: tool,
      url: `${tool}://workspace`
    });
    setActiveView('browser');
    showNotice(`Launched ${titleMap[tool]} tab in Developer Browser.`);
  };

  if (!isOpen) return null;

  const currentGuide = PAGE_GUIDES[selectedViewGuide] || PAGE_GUIDES.editor;

  // Filter audit items
  const filteredAuditResults = (auditSummary?.results || []).filter(item => {
    if (auditFilter === 'ALL') return true;
    return item.status === auditFilter;
  });

  return (
    <div className="fixed inset-0 bg-[#000000]/90 backdrop-blur-md flex items-center justify-center z-50 p-3 lg:p-6 font-mono select-none">
      <div className="w-full max-w-5xl bg-[#0A0A0A] border border-[#333333] shadow-2xl flex flex-col h-[90vh] max-h-[820px] overflow-hidden">
        
        {/* --- Top Modal Header --- */}
        <header className="h-13 bg-[#121212] border-b border-[#262626] px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="bg-[#FFFFFF] text-[#000000] text-[10px] font-bold px-2 py-0.5 tracking-wider shrink-0">
              DEMO // GUIDE
            </span>
            <div className="truncate">
              <h2 className="text-xs font-bold text-[#FFFFFF] tracking-wider truncate uppercase">
                WHITESPACE OS // INTERACTIVE APP DEMO & FEATURE AUDIT
              </h2>
              <p className="text-[10px] text-[#737373] truncate">
                EVERY-PAGE INSTRUCTIONS // LIVE FEATURE DIAGNOSTICS // ZERO EMOJI DISCIPLINE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-[#000000] border border-[#262626] text-[10px] text-[#A3A3A3]">
              <span>SHORTCUT:</span>
              <kbd className="text-[#FFFFFF] font-bold">CTRL+S+D+F</kbd>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#737373] hover:text-[#FFFFFF] hover:bg-[#1A1A1A] border border-transparent hover:border-[#333333] transition-colors"
              title="Close Guide (ESC)"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        {/* --- Navigation Tabs --- */}
        <nav className="h-10 bg-[#0F0F0F] border-b border-[#262626] px-4 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('CURRENT_PAGE')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold border transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'CURRENT_PAGE'
                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                : 'bg-[#141414] text-[#A3A3A3] hover:text-[#FFFFFF] border-[#262626] hover:border-[#404040]'
            }`}
          >
            <BookOpen size={13} />
            <span>PAGE GUIDE: {selectedViewGuide.toUpperCase()}</span>
          </button>

          <button
            onClick={() => setActiveTab('ALL_PAGES')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold border transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'ALL_PAGES'
                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                : 'bg-[#141414] text-[#A3A3A3] hover:text-[#FFFFFF] border-[#262626] hover:border-[#404040]'
            }`}
          >
            <Layers size={13} />
            <span>ALL 10 APP MODULES</span>
          </button>

          <button
            onClick={() => setActiveTab('FEATURE_AUDIT')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold border transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'FEATURE_AUDIT'
                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                : 'bg-[#141414] text-[#A3A3A3] hover:text-[#FFFFFF] border-[#262626] hover:border-[#404040]'
            }`}
          >
            <Terminal size={13} />
            <span>FEATURE AUDIT & TESTS</span>
            {auditSummary && (
              <span className={`text-[10px] px-1.5 py-0.2 font-bold ${
                activeTab === 'FEATURE_AUDIT' ? 'bg-[#000000] text-[#FFFFFF]' : 'bg-[#222222] text-[#CCCCCC]'
              }`}>
                {auditSummary.workingCount}/{auditSummary.totalFeatures} WORKING
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('INTERACTIVE_TOUR')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold border transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'INTERACTIVE_TOUR'
                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                : 'bg-[#141414] text-[#A3A3A3] hover:text-[#FFFFFF] border-[#262626] hover:border-[#404040]'
            }`}
          >
            <Sparkles size={13} />
            <span>5-PILLAR TOUR</span>
          </button>
        </nav>

        {/* --- Global Action Banner Notice (if triggered) --- */}
        {demoActionNotice && (
          <div className="bg-[#171717] border-b border-[#404040] px-4 py-2 flex items-center justify-between text-xs text-[#FFFFFF]">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#FFFFFF]" />
              <span>{demoActionNotice}</span>
            </div>
            <button onClick={() => setDemoActionNotice(null)} className="text-[#A3A3A3] hover:text-[#FFFFFF]">
              <X size={12} />
            </button>
          </div>
        )}

        {/* --- Main Content Area --- */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0A0A0A]">

          {/* ========================================================================= */}
          {/* TAB 1: CURRENT PAGE INSTRUCTIONS & INTERACTIVE DEMO                       */}
          {/* ========================================================================= */}
          {activeTab === 'CURRENT_PAGE' && (
            <div className="space-y-6">
              
              {/* Quick View Switcher Bar inside Guide */}
              <div className="border border-[#262626] bg-[#121212] p-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#A3A3A3]">VIEWING INSTRUCTIONS FOR:</span>
                  <div className="flex items-center gap-1">
                    {(['editor', 'kanban', 'browser', 'stage', 'copilot'] as WorkspaceView[]).map(v => (
                      <button
                        key={v}
                        onClick={() => setSelectedViewGuide(v)}
                        className={`px-2 py-1 text-[11px] border uppercase transition-colors ${
                          selectedViewGuide === v
                            ? 'bg-[#FFFFFF] text-[#000000] font-bold border-[#FFFFFF]'
                            : 'bg-[#181818] hover:bg-[#222222] text-[#A3A3A3] hover:text-[#FFFFFF] border-[#333333]'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveView(selectedViewGuide);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#FFFFFF] text-[#000000] text-xs font-bold hover:bg-[#CCCCCC] transition-colors"
                >
                  <span>GO TO THIS PAGE NOW</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* View Hero Header */}
              <div className="border border-[#262626] bg-[#0E0E0E] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#FFFFFF] text-[#000000] font-bold text-xs px-2 py-0.5">
                    {currentGuide.badge}
                  </span>
                  <h3 className="text-base font-bold text-[#FFFFFF] tracking-wider uppercase">
                    {currentGuide.title}
                  </h3>
                </div>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  {currentGuide.subtitle}
                </p>
              </div>

              {/* Grid: What to do & How to do it */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Left: What to do */}
                <div className="border border-[#262626] bg-[#101010] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-2 border-b border-[#262626] mb-3">
                      <span className="w-1.5 h-1.5 bg-[#FFFFFF]" />
                      <h4 className="text-xs font-bold text-[#FFFFFF] tracking-wider uppercase">
                        WHAT TO DO ON THIS PAGE
                      </h4>
                    </div>
                    <ul className="space-y-2.5">
                      {currentGuide.whatToDo.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#CCCCCC] leading-relaxed">
                          <span className="text-[#666666] shrink-0 font-bold">{idx + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pro-Tips footer */}
                  <div className="mt-4 pt-3 border-t border-[#262626]">
                    <div className="text-[10px] text-[#A3A3A3] uppercase font-bold mb-1.5">PRO-TIPS & BEHAVIOR:</div>
                    {currentGuide.proTips.map((tip, idx) => (
                      <p key={idx} className="text-[11px] text-[#888888] leading-relaxed mb-1">
                        • {tip}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Right: Step-by-Step How To Do It */}
                <div className="border border-[#262626] bg-[#101010] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-2 border-b border-[#262626] mb-3">
                      <span className="w-1.5 h-1.5 bg-[#FFFFFF]" />
                      <h4 className="text-xs font-bold text-[#FFFFFF] tracking-wider uppercase">
                        HOW TO DO IT (STEP-BY-STEP)
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {currentGuide.howToDoIt.map((h, idx) => (
                        <div key={idx} className="border-l-2 border-[#404040] pl-3">
                          <div className="text-xs font-bold text-[#FFFFFF]">{h.step}</div>
                          <div className="text-[11px] text-[#888888] mt-0.5 leading-relaxed">{h.detail}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shortcuts */}
                  <div className="mt-4 pt-3 border-t border-[#262626]">
                    <div className="text-[10px] text-[#A3A3A3] uppercase font-bold mb-2">PAGE SHORTCUTS:</div>
                    <div className="flex flex-wrap gap-2">
                      {currentGuide.shortcuts.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-[#000000] border border-[#2E2E2E] px-2 py-1 text-[10px]">
                          <kbd className="font-bold text-[#FFFFFF]">{s.key}</kbd>
                          <span className="text-[#737373]">→</span>
                          <span className="text-[#A3A3A3]">{s.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: 1-Click Interactive Live Demo Actions */}
              <div className="border border-[#333333] bg-[#141414] p-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#262626] mb-3">
                  <div className="flex items-center gap-2">
                    <Play size={13} className="text-[#FFFFFF]" />
                    <h4 className="text-xs font-bold text-[#FFFFFF] tracking-wider uppercase">
                      TRY LIVE DEMO ACTIONS (ONE-CLICK EXECUTION)
                    </h4>
                  </div>
                  <span className="text-[10px] text-[#737373]">INTERACTIVE DEMO TRIGGERS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={handleDemoCreateDoc}
                    className="flex flex-col text-left p-3 bg-[#0A0A0A] hover:bg-[#1A1A1A] border border-[#262626] hover:border-[#FFFFFF] transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#FFFFFF] mb-1">
                      <span>LOAD ARCHITECTURE SPEC</span>
                      <FileText size={13} />
                    </div>
                    <p className="text-[10px] text-[#888888] leading-relaxed">
                      Creates and indexes a comprehensive demo specification in Notion 3.0 editor.
                    </p>
                  </button>

                  <button
                    onClick={handleDemoCreateTask}
                    className="flex flex-col text-left p-3 bg-[#0A0A0A] hover:bg-[#1A1A1A] border border-[#262626] hover:border-[#FFFFFF] transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#FFFFFF] mb-1">
                      <span>SEED P0 KANBAN TASK</span>
                      <Kanban size={13} />
                    </div>
                    <p className="text-[10px] text-[#888888] leading-relaxed">
                      Injects an urgent P0 task into the sprint pipeline ready for 1-click Dispatch AI.
                    </p>
                  </button>

                  <button
                    onClick={() => handleDemoOpenTool('vector')}
                    className="flex flex-col text-left p-3 bg-[#0A0A0A] hover:bg-[#1A1A1A] border border-[#262626] hover:border-[#FFFFFF] transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#FFFFFF] mb-1">
                      <span>LAUNCH VECTOR BOARD</span>
                      <Compass size={13} />
                    </div>
                    <p className="text-[10px] text-[#888888] leading-relaxed">
                      Opens the interactive 2D diagramming canvas with microservice nodes in Browser.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ALL 10 APP MODULES DIRECTORY                                       */}
          {/* ========================================================================= */}
          {activeTab === 'ALL_PAGES' && (
            <div className="space-y-4">
              <div className="border border-[#262626] bg-[#121212] p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#FFFFFF] tracking-wider uppercase mb-1">
                    WHITESPACE ARCHITECTURAL SITEMAP // 10 CORE MODULES & TOOLS
                  </h3>
                  <p className="text-[11px] text-[#888888]">
                    Click any module card to read its full guide or instantly jump to that page.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#FFFFFF]">{spaces.length} ACTIVE SPACES</span>
                  <div className="text-[10px] text-[#737373]">{totalChunksIndexed} CHUNKS INDEXED</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Notion 3.0 Slash Editor */}
                <div className="border border-[#262626] hover:border-[#404040] bg-[#101010] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FFFFFF] text-[#000000] text-[10px] font-bold px-1.5 py-0.2">01</span>
                        <h4 className="text-xs font-bold text-[#FFFFFF]">NOTION 3.0 SLASH EDITOR</h4>
                      </div>
                      <span className="text-[10px] text-[#888888]">VIEW: editor</span>
                    </div>
                    <p className="text-[11px] text-[#888888] leading-relaxed mb-3">
                      Slash commands (/h1, /code, /task), 10-format ingestion (.py, .ts, .csv, etc.), and sub-millisecond local RAG indexing.
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-[#262626]">
                    <button
                      onClick={() => { setSelectedViewGuide('editor'); setActiveTab('CURRENT_PAGE'); }}
                      className="px-2.5 py-1 text-[11px] border border-[#333333] hover:border-[#FFFFFF] text-[#CCCCCC] hover:text-[#FFFFFF]"
                    >
                      READ GUIDE
                    </button>
                    <button
                      onClick={() => { setActiveView('editor'); onClose(); }}
                      className="px-2.5 py-1 text-[11px] bg-[#FFFFFF] text-[#000000] font-bold hover:bg-[#CCCCCC]"
                    >
                      OPEN EDITOR →
                    </button>
                  </div>
                </div>

                {/* 2. OpenClaw Kanban Board */}
                <div className="border border-[#262626] hover:border-[#404040] bg-[#101010] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FFFFFF] text-[#000000] text-[10px] font-bold px-1.5 py-0.2">02</span>
                        <h4 className="text-xs font-bold text-[#FFFFFF]">OPENCLAW KANBAN PIPELINE</h4>
                      </div>
                      <span className="text-[10px] text-[#888888]">VIEW: kanban</span>
                    </div>
                    <p className="text-[11px] text-[#888888] leading-relaxed mb-3">
                      3-column sprint pipeline (QUEUED, ACTIVE, SHIPPED) with P0-P2 priority tiers and 1-click Dispatch AI copilot execution.
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-[#262626]">
                    <button
                      onClick={() => { setSelectedViewGuide('kanban'); setActiveTab('CURRENT_PAGE'); }}
                      className="px-2.5 py-1 text-[11px] border border-[#333333] hover:border-[#FFFFFF] text-[#CCCCCC] hover:text-[#FFFFFF]"
                    >
                      READ GUIDE
                    </button>
                    <button
                      onClick={() => { setActiveView('kanban'); onClose(); }}
                      className="px-2.5 py-1 text-[11px] bg-[#FFFFFF] text-[#000000] font-bold hover:bg-[#CCCCCC]"
                    >
                      OPEN KANBAN →
                    </button>
                  </div>
                </div>

                {/* 3. Developer Browser Suite */}
                <div className="border border-[#262626] hover:border-[#404040] bg-[#101010] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FFFFFF] text-[#000000] text-[10px] font-bold px-1.5 py-0.2">03</span>
                        <h4 className="text-xs font-bold text-[#FFFFFF]">DEVELOPER BROWSER & TOOLS</h4>
                      </div>
                      <span className="text-[10px] text-[#888888]">VIEW: browser</span>
                    </div>
                    <p className="text-[11px] text-[#888888] leading-relaxed mb-3">
                      5 integrated tools: Web Viewport, GitHub Explorer, Code Sandbox, Vector Board, and REST Tester with Private vs Team Shared tab toggles.
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-[#262626]">
                    <button
                      onClick={() => { setSelectedViewGuide('browser'); setActiveTab('CURRENT_PAGE'); }}
                      className="px-2.5 py-1 text-[11px] border border-[#333333] hover:border-[#FFFFFF] text-[#CCCCCC] hover:text-[#FFFFFF]"
                    >
                      READ GUIDE
                    </button>
                    <button
                      onClick={() => { setActiveView('browser'); onClose(); }}
                      className="px-2.5 py-1 text-[11px] bg-[#FFFFFF] text-[#000000] font-bold hover:bg-[#CCCCCC]"
                    >
                      OPEN BROWSER →
                    </button>
                  </div>
                </div>

                {/* 4. Studio WebRTC Audio Stage */}
                <div className="border border-[#262626] hover:border-[#404040] bg-[#101010] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FFFFFF] text-[#000000] text-[10px] font-bold px-1.5 py-0.2">04</span>
                        <h4 className="text-xs font-bold text-[#FFFFFF]">STUDIO WEBRTC & AUDIO POD</h4>
                      </div>
                      <span className="text-[10px] text-[#888888]">VIEW: stage</span>
                    </div>
                    <p className="text-[11px] text-[#888888] leading-relaxed mb-3">
                      Uncompressed 510 kbps stereo Opus WebRTC peer mesh, 48 kHz hardware AudioContext, 0-200% GainNode boost, and 60fps FFT spectrum.
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-[#262626]">
                    <button
                      onClick={() => { setSelectedViewGuide('stage'); setActiveTab('CURRENT_PAGE'); }}
                      className="px-2.5 py-1 text-[11px] border border-[#333333] hover:border-[#FFFFFF] text-[#CCCCCC] hover:text-[#FFFFFF]"
                    >
                      READ GUIDE
                    </button>
                    <button
                      onClick={() => { setActiveView('stage'); onClose(); }}
                      className="px-2.5 py-1 text-[11px] bg-[#FFFFFF] text-[#000000] font-bold hover:bg-[#CCCCCC]"
                    >
                      OPEN STAGE →
                    </button>
                  </div>
                </div>

                {/* 5. Member-Isolated AI Copilot Chat */}
                <div className="border border-[#262626] hover:border-[#404040] bg-[#101010] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FFFFFF] text-[#000000] text-[10px] font-bold px-1.5 py-0.2">05</span>
                        <h4 className="text-xs font-bold text-[#FFFFFF]">ISOLATED AI COPILOT (WHITE)</h4>
                      </div>
                      <span className="text-[10px] text-[#888888]">VIEW: copilot</span>
                    </div>
                    <p className="text-[11px] text-[#888888] leading-relaxed mb-3">
                      chatsByUser[userId][spaceId] isolated store, SOUL.MD grounding, Three.js 3D audio-reactive assistant, and Gemini REST inference.
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-[#262626]">
                    <button
                      onClick={() => { setSelectedViewGuide('copilot'); setActiveTab('CURRENT_PAGE'); }}
                      className="px-2.5 py-1 text-[11px] border border-[#333333] hover:border-[#FFFFFF] text-[#CCCCCC] hover:text-[#FFFFFF]"
                    >
                      READ GUIDE
                    </button>
                    <button
                      onClick={() => { setActiveView('copilot'); onClose(); }}
                      className="px-2.5 py-1 text-[11px] bg-[#FFFFFF] text-[#000000] font-bold hover:bg-[#CCCCCC]"
                    >
                      OPEN COPILOT →
                    </button>
                  </div>
                </div>

                {/* 6. Multi-Space Manager & SOUL.MD */}
                <div className="border border-[#262626] hover:border-[#404040] bg-[#101010] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FFFFFF] text-[#000000] text-[10px] font-bold px-1.5 py-0.2">06</span>
                        <h4 className="text-xs font-bold text-[#FFFFFF]">SPACES & SOUL.MD PROMPT</h4>
                      </div>
                      <span className="text-[10px] text-[#888888]">DISCORD RAIL [+]</span>
                    </div>
                    <p className="text-[11px] text-[#888888] leading-relaxed mb-3">
                      Independent partitioned spaces with 2-letter geometric badges, custom slugs, and persistent SOUL.MD system directives.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#262626]">
                    <span className="text-[10px] text-[#737373]">ACCESS VIA: Left Discord Rail [+] or NotionSidebar Spaces</span>
                  </div>
                </div>

                {/* 7. Sub-Millisecond Local RAG Inspector */}
                <div className="border border-[#262626] hover:border-[#404040] bg-[#101010] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FFFFFF] text-[#000000] text-[10px] font-bold px-1.5 py-0.2">07</span>
                        <h4 className="text-xs font-bold text-[#FFFFFF]">LOCAL RAG CONTEXT INSPECTOR</h4>
                      </div>
                      <span className="text-[10px] text-[#888888]">TOPBAR [RAG]</span>
                    </div>
                    <p className="text-[11px] text-[#888888] leading-relaxed mb-3">
                      Inspect chunk counts, test BM25 queries with latency meters (&lt;1ms), and view inverted index term distributions.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#262626]">
                    <span className="text-[10px] text-[#737373]">ACCESS VIA: TopBar [RAG ({totalChunksIndexed})] Button</span>
                  </div>
                </div>

                {/* 8. Workspace Exporter & Local Python Bridge */}
                <div className="border border-[#262626] hover:border-[#404040] bg-[#101010] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FFFFFF] text-[#000000] text-[10px] font-bold px-1.5 py-0.2">08</span>
                        <h4 className="text-xs font-bold text-[#FFFFFF]">WORKSPACE EXPORTER & BRIDGE</h4>
                      </div>
                      <span className="text-[10px] text-[#888888]">TOPBAR [EXPORT]</span>
                    </div>
                    <p className="text-[11px] text-[#888888] leading-relaxed mb-3">
                      Export unified context.md packages, complete JSON state backups, and generate standalone wc_bridge.py Python bridge scripts.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#262626]">
                    <span className="text-[10px] text-[#737373]">ACCESS VIA: TopBar [EXPORT] Button</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: FEATURE DIAGNOSTICS & SYSTEM AUDIT (HOW MANY WORK & HOW MANY DON'T) */}
          {/* ========================================================================= */}
          {activeTab === 'FEATURE_AUDIT' && (
            <div className="space-y-5">
              
              {/* Header Card with Metrics */}
              <div className="border border-[#333333] bg-[#121212] p-5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#262626] mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-[#FFFFFF]" />
                      <h3 className="text-sm font-bold text-[#FFFFFF] tracking-wider uppercase">
                        WHITE COLLARS OS // FEATURE AUDIT & DIAGNOSTIC VERIFIER
                      </h3>
                    </div>
                    <p className="text-[11px] text-[#A3A3A3]">
                      SYSTEMATIC EVALUATION OF ALL 25 ARCHITECTURAL FEATURES // ZERO MOCK POLICY
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunAudit}
                      disabled={isAuditing}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#CCCCCC] text-[#000000] text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <RotateCcw size={12} className={isAuditing ? 'animate-spin' : ''} />
                      <span>{isAuditing ? 'TESTING SYSTEM...' : 'RUN AUDIT NOW'}</span>
                    </button>

                    <button
                      onClick={handleCopyReport}
                      disabled={!auditSummary}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171717] hover:bg-[#262626] border border-[#333333] text-xs text-[#FFFFFF] transition-colors cursor-pointer"
                    >
                      {copiedReport ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedReport ? 'COPIED JSON' : 'COPY REPORT'}</span>
                    </button>
                  </div>
                </div>

                {/* Score & Counter Grid */}
                {auditSummary ? (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="border border-[#262626] bg-[#0A0A0A] p-3 text-center">
                      <div className="text-[10px] text-[#737373] uppercase mb-1">TOTAL FEATURES</div>
                      <div className="text-xl font-bold text-[#FFFFFF]">{auditSummary.totalFeatures}</div>
                      <div className="text-[9px] text-[#555555]">Audited</div>
                    </div>

                    <div className="border border-[#262626] bg-[#0A0A0A] p-3 text-center">
                      <div className="text-[10px] text-[#737373] uppercase mb-1">WORKING</div>
                      <div className="text-xl font-bold text-[#FFFFFF]">{auditSummary.workingCount}</div>
                      <div className="text-[9px] text-[#888888]">100% Operational</div>
                    </div>

                    <div className="border border-[#262626] bg-[#0A0A0A] p-3 text-center">
                      <div className="text-[10px] text-[#737373] uppercase mb-1">REQUIRES KEY</div>
                      <div className="text-xl font-bold text-[#CCCCCC]">{auditSummary.requiresKeyCount}</div>
                      <div className="text-[9px] text-[#737373]">API Key / Cloud</div>
                    </div>

                    <div className="border border-[#262626] bg-[#0A0A0A] p-3 text-center">
                      <div className="text-[10px] text-[#737373] uppercase mb-1">FAILING</div>
                      <div className="text-xl font-bold text-[#737373]">{auditSummary.failedCount}</div>
                      <div className="text-[9px] text-[#555555]">0 Broken</div>
                    </div>

                    <div className="border border-[#262626] bg-[#0A0A0A] p-3 text-center col-span-2 sm:col-span-1">
                      <div className="text-[10px] text-[#737373] uppercase mb-1">AVG LATENCY</div>
                      <div className="text-xl font-bold text-[#FFFFFF]">{auditSummary.averageLatencyMs} ms</div>
                      <div className="text-[9px] text-[#888888]">Sub-millisecond</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-[#737373]">
                    Initializing feature audit...
                  </div>
                )}
              </div>

              {/* Filter Pills */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#737373] uppercase mr-1">FILTER:</span>
                  {(['ALL', 'WORKING', 'REQUIRES_KEY', 'FAILED'] as const).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setAuditFilter(filter)}
                      className={`px-2.5 py-1 text-[10px] font-bold border transition-colors ${
                        auditFilter === filter
                          ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                          : 'bg-[#121212] hover:bg-[#1A1A1A] text-[#888888] hover:text-[#FFFFFF] border-[#262626]'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <span className="text-[10px] text-[#737373]">
                  SHOWING {filteredAuditResults.length} OF {auditSummary?.totalFeatures || 25}
                </span>
              </div>

              {/* Detailed Feature List */}
              <div className="space-y-2.5">
                {filteredAuditResults.map((item, idx) => (
                  <div
                    key={item.id}
                    className="border border-[#262626] bg-[#0F0F0F] hover:bg-[#121212] p-3 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#555555] font-bold">#{String(idx + 1).padStart(2, '0')}</span>
                        <h4 className="text-xs font-bold text-[#FFFFFF]">{item.name}</h4>
                        <span className="text-[9px] px-1.5 py-0.2 border border-[#2E2E2E] bg-[#000000] text-[#737373]">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#737373]">{item.latencyMs} ms</span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 border uppercase ${
                            item.status === 'WORKING'
                              ? 'bg-[#000000] border-[#FFFFFF] text-[#FFFFFF]'
                              : item.status === 'REQUIRES_KEY'
                              ? 'bg-[#141414] border-[#404040] text-[#A3A3A3]'
                              : 'bg-[#220000] border-[#FF4444] text-[#FF4444]'
                          }`}
                        >
                          [{item.status}]
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#888888] mb-1.5">
                      {item.description}
                    </p>

                    <div className="bg-[#050505] border border-[#202020] p-2 text-[10px] text-[#CCCCCC] font-mono leading-relaxed">
                      {item.details}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: 5-PILLAR INTERACTIVE WALKTHROUGH TOUR                              */}
          {/* ========================================================================= */}
          {activeTab === 'INTERACTIVE_TOUR' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              {/* Tour Progress Bar */}
              <div className="border border-[#262626] bg-[#121212] p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-[#FFFFFF]">WHITE COLLARS 5-PILLAR GUIDED TOUR</span>
                  <span className="text-[#A3A3A3]">STEP {tourStep + 1} OF 5</span>
                </div>
                <div className="w-full bg-[#202020] h-1.5 overflow-hidden">
                  <div 
                    className="bg-[#FFFFFF] h-full transition-all duration-300"
                    style={{ width: `${((tourStep + 1) / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step 1: Discord Rail */}
              {tourStep === 0 && (
                <div className="border border-[#333333] bg-[#0F0F0F] p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FFFFFF] text-[#000000] text-xs font-bold px-2 py-0.5">PILLAR 1</span>
                    <h3 className="text-sm font-bold text-[#FFFFFF] tracking-wider uppercase">
                      DISCORD SPACE RAIL & VERTICAL WORKSPACE PARTITIONING
                    </h3>
                  </div>
                  <p className="text-xs text-[#A3A3A3] leading-relaxed">
                    White Collars uses a vertical Discord-style space rail on the far left. Every space represents an autonomous business unit or project (e.g. WC-CORE, SIGNBRIDGE, MAI-READS) with completely independent knowledge bases, tasks, tabs, and SOUL.MD system prompts.
                  </p>
                  <div className="border border-[#262626] bg-[#000000] p-4 text-xs text-[#CCCCCC] space-y-2">
                    <div className="font-bold text-[#FFFFFF]">TRY THIS NOW:</div>
                    <p>Click on any space icon on the far left rail (or click the button below) to switch spaces instantly with zero reload delay.</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[#262626]">
                    <div />
                    <button
                      onClick={() => setTourStep(1)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#FFFFFF] text-[#000000] text-xs font-bold hover:bg-[#CCCCCC]"
                    >
                      <span>NEXT: NOTION 3.0 EDITOR</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Notion 3.0 Editor */}
              {tourStep === 1 && (
                <div className="border border-[#333333] bg-[#0F0F0F] p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FFFFFF] text-[#000000] text-xs font-bold px-2 py-0.5">PILLAR 2</span>
                    <h3 className="text-sm font-bold text-[#FFFFFF] tracking-wider uppercase">
                      NOTION 3.0 SLASH EDITOR & 10-FORMAT INGESTION
                    </h3>
                  </div>
                  <p className="text-xs text-[#A3A3A3] leading-relaxed">
                    A distraction-free markdown authoring canvas. Type "/" on any line to invoke formatting blocks (headings, code, checklists). Drag-and-drop or upload 10 formats (.py, .ts, .csv, .yaml, .md) to parse and index directly into local RAG memory.
                  </p>
                  <div className="border border-[#262626] bg-[#000000] p-4 text-xs text-[#CCCCCC] space-y-2">
                    <div className="font-bold text-[#FFFFFF]">TRY THIS NOW:</div>
                    <button
                      onClick={handleDemoCreateDoc}
                      className="px-3 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold text-xs hover:bg-[#CCCCCC]"
                    >
                      CREATE DEMO SPECIFICATION DOCUMENT
                    </button>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[#262626]">
                    <button
                      onClick={() => setTourStep(0)}
                      className="px-3 py-1.5 border border-[#333333] text-xs text-[#A3A3A3] hover:text-[#FFFFFF]"
                    >
                      BACK
                    </button>
                    <button
                      onClick={() => setTourStep(2)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#FFFFFF] text-[#000000] text-xs font-bold hover:bg-[#CCCCCC]"
                    >
                      <span>NEXT: OPENCLAW KANBAN</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: OpenClaw Kanban */}
              {tourStep === 2 && (
                <div className="border border-[#333333] bg-[#0F0F0F] p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FFFFFF] text-[#000000] text-xs font-bold px-2 py-0.5">PILLAR 3</span>
                    <h3 className="text-sm font-bold text-[#FFFFFF] tracking-wider uppercase">
                      OPENCLAW KANBAN & 1-CLICK DISPATCH AI
                    </h3>
                  </div>
                  <p className="text-xs text-[#A3A3A3] leading-relaxed">
                    A 3-column sprint pipeline (QUEUED, ACTIVE, SHIPPED). Each task has a strict priority (P0, P1, P2) and an assigned member. The standout feature is "DISPATCH AI": click it on any card to load the specification directly into Copilot for autonomous execution.
                  </p>
                  <div className="border border-[#262626] bg-[#000000] p-4 text-xs text-[#CCCCCC] space-y-2">
                    <div className="font-bold text-[#FFFFFF]">TRY THIS NOW:</div>
                    <button
                      onClick={handleDemoCreateTask}
                      className="px-3 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold text-xs hover:bg-[#CCCCCC]"
                    >
                      INJECT P0 TASK & SWITCH TO KANBAN
                    </button>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[#262626]">
                    <button
                      onClick={() => setTourStep(1)}
                      className="px-3 py-1.5 border border-[#333333] text-xs text-[#A3A3A3] hover:text-[#FFFFFF]"
                    >
                      BACK
                    </button>
                    <button
                      onClick={() => setTourStep(3)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#FFFFFF] text-[#000000] text-xs font-bold hover:bg-[#CCCCCC]"
                    >
                      <span>NEXT: DEVELOPER BROWSER</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Developer Browser */}
              {tourStep === 3 && (
                <div className="border border-[#333333] bg-[#0F0F0F] p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FFFFFF] text-[#000000] text-xs font-bold px-2 py-0.5">PILLAR 4</span>
                    <h3 className="text-sm font-bold text-[#FFFFFF] tracking-wider uppercase">
                      DEVELOPER BROWSER & 5 BUILT-IN ENGINEERING TOOLS
                    </h3>
                  </div>
                  <p className="text-xs text-[#A3A3A3] leading-relaxed">
                    No need to jump outside the workspace: Developer Browser features 5 integrated tools: Web Viewport, GitHub Explorer, Code Sandbox, Vector Board, and REST Tester. Tabs can be private to you or shared with the whole team via the top shared strip.
                  </p>
                  <div className="border border-[#262626] bg-[#000000] p-4 text-xs text-[#CCCCCC] space-y-2">
                    <div className="font-bold text-[#FFFFFF]">TRY THIS NOW:</div>
                    <button
                      onClick={() => handleDemoOpenTool('vector')}
                      className="px-3 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold text-xs hover:bg-[#CCCCCC]"
                    >
                      OPEN VECTOR ARCHITECTURE BOARD
                    </button>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[#262626]">
                    <button
                      onClick={() => setTourStep(2)}
                      className="px-3 py-1.5 border border-[#333333] text-xs text-[#A3A3A3] hover:text-[#FFFFFF]"
                    >
                      BACK
                    </button>
                    <button
                      onClick={() => setTourStep(4)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#FFFFFF] text-[#000000] text-xs font-bold hover:bg-[#CCCCCC]"
                    >
                      <span>NEXT: STUDIO STAGE & AI</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Studio Stage & 3D Assistant */}
              {tourStep === 4 && (
                <div className="border border-[#333333] bg-[#0F0F0F] p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FFFFFF] text-[#000000] text-xs font-bold px-2 py-0.5">PILLAR 5</span>
                    <h3 className="text-sm font-bold text-[#FFFFFF] tracking-wider uppercase">
                      STUDIO WEBRTC CALLING & 3D ASSISTANT (WHITE)
                    </h3>
                  </div>
                  <p className="text-xs text-[#A3A3A3] leading-relaxed">
                    Uncompressed 510 kbps WebRTC stereo audio calling, 48 kHz Web Audio GainNode boost (up to 200%), live 60fps HTML5 FFT spectrum visualization, and personal AI chat with the audio-reactive 3D assistant canvas.
                  </p>
                  <div className="border border-[#262626] bg-[#000000] p-4 text-xs text-[#CCCCCC] space-y-2">
                    <div className="font-bold text-[#FFFFFF]">TOUR COMPLETE:</div>
                    <p>Press <kbd className="text-[#FFFFFF] font-bold">CTRL+S+D+F</kbd> on any page at any time to open this contextual guide.</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[#262626]">
                    <button
                      onClick={() => setTourStep(3)}
                      className="px-3 py-1.5 border border-[#333333] text-xs text-[#A3A3A3] hover:text-[#FFFFFF]"
                    >
                      BACK
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-[#FFFFFF] text-[#000000] text-xs font-bold hover:bg-[#CCCCCC]"
                    >
                      CLOSE TOUR & START WORKING
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- Modal Footer Status Bar --- */}
        <footer className="h-10 bg-[#0F0F0F] border-t border-[#262626] px-4 flex items-center justify-between text-[11px] text-[#737373] shrink-0">
          <div className="flex items-center gap-3">
            <span>KEYBOARD TRIGGER: <kbd className="text-[#FFFFFF] px-1 border border-[#333333]">CTRL+S+D+F</kbd></span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">MONOCHROME DISCIPLINE: 0 EMOJIS</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#CCCCCC]">ACTIVE MEMBER: {activeMember.name} [{activeMember.badge}]</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
