import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useRAG } from '../../context/RAGContext';
import { geminiClient, GeminiModelInfo } from '../../services/geminiClient';
import { 
  X, 
  Cpu, 
  RotateCw, 
  Check, 
  Key, 
  Layers, 
  Database,
  ShieldCheck,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';

interface ModelDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelDiscoveryModal: React.FC<ModelDiscoveryModalProps> = ({ isOpen, onClose }) => {
  const { geminiKey, setGeminiKey, isKeyLinked } = useWorkspace();
  const { totalChunksIndexed } = useRAG();

  const [models, setModels] = useState<GeminiModelInfo[]>([]);
  const [activeModel, setActiveModel] = useState<string>(geminiClient.getActiveModel());
  const [loading, setLoading] = useState<boolean>(false);
  const [switchedId, setSwitchedId] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState(geminiKey);
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  const fetchModels = async (keyToUse?: string) => {
    setLoading(true);
    try {
      const list = await geminiClient.listModels(keyToUse !== undefined ? keyToUse : geminiKey);
      setModels(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setKeyInput(geminiKey);
      setActiveModel(geminiClient.getActiveModel());
      fetchModels(geminiKey);
    }
  }, [isOpen, geminiKey]);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiKey(keyInput);
    setKeySaved(true);
    fetchModels(keyInput);
    setTimeout(() => setKeySaved(false), 2000);
  };

  if (!isOpen) return null;

  const handleSelectModel = (modelId: string) => {
    geminiClient.setActiveModel(modelId);
    setActiveModel(modelId);
    setSwitchedId(modelId);
    setTimeout(() => setSwitchedId(null), 1800);
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-mono select-none">
      <div className="w-full max-w-2xl bg-[#0C0C0C] border border-[#404040] p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-[#FFFFFF]" />
            <span className="text-xs font-bold tracking-wider text-[#FFFFFF] uppercase">
              GOOGLE GEMINI REST // LIVE MODEL DISCOVERY
            </span>
          </div>
          <button onClick={onClose} className="text-[#A3A3A3] hover:text-[#FFFFFF]">
            <X size={15} />
          </button>
        </div>

        {/* Top Info Bar: Status & Rescan */}
        <div className="p-3 bg-[#080808] border border-[#202020] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Key size={13} className={isKeyLinked ? 'text-[#FFFFFF]' : 'text-[#737373]'} />
            <span className="text-[#A3A3A3]">
              API KEY STATUS: <strong className={isKeyLinked ? 'text-[#FFFFFF]' : 'text-[#737373]'}>
                {isKeyLinked ? 'LINKED // REST V1BETA ACTIVE' : 'KEYLESS // LOCAL OFFLINE RAG ACTIVE'}
              </strong>
            </span>
          </div>

          <button
            onClick={() => fetchModels(keyInput)}
            disabled={loading}
            className="px-2.5 py-1 bg-[#141414] hover:bg-[#202020] text-[#A3A3A3] hover:text-[#FFFFFF] border border-[#262626] text-[10px] flex items-center gap-1.5"
          >
            <RotateCw size={11} className={loading ? 'animate-spin' : ''} />
            <span>RESCAN MODELS</span>
          </button>
        </div>

        {/* Gemini API Key Configuration */}
        <div className="p-3 bg-[#080808] border border-[#202020] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#FFFFFF] font-bold flex items-center gap-1.5">
              <Key size={13} />
              <span>CONFIGURE GOOGLE GEMINI KEY</span>
            </span>
            <span className={`px-2 py-0.5 text-[9px] font-bold border ${
              isKeyLinked 
                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]' 
                : 'bg-[#171717] text-[#737373] border-[#333333]'
            }`}>
              {isKeyLinked ? 'ACTIVE' : 'NOT LINKED'}
            </span>
          </div>

          <form onSubmit={handleSaveKey} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                placeholder="PASTE GOOGLE GEMINI API KEY..."
                className="w-full bg-[#000000] border border-[#262626] focus:border-[#FFFFFF] px-3 py-1.5 text-xs text-[#FFFFFF] outline-none pr-8 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-2 text-[#737373] hover:text-[#FFFFFF]"
              >
                {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#CCCCCC] transition-colors"
            >
              {keySaved ? 'LINKED' : 'LINK KEY'}
            </button>
          </form>
        </div>

        {/* Models List */}
        <div className="space-y-2.5">
          <div className="text-[10px] text-[#737373] uppercase font-bold flex items-center justify-between">
            <span>AVAILABLE GEMINI MODELS ({models.length})</span>
            <span>CONTEXT HEADROOM: &gt;99% HEADROOM AVAILABLE</span>
          </div>

          <div className="space-y-2">
            {models.map(m => {
              const isSelected = activeModel === m.id || activeModel === m.name;

              return (
                <div
                  key={m.id}
                  className={`p-3.5 bg-[#090909] border transition-all flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'border-[#FFFFFF] bg-[#121212]'
                      : 'border-[#222222] hover:border-[#383838]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#FFFFFF]">
                          {m.displayName}
                        </span>
                        <span className="bg-[#171717] border border-[#333333] px-1.5 py-0.2 text-[9px] text-[#A3A3A3]">
                          {m.id}
                        </span>
                        {isSelected && (
                          <span className="bg-[#FFFFFF] text-[#000000] px-1.5 py-0.2 text-[9px] font-bold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#737373] mt-1 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSelectModel(m.id)}
                      className={`px-3 py-1 text-xs font-bold border shrink-0 flex items-center gap-1 transition-colors ${
                        isSelected
                          ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                          : 'bg-[#141414] hover:bg-[#222222] text-[#FFFFFF] border-[#333333]'
                      }`}
                    >
                      {switchedId === m.id ? (
                        <>
                          <Check size={11} className="text-[#000000]" />
                          <span>ACTIVATED</span>
                        </>
                      ) : isSelected ? (
                        <>
                          <Check size={11} className="text-[#000000]" />
                          <span>SELECTED</span>
                        </>
                      ) : (
                        <span>ACTIVATE</span>
                      )}
                    </button>
                  </div>

                  {/* Model Specs Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#171717] text-[10px] text-[#555555]">
                    <span>CONTEXT LIMIT: <strong className="text-[#A3A3A3]">{m.inputTokenLimit.toLocaleString()} TOKENS</strong></span>
                    <span>MAX OUTPUT: <strong className="text-[#A3A3A3]">{m.outputTokenLimit.toLocaleString()} TOKENS</strong></span>
                    <span>METHODS: <strong className="text-[#A3A3A3]">{m.supportedGenerationMethods.join(', ')}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#262626] text-xs">
          <div className="flex items-center gap-2 text-[10px] text-[#737373]">
            <Database size={12} />
            <span>LOCAL RAG: {totalChunksIndexed} CHUNKS INDEXED IN SPACE</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#CCCCCC]"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
