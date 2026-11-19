import React, { useState, useEffect, useRef } from 'react';
import { BrowserTab } from '../../../types';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { useBrowser } from '../../../context/BrowserContext';
import { useDocuments } from '../../../context/DocumentContext';
import { 
  Play, 
  RotateCw, 
  FileDown, 
  Check, 
  Terminal, 
  Code2, 
  Trash2, 
  Layers,
  Sparkles
} from 'lucide-react';

interface CodeSandboxProps {
  tab: BrowserTab;
}

interface SandboxFiles {
  html: string;
  css: string;
  js: string;
}

interface ConsoleEntry {
  id: string;
  level: 'log' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

const TEMPLATES: Record<string, { label: string; files: SandboxFiles }> = {
  threejs: {
    label: 'THREE.JS WIREFRAME CUBE',
    files: {
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Three.js Wireframe</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body>
  <div id="canvas-container"></div>
</body>
</html>`,
      css: `body {
  margin: 0;
  background-color: #000000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #ffffff;
  font-family: monospace;
}
#canvas-container {
  width: 100vw;
  height: 100vh;
}`,
      js: `// Three.js Wireframe Cube Demo
console.log("Initializing Three.js WebGL Scene...");

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Wireframe Box Geometry
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const material = new THREE.MeshBasicMaterial({ 
  color: 0xffffff, 
  wireframe: true 
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

console.log("Scene initialized at 60 FPS");

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.015;
  renderer.render(scene, camera);
}
animate();`
    }
  },
  audio: {
    label: 'CANVAS FFT AUDIO SPECTRUM',
    files: {
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Canvas FFT Visualizer</title>
</head>
<body>
  <div class="hud">CANVAS 60FPS MONOCHROME FFT SIMULATOR</div>
  <canvas id="spectrum"></canvas>
</body>
</html>`,
      css: `body {
  margin: 0;
  background-color: #050505;
  overflow: hidden;
  font-family: monospace;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.hud {
  font-size: 11px;
  color: #737373;
  margin-bottom: 12px;
  letter-spacing: 0.1em;
}
canvas {
  border: 1px solid #262626;
  background-color: #000000;
}`,
      js: `// Simulated FFT 60 FPS Visualizer
console.log("Starting Canvas 60 FPS FFT simulator...");

const canvas = document.getElementById('spectrum');
canvas.width = 460;
canvas.height = 180;
const ctx = canvas.getContext('2d');

const numBars = 32;
const bars = new Array(numBars).fill(0);

function render() {
  requestAnimationFrame(render);
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / numBars) - 2;

  for (let i = 0; i < numBars; i++) {
    // Generate organic undulating frequency bars
    const target = (Math.sin(Date.now() * 0.005 + i * 0.3) + 1) * 0.4 + Math.random() * 0.2;
    bars[i] += (target - bars[i]) * 0.2;
    const h = bars[i] * (canvas.height - 20);

    ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#A3A3A3';
    ctx.fillRect(i * (barWidth + 2) + 2, canvas.height - h - 10, barWidth, h);
  }
}
render();
console.log("Visualizer running smoothly.");`
    }
  },
  matrix: {
    label: 'TERMINAL MATRIX RAIN',
    files: {
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Matrix Rain</title>
</head>
<body>
  <canvas id="matrix"></canvas>
</body>
</html>`,
      css: `body {
  margin: 0;
  background-color: #000000;
  overflow: hidden;
}
canvas {
  display: block;
}`,
      js: `// Monochrome Digital Rain
console.log("Initializing Monochrome Stream...");

const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = '0123456789ABCDEFWHITESPACE';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];
for (let i = 0; i < columns; i++) drops[i] = 1;

function draw() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = chars.charAt(Math.floor(Math.random() * chars.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(draw, 33);
console.log("Monochrome stream active.");`
    }
  }
};

export const CodeSandbox: React.FC<CodeSandboxProps> = ({ tab }) => {
  const { activeSpace, activeMember } = useWorkspace();
  const { updateTab } = useBrowser();
  const { createDocument, setActiveDocumentId } = useDocuments();

  const [activeTabLang, setActiveTabLang] = useState<'html' | 'css' | 'js'>('js');
  const [files, setFiles] = useState<SandboxFiles>(() => tab.data?.files || TEMPLATES.threejs.files);
  const [logs, setLogs] = useState<ConsoleEntry[]>([]);
  const [runKey, setRunKey] = useState(0);
  const [indexedFeedback, setIndexedFeedback] = useState<string | null>(null);

  // Sync state to tab data
  const handleCodeChange = (lang: 'html' | 'css' | 'js', value: string) => {
    const updated = { ...files, [lang]: value };
    setFiles(updated);
    updateTab(tab.id, { data: { files: updated } });
  };

  const loadTemplate = (key: string) => {
    const tmpl = TEMPLATES[key];
    if (tmpl) {
      setFiles(tmpl.files);
      setLogs([]);
      updateTab(tab.id, { data: { files: tmpl.files } });
      setRunKey(k => k + 1);
    }
  };

  // Intercept sandbox iframe console messages
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'SANDBOX_LOG') {
        const entry: ConsoleEntry = {
          id: `${Date.now()}-${Math.random()}`,
          level: e.data.level || 'log',
          message: e.data.message || '',
          timestamp: new Date().toLocaleTimeString()
        };
        setLogs(prev => [...prev.slice(-49), entry]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleRun = () => {
    setLogs([]);
    setRunKey(k => k + 1);
  };

  const handleSaveSnippet = () => {
    const title = `SNIPPET_SANDBOX_${Date.now().toString(36).toUpperCase()}`;
    const now = new Date().toISOString();
    const content = `# Code Sandbox Snippet: ${title}\n\n` +
      `- Author: \`${activeMember.name}\`\n` +
      `- Space: \`${activeSpace.name}\`\n` +
      `- Timestamp: \`${now}\`\n\n` +
      `## HTML\n\`\`\`html\n${files.html}\n\`\`\`\n\n` +
      `## CSS\n\`\`\`css\n${files.css}\n\`\`\`\n\n` +
      `## JavaScript\n\`\`\`javascript\n${files.js}\n\`\`\`\n\n` +
      `---\n*Saved directly from Monochrome Code Sandbox and indexed for local RAG retrieval.*`;

    const doc = createDocument(activeSpace.id, title, content, 'md');
    if (doc) {
      setActiveDocumentId(doc.id);
      setIndexedFeedback(`SAVED // ${doc.title}`);
      setTimeout(() => setIndexedFeedback(null), 2500);
    }
  };

  // Assemble sandboxed HTML document
  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${files.css}</style>
        <script>
          (function() {
            const _log = console.log;
            const _warn = console.warn;
            const _err = console.error;

            console.log = function(...args) {
              window.parent.postMessage({
                type: 'SANDBOX_LOG',
                level: 'log',
                message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
              }, '*');
              _log.apply(console, args);
            };

            console.warn = function(...args) {
              window.parent.postMessage({
                type: 'SANDBOX_LOG',
                level: 'warn',
                message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
              }, '*');
              _warn.apply(console, args);
            };

            console.error = function(...args) {
              window.parent.postMessage({
                type: 'SANDBOX_LOG',
                level: 'error',
                message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
              }, '*');
              _err.apply(console, args);
            };

            window.onerror = function(msg, url, line) {
              window.parent.postMessage({
                type: 'SANDBOX_LOG',
                level: 'error',
                message: msg + ' (Line ' + line + ')'
              }, '*');
            };
          })();
        </script>
      </head>
      <body>
        ${files.html}
        <script>${files.js}</script>
      </body>
    </html>
  `;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#000000] text-[#FFFFFF] font-mono select-none overflow-hidden">
      {/* 1. Header Toolbar */}
      <div className="h-10 bg-[#0A0A0A] border-b border-[#1F1F1F] px-3 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Code2 size={15} className="text-[#FFFFFF]" />
          <span className="text-xs font-bold tracking-wider text-[#FFFFFF] uppercase">
            MONOCHROME CODE SANDBOX
          </span>
          <span className="text-[10px] text-[#A1A1AA] bg-[#141414] px-1.5 py-0.2 border border-[#262626] font-bold">
            LIVE RUNNER
          </span>
        </div>

        {/* Template Quick Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-[#71717A] uppercase font-bold shrink-0">TEMPLATES:</span>
          {Object.entries(TEMPLATES).map(([k, t]) => (
            <button
              key={k}
              onClick={() => loadTemplate(k)}
              className="px-2 py-0.5 text-[10px] bg-[#111111] hover:bg-[#18181B] text-[#A1A1AA] hover:text-[#FFFFFF] border border-[#1F1F1F] hover:border-[#3F3F46] shrink-0 transition-colors"
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRun}
            title="Execute code in sandboxed iframe"
            className="px-3 py-1 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#CCCCCC] flex items-center gap-1.5 transition-colors"
          >
            <Play size={12} fill="#000000" />
            <span>RUN</span>
          </button>

          <button
            onClick={handleSaveSnippet}
            title="Snapshot code into Space Docs"
            className={`px-3 py-1 text-xs font-bold border flex items-center gap-1.5 transition-all ${
              indexedFeedback
                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                : 'bg-[#111111] hover:bg-[#18181B] text-[#FFFFFF] border-[#262626] hover:border-[#FFFFFF]'
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
                <span>SAVE SNIPPET</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Workspace: Split Editor & Preview */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Half: Multi-tab Code Editor */}
        <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-[#1F1F1F] bg-[#0A0A0A]">
          {/* Language Tabs */}
          <div className="h-9 bg-[#0A0A0A] border-b border-[#1F1F1F] px-2 flex items-center gap-1 shrink-0">
            {(['js', 'html', 'css'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setActiveTabLang(lang)}
                className={`px-3 py-1 text-xs border uppercase font-bold transition-colors ${
                  activeTabLang === lang
                    ? 'bg-[#18181B] text-[#FFFFFF] border-[#3F3F46]'
                    : 'bg-transparent text-[#71717A] border-transparent hover:text-[#FFFFFF]'
                }`}
              >
                {lang === 'js' ? 'JAVASCRIPT' : lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Text Editor Area */}
          <div className="flex-1 relative bg-[#000000]">
            <textarea
              value={files[activeTabLang]}
              onChange={e => handleCodeChange(activeTabLang, e.target.value)}
              placeholder={`Write ${activeTabLang.toUpperCase()} code here...`}
              className="w-full h-full p-4 bg-transparent text-xs font-mono text-[#FFFFFF] outline-none resize-none selection:bg-[#FFFFFF] selection:text-[#000000] leading-relaxed custom-scrollbar"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right Half: Live Sandbox Preview + Console Logs */}
        <div className="flex-1 flex flex-col bg-[#000000] overflow-hidden">
          {/* Sandboxed Execution Iframe */}
          <div className="flex-1 relative border-b border-[#1F1F1F]">
            <iframe
              key={runKey}
              srcDoc={srcDoc}
              title="Code Sandbox Preview"
              sandbox="allow-scripts"
              className="w-full h-full border-none bg-[#000000]"
            />
          </div>

          {/* Console Output Terminal */}
          <div className="h-44 bg-[#0A0A0A] flex flex-col shrink-0 font-mono text-xs">
            <div className="h-7 bg-[#111111] border-b border-[#1F1F1F] px-3 flex items-center justify-between text-[10px] text-[#71717A]">
              <div className="flex items-center gap-1.5 font-bold">
                <Terminal size={11} className="text-[#A1A1AA]" />
                <span>SANDBOX CONSOLE LOGS ({logs.length})</span>
              </div>
              <button
                onClick={() => setLogs([])}
                title="Clear console output"
                className="hover:text-[#FFFFFF] p-1 flex items-center gap-1 transition-colors"
              >
                <Trash2 size={10} />
                <span>CLEAR</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-[#000000] custom-scrollbar">
              {logs.length === 0 ? (
                <div className="text-[10px] text-[#52525B] italic py-2 px-1">
                  Console output is empty. Run code with console.log() to inspect output.
                </div>
              ) : (
                logs.map(log => (
                  <div
                    key={log.id}
                    className={`flex items-start gap-2 text-[11px] py-0.5 px-1 ${
                      log.level === 'error'
                        ? 'text-[#FFFFFF] bg-[#18181B] border-l-2 border-[#FFFFFF]'
                        : log.level === 'warn'
                        ? 'text-[#E4E4E7]'
                        : 'text-[#A1A1AA]'
                    }`}
                  >
                    <span className="text-[9px] text-[#71717A] shrink-0">{log.timestamp}</span>
                    <span className="text-[9px] font-bold px-1 bg-[#141414] border border-[#262626] shrink-0 text-[#FFFFFF]">
                      {log.level.toUpperCase()}
                    </span>
                    <span className="break-all whitespace-pre-wrap">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
