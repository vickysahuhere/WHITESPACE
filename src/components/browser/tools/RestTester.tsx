import React, { useState, useEffect } from 'react';
import { BrowserTab } from '../../../types';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { useBrowser } from '../../../context/BrowserContext';
import { useDocuments } from '../../../context/DocumentContext';
import { 
  Terminal, 
  Send, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  FileDown, 
  RotateCw, 
  Clock, 
  Database,
  AlertCircle
} from 'lucide-react';

interface RestTesterProps {
  tab: BrowserTab;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface KeyValueItem {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface RequestState {
  method: HttpMethod;
  url: string;
  headers: KeyValueItem[];
  params: KeyValueItem[];
  body: string;
}

interface ResponseState {
  status: number | null;
  statusText: string | null;
  timeMs: number | null;
  sizeBytes: number | null;
  headers: Record<string, string>;
  data: string | null;
  error?: string | null;
}

const PRESET_ENDPOINTS = [
  { name: 'GITHUB ZEN', method: 'GET' as HttpMethod, url: 'https://api.github.com/zen' },
  { name: 'GITHUB OCTOCAT', method: 'GET' as HttpMethod, url: 'https://api.github.com/users/octocat' },
  { name: 'HTTPBIN GET', method: 'GET' as HttpMethod, url: 'https://httpbin.org/get' },
  { name: 'HTTPBIN POST', method: 'POST' as HttpMethod, url: 'https://httpbin.org/post' }
];

const DEFAULT_REQUEST: RequestState = {
  method: 'GET',
  url: 'https://api.github.com/users/octocat',
  headers: [
    { id: 'h1', key: 'Accept', value: 'application/vnd.github.v3+json', enabled: true },
    { id: 'h2', key: 'Content-Type', value: 'application/json', enabled: true }
  ],
  params: [
    { id: 'p1', key: '', value: '', enabled: true }
  ],
  body: '{\n  "client": "WHITESPACE_OS",\n  "version": "1.0.0"\n}'
};

export const RestTester: React.FC<RestTesterProps> = ({ tab }) => {
  const { activeSpace, activeMember } = useWorkspace();
  const { updateTab } = useBrowser();
  const { createDocument, setActiveDocumentId } = useDocuments();

  const [req, setReq] = useState<RequestState>(() => tab.data?.request || DEFAULT_REQUEST);
  const [res, setRes] = useState<ResponseState>(() => tab.data?.response || {
    status: null,
    statusText: null,
    timeMs: null,
    sizeBytes: null,
    headers: {},
    data: null
  });

  const [activeReqTab, setActiveReqTab] = useState<'params' | 'headers' | 'body'>('headers');
  const [activeResTab, setActiveResTab] = useState<'body' | 'headers'>('body');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);
  const [indexedFeedback, setIndexedFeedback] = useState<string | null>(null);

  // Sync to tab data
  const persistState = (newReq: RequestState, newRes: ResponseState) => {
    updateTab(tab.id, { data: { request: newReq, response: newRes } });
  };

  const handleSend = async () => {
    if (!req.url.trim()) return;
    setLoading(true);
    const start = performance.now();

    try {
      // Build URL with query params
      const parsedUrl = new URL(req.url.trim().startsWith('http') ? req.url.trim() : `https://${req.url.trim()}`);
      req.params.forEach(p => {
        if (p.enabled && p.key.trim()) {
          parsedUrl.searchParams.append(p.key.trim(), p.value.trim());
        }
      });

      // Build Headers
      const requestHeaders: Record<string, string> = {};
      req.headers.forEach(h => {
        if (h.enabled && h.key.trim()) {
          requestHeaders[h.key.trim()] = h.value.trim();
        }
      });

      const options: RequestInit = {
        method: req.method,
        headers: requestHeaders
      };

      if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body.trim()) {
        options.body = req.body;
      }

      const rawRes = await fetch(parsedUrl.toString(), options);
      const elapsed = Math.round(performance.now() - start);

      const resHeaders: Record<string, string> = {};
      rawRes.headers.forEach((v, k) => {
        resHeaders[k] = v;
      });

      const text = await rawRes.text();
      let formatted = text;
      try {
        const json = JSON.parse(text);
        formatted = JSON.stringify(json, null, 2);
      } catch {
        // Plain text
      }

      const newRes: ResponseState = {
        status: rawRes.status,
        statusText: rawRes.statusText || (rawRes.status === 200 ? 'OK' : 'COMPLETED'),
        timeMs: elapsed,
        sizeBytes: text.length,
        headers: resHeaders,
        data: formatted,
        error: null
      };

      setRes(newRes);
      persistState(req, newRes);
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      const errorRes: ResponseState = {
        status: 0,
        statusText: 'CORS / NETWORK ERROR',
        timeMs: elapsed,
        sizeBytes: 0,
        headers: {},
        data: null,
        error: `Request failed: ${err.message || err}. Note: In web browser dev mode, external APIs must enable CORS. Desktop Electron runtime strips CORS restrictions.`
      };
      setRes(errorRes);
      persistState(req, errorRes);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (res.data) {
      navigator.clipboard.writeText(res.data);
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const handleSaveToSpace = () => {
    const title = `REST_${req.method}_${req.url.replace(/[^A-Z0-9_]/gi, '_').slice(-20).toUpperCase()}`;
    const now = new Date().toISOString();
    
    let content = `# REST API Specification: ${req.method} ${req.url}\n\n` +
      `- Executed By: \`${activeMember.name}\`\n` +
      `- Space: \`${activeSpace.name}\`\n` +
      `- Method: \`${req.method}\`\n` +
      `- Status: \`${res.status || 'N/A'} ${res.statusText || ''}\`\n` +
      `- Execution Latency: \`${res.timeMs ? `${res.timeMs} ms` : 'N/A'}\`\n` +
      `- Timestamp: \`${now}\`\n\n` +
      `## Request Configuration\n\n` +
      `**URL**: \`${req.url}\`\n\n` +
      `### Headers\n` +
      req.headers.filter(h => h.enabled && h.key).map(h => `- \`${h.key}: ${h.value}\``).join('\n') +
      `\n\n`;

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body.trim()) {
      content += `### Request Payload\n\`\`\`json\n${req.body}\n\`\`\`\n\n`;
    }

    content += `## Response Payload\n\n`;
    if (res.error) {
      content += `> [!WARNING]\n> ${res.error}\n\n`;
    } else if (res.data) {
      content += `\`\`\`json\n${res.data}\n\`\`\`\n\n`;
    } else {
      content += `*No response body returned.*\n\n`;
    }

    content += `---\n*Saved directly from Hoppscotch-lite REST Client and indexed into local RAG.*`;

    const doc = createDocument(activeSpace.id, title, content, 'md');
    if (doc) {
      setActiveDocumentId(doc.id);
      setIndexedFeedback(`SAVED // ${doc.title}`);
      setTimeout(() => setIndexedFeedback(null), 2500);
    }
  };

  const formatJsonBody = () => {
    try {
      const parsed = JSON.parse(req.body);
      const formatted = JSON.stringify(parsed, null, 2);
      const updated = { ...req, body: formatted };
      setReq(updated);
      persistState(updated, res);
    } catch {
      // Invalid JSON
    }
  };

  const updateHeaderRow = (id: string, partial: Partial<KeyValueItem>) => {
    const updated = req.headers.map(h => h.id === id ? { ...h, ...partial } : h);
    const newReq = { ...req, headers: updated };
    setReq(newReq);
    persistState(newReq, res);
  };

  const addHeaderRow = () => {
    const newReq = {
      ...req,
      headers: [...req.headers, { id: `h-${Date.now()}`, key: '', value: '', enabled: true }]
    };
    setReq(newReq);
    persistState(newReq, res);
  };

  const removeHeaderRow = (id: string) => {
    const newReq = {
      ...req,
      headers: req.headers.filter(h => h.id !== id)
    };
    setReq(newReq);
    persistState(newReq, res);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505] text-[#FFFFFF] font-mono select-none overflow-hidden">
      {/* 1. Header Toolbar */}
      <div className="h-10 bg-[#0C0C0C] border-b border-[#262626] px-3 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-[#FFFFFF]" />
          <span className="text-xs font-bold tracking-wider text-[#FFFFFF] uppercase">
            REST API TESTER // HOPPSCOTCH-LITE
          </span>
          <span className="text-[10px] text-[#737373] bg-[#121212] px-1.5 py-0.2 border border-[#262626]">
            NATIVE FETCH
          </span>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-[#737373] uppercase font-bold shrink-0">PRESETS:</span>
          {PRESET_ENDPOINTS.map(p => (
            <button
              key={p.name}
              onClick={() => {
                const updated = { ...req, method: p.method, url: p.url };
                setReq(updated);
                persistState(updated, res);
              }}
              className="px-2 py-0.5 text-[10px] bg-[#121212] hover:bg-[#1C1C1C] text-[#A3A3A3] hover:text-[#FFFFFF] border border-[#262626] shrink-0"
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* SAVE TO SPACE DOCS */}
        <button
          onClick={handleSaveToSpace}
          title="Save API test specification to Space Docs and trigger RAG indexing"
          className={`px-3 py-1 text-xs font-bold border flex items-center gap-1.5 transition-all shrink-0 ${
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
              <span>SAVE TO SPACE DOCS</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Request Address & Send Bar */}
      <div className="p-3 bg-[#0E0E0E] border-b border-[#262626] flex items-center gap-2 shrink-0">
        {/* Method Picker */}
        <select
          value={req.method}
          onChange={e => {
            const updated = { ...req, method: e.target.value as HttpMethod };
            setReq(updated);
            persistState(updated, res);
          }}
          className="bg-[#171717] border border-[#333333] px-2.5 py-1.5 text-xs text-[#FFFFFF] font-bold outline-none uppercase"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>

        {/* URL Input */}
        <input
          type="text"
          value={req.url}
          onChange={e => {
            const updated = { ...req, url: e.target.value };
            setReq(updated);
            persistState(updated, res);
          }}
          placeholder="ENTER API ENDPOINT (https://...)"
          className="flex-1 bg-[#000000] border border-[#262626] focus:border-[#FFFFFF] px-3 py-1.5 text-xs text-[#FFFFFF] font-mono outline-none"
        />

        {/* SEND BUTTON */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#CCCCCC] flex items-center gap-1.5 shrink-0"
        >
          {loading ? <RotateCw size={12} className="animate-spin" /> : <Send size={12} fill="#000000" />}
          <span>SEND</span>
        </button>
      </div>

      {/* 3. Split Main View: Request Config (Left) vs Response Inspector (Right) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Request Tabs (Left) */}
        <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-[#262626] bg-[#0A0A0A]">
          {/* Subtabs */}
          <div className="h-9 bg-[#0E0E0E] border-b border-[#262626] px-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1">
              {(['headers', 'params', 'body'] as const).map(tabKey => (
                <button
                  key={tabKey}
                  onClick={() => setActiveReqTab(tabKey)}
                  className={`px-3 py-1 text-xs uppercase font-bold border transition-colors ${
                    activeReqTab === tabKey
                      ? 'bg-[#171717] text-[#FFFFFF] border-[#404040]'
                      : 'bg-transparent text-[#737373] border-transparent hover:text-[#FFFFFF]'
                  }`}
                >
                  {tabKey}
                </button>
              ))}
            </div>

            {activeReqTab === 'body' && (
              <button
                onClick={formatJsonBody}
                className="text-[10px] text-[#A3A3A3] hover:text-[#FFFFFF] underline"
              >
                FORMAT JSON
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-3 bg-[#050505]">
            {activeReqTab === 'headers' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-[#202020] text-[10px] text-[#737373]">
                  <span>HTTP REQUEST HEADERS</span>
                  <button onClick={addHeaderRow} className="hover:text-[#FFFFFF] flex items-center gap-1">
                    <Plus size={11} />
                    <span>ADD HEADER</span>
                  </button>
                </div>
                {req.headers.map(h => (
                  <div key={h.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={h.enabled}
                      onChange={e => updateHeaderRow(h.id, { enabled: e.target.checked })}
                      className="accent-[#FFFFFF]"
                    />
                    <input
                      type="text"
                      value={h.key}
                      onChange={e => updateHeaderRow(h.id, { key: e.target.value })}
                      placeholder="Header Name"
                      className="flex-1 bg-[#0A0A0A] border border-[#262626] focus:border-[#FFFFFF] px-2 py-1 text-xs text-[#FFFFFF]"
                    />
                    <input
                      type="text"
                      value={h.value}
                      onChange={e => updateHeaderRow(h.id, { value: e.target.value })}
                      placeholder="Value"
                      className="flex-1 bg-[#0A0A0A] border border-[#262626] focus:border-[#FFFFFF] px-2 py-1 text-xs text-[#FFFFFF]"
                    />
                    <button
                      onClick={() => removeHeaderRow(h.id)}
                      className="text-[#555555] hover:text-[#FFFFFF] p-1"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeReqTab === 'params' && (
              <div className="space-y-2">
                <div className="text-[10px] text-[#737373] pb-1 border-b border-[#202020]">
                  URL QUERY PARAMETERS
                </div>
                {req.params.map(p => (
                  <div key={p.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={p.enabled}
                      onChange={e => {
                        const updated = req.params.map(item => item.id === p.id ? { ...item, enabled: e.target.checked } : item);
                        setReq({ ...req, params: updated });
                      }}
                      className="accent-[#FFFFFF]"
                    />
                    <input
                      type="text"
                      value={p.key}
                      onChange={e => {
                        const updated = req.params.map(item => item.id === p.id ? { ...item, key: e.target.value } : item);
                        setReq({ ...req, params: updated });
                      }}
                      placeholder="Parameter"
                      className="flex-1 bg-[#0A0A0A] border border-[#262626] focus:border-[#FFFFFF] px-2 py-1 text-xs text-[#FFFFFF]"
                    />
                    <input
                      type="text"
                      value={p.value}
                      onChange={e => {
                        const updated = req.params.map(item => item.id === p.id ? { ...item, value: e.target.value } : item);
                        setReq({ ...req, params: updated });
                      }}
                      placeholder="Value"
                      className="flex-1 bg-[#0A0A0A] border border-[#262626] focus:border-[#FFFFFF] px-2 py-1 text-xs text-[#FFFFFF]"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeReqTab === 'body' && (
              <textarea
                value={req.body}
                onChange={e => {
                  const updated = { ...req, body: e.target.value };
                  setReq(updated);
                  persistState(updated, res);
                }}
                placeholder="Raw JSON Request Body..."
                className="w-full h-full min-h-[220px] bg-transparent text-xs font-mono text-[#FFFFFF] outline-none resize-none selection:bg-[#333333] leading-relaxed"
                spellCheck={false}
              />
            )}
          </div>
        </div>

        {/* Response Viewer (Right) */}
        <div className="flex-1 flex flex-col bg-[#000000] overflow-hidden">
          {/* Response Status Bar */}
          <div className="h-9 bg-[#0E0E0E] border-b border-[#262626] px-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-[#737373]">RESPONSE:</span>
              {res.status !== null ? (
                <span className={`px-2 py-0.5 text-[10px] font-bold border ${
                  res.status >= 200 && res.status < 300
                    ? 'bg-[#171717] border-[#FFFFFF] text-[#FFFFFF]'
                    : 'bg-[#222222] border-[#555555] text-[#CCCCCC]'
                }`}>
                  {res.status} {res.statusText}
                </span>
              ) : (
                <span className="text-[10px] text-[#555555]">NOT SENT</span>
              )}

              {res.timeMs !== null && (
                <span className="text-[10px] text-[#A3A3A3] flex items-center gap-1">
                  <Clock size={10} />
                  <span>{res.timeMs} ms</span>
                </span>
              )}

              {res.sizeBytes !== null && (
                <span className="text-[10px] text-[#737373]">
                  {(res.sizeBytes / 1024).toFixed(1)} KB
                </span>
              )}
            </div>

            {res.data && (
              <button
                onClick={handleCopyResponse}
                title="Copy response body"
                className="text-[10px] text-[#A3A3A3] hover:text-[#FFFFFF] flex items-center gap-1"
              >
                {copiedResponse ? (
                  <>
                    <Check size={10} className="text-[#FFFFFF]" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy size={10} />
                    <span>COPY</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Response Subtabs */}
          <div className="h-7 bg-[#0B0B0B] border-b border-[#202020] px-3 flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveResTab('body')}
              className={`text-[10px] uppercase font-bold transition-colors ${
                activeResTab === 'body' ? 'text-[#FFFFFF] underline' : 'text-[#737373] hover:text-[#FFFFFF]'
              }`}
            >
              BODY
            </button>
            <button
              onClick={() => setActiveResTab('headers')}
              className={`text-[10px] uppercase font-bold transition-colors ${
                activeResTab === 'headers' ? 'text-[#FFFFFF] underline' : 'text-[#737373] hover:text-[#FFFFFF]'
              }`}
            >
              HEADERS ({Object.keys(res.headers).length})
            </button>
          </div>

          {/* Response Body & Headers View */}
          <div className="flex-1 overflow-y-auto p-3 bg-[#050505]">
            {res.error ? (
              <div className="p-4 border border-[#333333] bg-[#0E0E0E] text-xs text-[#CCCCCC] space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#FFFFFF]">
                  <AlertCircle size={14} className="text-[#FFFFFF]" />
                  <span>NETWORK / CORS FAILURE</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#A3A3A3]">{res.error}</p>
              </div>
            ) : activeResTab === 'body' && res.data ? (
              <pre className="text-xs font-mono text-[#FFFFFF] whitespace-pre-wrap selection:bg-[#333333] leading-relaxed">
                {res.data}
              </pre>
            ) : activeResTab === 'headers' && Object.keys(res.headers).length > 0 ? (
              <div className="space-y-1 text-xs">
                {Object.entries(res.headers).map(([k, v]) => (
                  <div key={k} className="flex items-start gap-2 py-0.5 border-b border-[#141414]">
                    <span className="font-bold text-[#A3A3A3] shrink-0 w-44 truncate">{k}:</span>
                    <span className="text-[#FFFFFF] break-all">{v}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#555555] text-xs py-10">
                <Database size={28} className="text-[#262626] mb-2" />
                <span>Send request to inspect live HTTP payload</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
