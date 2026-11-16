import React, { useState, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useDocuments } from '../../context/DocumentContext';
import { useTasks } from '../../context/TaskContext';
import { useBrowser } from '../../context/BrowserContext';
import { useRAG } from '../../context/RAGContext';
import { 
  generateContextMd, 
  generateBridgeScript, 
  generateFullJsonBackup, 
  restoreFromJsonBackup, 
  triggerFileDownload 
} from '../../services/workspaceExporter';
import { 
  Download, 
  FileText, 
  Terminal, 
  Database, 
  Upload, 
  Check, 
  AlertCircle, 
  X, 
  Layers, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface WorkspaceExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkspaceExportModal: React.FC<WorkspaceExportModalProps> = ({ isOpen, onClose }) => {
  const { spaces, activeSpace, members, activeMember } = useWorkspace();
  const { documents } = useDocuments();
  const { tasks } = useTasks();
  const { tabs } = useBrowser();
  const { totalChunksIndexed } = useRAG();

  const [feedback, setFeedback] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const sharedTabs = tabs.filter(t => t.isShared);
  const spaceDocs = documents.filter(d => d.spaceId === activeSpace.id);
  const spaceTasks = tasks.filter(t => t.spaceId === activeSpace.id);

  // 1. Export context.md
  const handleDownloadContextMd = () => {
    try {
      const content = generateContextMd({
        space: activeSpace,
        member: activeMember,
        documents,
        tasks,
        sharedTabs
      });
      const filename = `whitespace_${activeSpace.slug}_context.md`;
      triggerFileDownload(filename, content, 'text/markdown');
      setFeedback(`DOWNLOADED ${filename} (${(content.length / 1024).toFixed(1)} KB)`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback(`ERROR EXPORTING CONTEXT: ${err.message}`);
    }
  };

  // 2. Export wc_bridge.py
  const handleDownloadBridgeScript = () => {
    try {
      const script = generateBridgeScript(activeSpace.name);
      triggerFileDownload('wc_bridge.py', script, 'text/x-python');
      setFeedback('DOWNLOADED wc_bridge.py // READY FOR LOCAL PYTHON 3 RUN');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback(`ERROR GENERATING SCRIPT: ${err.message}`);
    }
  };

  // 3. Export Full JSON Backup
  const handleDownloadJsonBackup = () => {
    try {
      let chatStore = undefined;
      try {
        const rawChat = localStorage.getItem('whitespace_chat_store');
        if (rawChat) chatStore = JSON.parse(rawChat);
      } catch {
        // ignore
      }

      const jsonStr = generateFullJsonBackup({
        spaces,
        members,
        documents,
        tasks,
        tabs,
        chatStore
      });

      const filename = `whitespace_backup_${Date.now()}.json`;
      triggerFileDownload(filename, jsonStr, 'application/json');
      setFeedback(`DOWNLOADED COMPLETE SNAPSHOT (${(jsonStr.length / 1024).toFixed(1)} KB)`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback(`ERROR EXPORTING JSON: ${err.message}`);
    }
  };

  // 4. Restore from JSON File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    setFeedback(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = restoreFromJsonBackup(content);
      if (res.success) {
        setFeedback(`${res.message} // RELOADING IN 1.5S...`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setFeedback(`RESTORE FAILED: ${res.message}`);
        setIsRestoring(false);
      }
    };
    reader.onerror = () => {
      setFeedback('ERROR READING BACKUP FILE');
      setIsRestoring(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-mono select-none">
      <div className="w-full max-w-2xl bg-[#0C0C0C] border border-[#404040] p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <Download size={16} className="text-[#FFFFFF]" />
            <span className="text-xs font-bold tracking-wider text-[#FFFFFF] uppercase">
              WORKSPACE EXPORT & LOCAL AGENT BRIDGE
            </span>
          </div>
          <button onClick={onClose} className="text-[#A3A3A3] hover:text-[#FFFFFF]">
            <X size={15} />
          </button>
        </div>

        <p className="text-[11px] text-[#A3A3A3] leading-relaxed">
          Zero platform lock-in. Compile active space context into structured Markdown, standalone Python bridge script, or full JSON snapshots for Google Antigravity, Cursor, and local CLI tools.
        </p>

        {/* Manifest Metrics */}
        <div className="grid grid-cols-4 gap-2 bg-[#080808] border border-[#202020] p-3 text-center">
          <div>
            <div className="text-xs font-bold text-[#FFFFFF]">{spaceDocs.length}</div>
            <div className="text-[10px] text-[#737373]">SPACE DOCS</div>
          </div>
          <div>
            <div className="text-xs font-bold text-[#FFFFFF]">{spaceTasks.length}</div>
            <div className="text-[10px] text-[#737373]">SPACE TASKS</div>
          </div>
          <div>
            <div className="text-xs font-bold text-[#FFFFFF]">{sharedTabs.length}</div>
            <div className="text-[10px] text-[#737373]">SHARED TABS</div>
          </div>
          <div>
            <div className="text-xs font-bold text-[#FFFFFF]">{totalChunksIndexed}</div>
            <div className="text-[10px] text-[#737373]">RAG CHUNKS</div>
          </div>
        </div>

        {/* Action Downloads */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-1.5">
            <Layers size={13} />
            <span>ONE-CLICK LOCAL EXPORTS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Download context.md */}
            <button
              onClick={handleDownloadContextMd}
              className="p-3 bg-[#121212] hover:bg-[#1A1A1A] border border-[#262626] hover:border-[#FFFFFF] text-left transition-colors flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <FileText size={16} className="text-[#FFFFFF]" />
                <span className="text-[9px] text-[#737373] group-hover:text-[#FFFFFF]">MD</span>
              </div>
              <div>
                <div className="text-xs font-bold text-[#FFFFFF]">CONTEXT.MD</div>
                <div className="text-[10px] text-[#737373]">Compiled space knowledge</div>
              </div>
            </button>

            {/* Download wc_bridge.py */}
            <button
              onClick={handleDownloadBridgeScript}
              className="p-3 bg-[#121212] hover:bg-[#1A1A1A] border border-[#262626] hover:border-[#FFFFFF] text-left transition-colors flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <Terminal size={16} className="text-[#FFFFFF]" />
                <span className="text-[9px] text-[#737373] group-hover:text-[#FFFFFF]">PYTHON</span>
              </div>
              <div>
                <div className="text-xs font-bold text-[#FFFFFF]">WC_BRIDGE.PY</div>
                <div className="text-[10px] text-[#737373]">Antigravity/Cursor bridge</div>
              </div>
            </button>

            {/* Download JSON Backup */}
            <button
              onClick={handleDownloadJsonBackup}
              className="p-3 bg-[#121212] hover:bg-[#1A1A1A] border border-[#262626] hover:border-[#FFFFFF] text-left transition-colors flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <Database size={16} className="text-[#FFFFFF]" />
                <span className="text-[9px] text-[#737373] group-hover:text-[#FFFFFF]">JSON</span>
              </div>
              <div>
                <div className="text-xs font-bold text-[#FFFFFF]">FULL BACKUP</div>
                <div className="text-[10px] text-[#737373]">All spaces & chat histories</div>
              </div>
            </button>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="bg-[#080808] border border-[#202020] p-3 text-[11px] space-y-2">
          <div className="text-xs font-bold text-[#FFFFFF]">LOCAL AI AGENT WORKFLOW (GOOGLE ANTIGRAVITY & CURSOR)</div>
          <ol className="list-decimal pl-4 space-y-1 text-[#A3A3A3] text-[10px] leading-relaxed">
            <li>Download <code className="text-[#FFFFFF]">context.md</code> and <code className="text-[#FFFFFF]">wc_bridge.py</code> into your project root.</li>
            <li>Run <code className="text-[#FFFFFF]">python wc_bridge.py</code> to populate <code className="text-[#FFFFFF]">.whitespace/</code> with <code className="text-[#FFFFFF]">SOUL.MD</code>, <code className="text-[#FFFFFF]">DOCS/</code>, and <code className="text-[#FFFFFF]">TASKS.json</code>.</li>
            <li>Local agents read sub-millisecond context without cloud round-trips.</li>
          </ol>
        </div>

        {/* JSON Restore Section */}
        <div className="bg-[#080808] border border-[#202020] p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#FFFFFF] flex items-center gap-1.5">
              <Upload size={13} />
              <span>RESTORE FROM JSON BACKUP</span>
            </span>
            <span className="text-[10px] text-[#737373]">OVERWRITES LOCAL STORAGE</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isRestoring}
              className="px-3 py-1.5 bg-[#171717] hover:bg-[#222222] border border-[#333333] hover:border-[#FFFFFF] text-xs font-bold text-[#FFFFFF] flex items-center gap-2 transition-colors"
            >
              <Upload size={13} />
              <span>{isRestoring ? 'VERIFYING...' : 'SELECT BACKUP .JSON'}</span>
            </button>
            <span className="text-[10px] text-[#555555]">Schema verified before ingestion.</span>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className="p-2 bg-[#141414] border border-[#333333] text-xs text-[#FFFFFF] flex items-center gap-2">
            <Sparkles size={12} className="text-[#FFFFFF]" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-[#262626]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#CCCCCC]"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
