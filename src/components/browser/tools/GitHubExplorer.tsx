import React, { useState, useEffect } from 'react';
import { BrowserTab } from '../../../types';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { useBrowser } from '../../../context/BrowserContext';
import { useDocuments } from '../../../context/DocumentContext';
import { 
  Search, 
  Star, 
  GitFork, 
  ExternalLink, 
  Copy, 
  Check, 
  FileDown, 
  Code, 
  AlertCircle, 
  RotateCw,
  FolderGit2
} from 'lucide-react';

interface GitHubExplorerProps {
  tab: BrowserTab;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
}

const PRESET_QUERIES = [
  'ai agent',
  'threejs webgl',
  'webrtc opus',
  'markdown editor',
  'electron desktop',
  'react 19'
];

const FALLBACK_REPOS: GitHubRepo[] = [
  {
    id: 101,
    name: 'whitespace-autonomous-os',
    full_name: 'whitecollars/whitespace-os',
    description: 'Autonomous AI Workspace and Native Desktop OS with Discord space rail, Notion 3.0 docs, and OpenClaw Kanban.',
    html_url: 'https://github.com/whitecollars/whitespace-os',
    stargazers_count: 12480,
    forks_count: 1420,
    open_issues_count: 8,
    language: 'TypeScript',
    topics: ['ai-workspace', 'discord-rail', 'notion-editor', 'threejs', 'webrtc'],
    updated_at: new Date().toISOString()
  },
  {
    id: 102,
    name: 'three.js',
    full_name: 'mrdoob/three.js',
    description: 'JavaScript 3D Library for WebGL graphics and interactive 3D visualizations.',
    html_url: 'https://github.com/mrdoob/three.js',
    stargazers_count: 98500,
    forks_count: 35100,
    open_issues_count: 420,
    language: 'JavaScript',
    topics: ['webgl', '3d', 'threejs', 'graphics'],
    updated_at: new Date().toISOString()
  },
  {
    id: 103,
    name: 'electron',
    full_name: 'electron/electron',
    description: 'Build cross-platform desktop apps with JavaScript, HTML, and CSS.',
    html_url: 'https://github.com/electron/electron',
    stargazers_count: 114000,
    forks_count: 15300,
    open_issues_count: 650,
    language: 'C++',
    topics: ['desktop', 'electron', 'v8', 'chromium'],
    updated_at: new Date().toISOString()
  }
];

