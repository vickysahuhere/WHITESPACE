import React, { useState } from 'react';
import { BrowserTab } from '../../types';
import { useBrowser } from '../../context/BrowserContext';
import { useDocuments } from '../../context/DocumentContext';
import { 
  Globe, 
  ExternalLink, 
  Bookmark, 
  FileDown, 
  Check, 
  RotateCw 
} from 'lucide-react';

interface EmbeddedWebViewportProps {
  tab: BrowserTab;
}

const DEVELOPER_BOOKMARKS = [
  { name: 'GITHUB DOCS', url: 'https://docs.github.com/en/rest' },
  { name: 'REACT 19', url: 'https://react.dev/reference/react' },
  { name: 'THREE.JS', url: 'https://threejs.org/docs/' },
  { name: 'MDN WEB API', url: 'https://developer.mozilla.org/en-US/docs/Web/API' },
  { name: 'TAILWIND', url: 'https://tailwindcss.com/docs' }
];

export const EmbeddedWebViewport: React.FC<EmbeddedWebViewportProps> = ({ tab }) => {
  const { navigateTab, indexTabToSpace } = useBrowser();
  const { setActiveDocumentId } = useDocuments();
  
  const [indexedFeedback, setIndexedFeedback] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);

  const handleIndexToSpace = () => {
    const doc = indexTabToSpace(tab);
    if (doc) {
      setActiveDocumentId(doc.id);
      setIndexedFeedback(`INDEXED // ${doc.title}`);
      setTimeout(() => {
        setIndexedFeedback(null);
      }, 2500);
    }
  };

  const handleReload = () => {
    setIframeKey(k => k + 1);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#000000] overflow-hidden font-mono select-none">
      {/* 1. Developer Bookmark Bar & Top Controls */}
      <div className="h-9 bg-[#0A0A0A] border-b border-[#1F1F1F] px-3 flex items-center justify-between gap-3 text-xs shrink-0">
        {/* Bookmarks */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 text-[10px] text-[#71717A] uppercase font-bold shrink-0 mr-1">
            <Bookmark size={11} className="text-[#A1A1AA]" />
            <span>DEV BOOKMARKS:</span>
          </div>

          {DEVELOPER_BOOKMARKS.map(bm => {
            const isCurrent = tab.url.startsWith(bm.url);
            return (
              <button
                key={bm.url}
                onClick={() => navigateTab(tab.id, bm.url)}
                className={`px-2 py-0.5 text-[10px] border transition-colors shrink-0 ${
                  isCurrent
                    ? 'bg-[#18181B] text-[#FFFFFF] border-[#3F3F46] font-bold'
                    : 'bg-[#111111] text-[#A1A1AA] border-[#1F1F1F] hover:text-[#FFFFFF] hover:border-[#262626]'
                }`}
              >
                {bm.name}
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Reload, Index to Space, External Link */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReload}
            title="Reload viewport frame"
            className="p-1 text-[#71717A] hover:text-[#FFFFFF] border border-[#1F1F1F] hover:border-[#3F3F46] bg-[#111111] transition-colors"
          >
            <RotateCw size={12} />
          </button>

          {/* INDEX TO SPACE BUTTON */}
          <button
            onClick={handleIndexToSpace}
            title="Snapshot active page metadata into Space Knowledge Base and trigger local RAG indexing"
            className={`px-2.5 py-1 text-[10px] font-bold border flex items-center gap-1.5 transition-all ${
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
                <FileDown size={11} className="text-[#FFFFFF]" />
                <span>INDEX TO SPACE</span>
              </>
            )}
          </button>

          <a
            href={tab.url}
            target="_blank"
            rel="noreferrer"
            title="Open URL in native system browser tab"
            className="px-2 py-1 bg-[#111111] hover:bg-[#18181B] text-[#A1A1AA] hover:text-[#FFFFFF] text-[10px] border border-[#1F1F1F] flex items-center gap-1 transition-colors"
          >
            <span>OPEN EXTERNAL</span>
            <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {/* 2. Embedded Iframe Viewport */}
      <div className="flex-1 relative bg-[#000000] overflow-hidden flex flex-col">
        {/* Electron Header Stripping Notice Pill */}
        <div className="h-6 bg-[#0A0A0A] border-b border-[#1F1F1F] px-3 flex items-center justify-between text-[10px] text-[#71717A]">
          <div className="flex items-center gap-1.5 truncate">
            <Globe size={11} className="text-[#52525B] shrink-0" />
            <span className="truncate text-[#A1A1AA]">{tab.url}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline text-[#52525B]">DESKTOP ELECTRON: STRIPS X-FRAME-OPTIONS</span>
            <span className="bg-[#141414] px-1 py-0.2 border border-[#262626] text-[#A1A1AA]">SANDBOXED</span>
          </div>
        </div>

        <div className="flex-1 relative w-full h-full">
          <iframe
            key={`${tab.url}-${iframeKey}`}
            src={tab.url}
            title={tab.title}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            className="w-full h-full border-none bg-[#000000]"
          />
        </div>
      </div>
    </div>
  );
};