export const GitHubExplorer: React.FC<GitHubExplorerProps> = ({ tab }) => {
  const { activeSpace, activeMember } = useWorkspace();
  const { updateTab } = useBrowser();
  const { createDocument, setActiveDocumentId } = useDocuments();

  const [query, setQuery] = useState<string>(() => tab.data?.query || 'ai agent');
  const [repos, setRepos] = useState<GitHubRepo[]>(() => tab.data?.repos || FALLBACK_REPOS);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [indexedId, setIndexedId] = useState<number | null>(null);

  const fetchRepos = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=12`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!res.ok) {
        throw new Error(`GitHub API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      if (Array.isArray(data.items)) {
        setRepos(data.items);
        updateTab(tab.id, { data: { query: searchQuery, repos: data.items } });
      } else {
        setRepos(FALLBACK_REPOS);
      }
    } catch (err: any) {
      console.warn('GitHub search fallback:', err);
      setErrorMsg(`API RATE LIMIT / OFFLINE // DISPLAYING CACHED SPECIFICATIONS`);
      // Keep cached or fallback repos
      if (repos.length === 0) {
        setRepos(FALLBACK_REPOS);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tab.data?.repos) {
      fetchRepos(query);
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRepos(query);
  };

  const handleCopyCDN = (repo: GitHubRepo) => {
    const cdnUrl = `https://cdn.jsdelivr.net/gh/${repo.full_name}@main/`;
    navigator.clipboard.writeText(cdnUrl);
    setCopiedId(repo.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleIndexSpec = (repo: GitHubRepo) => {
    const title = `GITHUB_${repo.name.toUpperCase().replace(/[^A-Z0-9_]/g, '_')}_SPEC`;
    const now = new Date().toISOString();
    const content = `# GitHub Open Source Spec: ${repo.full_name}\n\n` +
      `- Repository: [${repo.html_url}](${repo.html_url})\n` +
      `- Primary Language: \`${repo.language || 'UNKNOWN'}\`\n` +
      `- Stars: \`${repo.stargazers_count.toLocaleString()}\`\n` +
      `- Forks: \`${repo.forks_count.toLocaleString()}\`\n` +
      `- Open Issues: \`${repo.open_issues_count}\`\n` +
      `- Indexed By: \`${activeMember.name}\`\n` +
      `- Timestamp: \`${now}\`\n\n` +
      `## Overview\n` +
      `${repo.description || 'No description provided.'}\n\n` +
      `## CDN & Integration Links\n` +
      `\`\`\`html\n` +
      `<!-- jsDelivr Production CDN Link -->\n` +
      `<script src="https://cdn.jsdelivr.net/gh/${repo.full_name}@main/dist/index.js"></script>\n` +
      `\`\`\`\n\n` +
      `## Package Install\n` +
      `\`\`\`bash\n` +
      `git clone ${repo.html_url}.git\n` +
      `cd ${repo.name}\n` +
      `npm install\n` +
      `\`\`\`\n\n` +
      `## Topics\n` +
      (repo.topics?.map(t => `- \`#${t}\``).join('\n') || '- None specified') +
      `\n\n---\n*Indexed directly into Space Docs for instant local RAG grounding.*`;

    const doc = createDocument(activeSpace.id, title, content, 'md');
    if (doc) {
      setActiveDocumentId(doc.id);
      setIndexedId(repo.id);
      setTimeout(() => setIndexedId(null), 2500);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#000000] text-[#FFFFFF] font-mono select-none overflow-hidden">
      {/* 1. Header & Search Form */}
      <div className="p-3 bg-[#0A0A0A] border-b border-[#1F1F1F] flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 size={15} className="text-[#FFFFFF]" />
            <span className="text-xs font-bold tracking-wider text-[#FFFFFF] uppercase">
              GITHUB OSS EXPLORER // REST REPOSITORY DISCOVERY
            </span>
          </div>
          <span className="text-[10px] text-[#A1A1AA] bg-[#141414] px-2 py-0.5 border border-[#262626] font-bold">
            LIVE GITHUB API V3
          </span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-2.5 text-[#71717A]" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="SEARCH GITHUB REPOSITORIES (e.g. ai agent, threejs, webrtc)..."
              className="w-full bg-[#000000] border border-[#1F1F1F] focus:border-[#FFFFFF] pl-8 pr-3 py-1.5 text-xs text-[#FFFFFF] outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#CCCCCC] flex items-center gap-1.5 transition-colors"
          >
            {loading ? <RotateCw size={12} className="animate-spin" /> : <Search size={12} />}
            <span>SEARCH</span>
          </button>
        </form>

        {/* Preset Query Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[10px] text-[#71717A] uppercase font-bold shrink-0">PRESETS:</span>
          {PRESET_QUERIES.map(q => (
            <button
              key={q}
              onClick={() => {
                setQuery(q);
                fetchRepos(q);
              }}
              className={`px-2 py-0.5 text-[10px] border transition-colors shrink-0 ${
                query.toLowerCase() === q.toLowerCase()
                  ? 'bg-[#18181B] text-[#FFFFFF] border-[#3F3F46] font-bold'
                  : 'bg-[#111111] text-[#A1A1AA] border-[#1F1F1F] hover:text-[#FFFFFF] hover:border-[#262626]'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Notice / Error Banner */}
      {errorMsg && (
        <div className="h-7 bg-[#111111] border-b border-[#1F1F1F] px-3 flex items-center justify-between text-[10px] text-[#A1A1AA] shrink-0">
          <div className="flex items-center gap-1.5">
            <AlertCircle size={11} className="text-[#A1A1AA]" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => fetchRepos(query)} className="underline hover:text-[#FFFFFF] transition-colors">
            RETRY QUERY
          </button>
        </div>
      )}

      {/* 3. Repositories Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#000000] custom-scrollbar">
        {repos.length === 0 && !loading && (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-[#1F1F1F] bg-[#0A0A0A]">
            <FolderGit2 size={32} className="text-[#262626] mb-2" />
            <div className="text-xs font-bold text-[#FFFFFF] uppercase mb-1">NO REPOSITORIES FOUND</div>
            <p className="text-[11px] text-[#71717A]">Try searching for keywords like &quot;threejs&quot;, &quot;webrtc&quot;, or &quot;markdown&quot;.</p>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {repos.map(repo => (
            <div
              key={repo.id}
              className="bg-[#0A0A0A] border border-[#1F1F1F] hover:border-[#3F3F46] p-3.5 flex flex-col justify-between transition-colors hover:bg-[#111111]"
            >
              <div>
                {/* Title & Language */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-xs text-[#FFFFFF] hover:underline flex items-center gap-1.5 group"
                  >
                    <span>{repo.full_name}</span>
                    <ExternalLink size={10} className="text-[#71717A] group-hover:text-[#FFFFFF]" />
                  </a>

                  {repo.language && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#141414] border border-[#262626] text-[#A1A1AA] shrink-0">
                      {repo.language}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-[11px] text-[#A1A1AA] line-clamp-2 mb-3 leading-relaxed">
                  {repo.description || 'No repository description available.'}
                </p>

                {/* Metrics */}
                <div className="flex items-center gap-3 text-[10px] text-[#A1A1AA] mb-3">
                  <span className="flex items-center gap-1">
                    <Star size={11} className="text-[#FFFFFF]" />
                    <span>{repo.stargazers_count?.toLocaleString()}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork size={11} className="text-[#A1A1AA]" />
                    <span>{repo.forks_count?.toLocaleString()}</span>
                  </span>
                  <span className="text-[#52525B]">
                    ISSUES: {repo.open_issues_count}
                  </span>
                </div>
              </div>

              {/* Actions Toolbar */}
              <div className="pt-2.5 border-t border-[#1F1F1F] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopyCDN(repo)}
                  title="Copy jsDelivr CDN link"
                  className="px-2 py-1 bg-[#111111] hover:bg-[#18181B] text-[#A1A1AA] hover:text-[#FFFFFF] border border-[#1F1F1F] text-[10px] flex items-center gap-1 transition-colors"
                >
                  {copiedId === repo.id ? (
                    <>
                      <Check size={10} className="text-[#FFFFFF]" />
                      <span>COPIED CDN</span>
                    </>
                  ) : (
                    <>
                      <Copy size={10} />
                      <span>COPY CDN</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleIndexSpec(repo)}
                  title="Snapshot repository spec to Space Knowledge Base and trigger RAG indexing"
                  className={`px-2.5 py-1 text-[10px] font-bold border flex items-center gap-1 transition-all ${
                    indexedId === repo.id
                      ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                      : 'bg-[#141414] hover:bg-[#18181B] text-[#FFFFFF] border-[#262626] hover:border-[#FFFFFF]'
                  }`}
                >
                  {indexedId === repo.id ? (
                    <>
                      <Check size={10} className="text-[#000000]" />
                      <span>INDEXED TO DOCS</span>
                    </>
                  ) : (
                    <>
                      <FileDown size={10} />
                      <span>INDEX SPEC TO SPACE</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
