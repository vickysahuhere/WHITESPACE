import React, { useState, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useDocuments } from '../../context/DocumentContext';
import { FORMAT_BADGES } from '../../services/documentParser';
import { UploadCloud, X, FileCheck, AlertCircle } from 'lucide-react';

interface DocumentUploaderProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ isOpen, onClose }) => {
  const { activeSpace, setActiveView } = useWorkspace();
  const { ingestFiles } = useDocuments();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessCount(null);

    try {
      const ingested = await ingestFiles(activeSpace.id, files);
      setSuccessCount(ingested.length);
      setActiveView('editor');
      setTimeout(() => {
        onClose();
        setSuccessCount(null);
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to ingest documents.';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-[#000000]/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-mono select-none"
    >
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xl bg-[#0A0A0A] border border-[#404040] shadow-2xl p-6 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262626] mb-4">
          <div className="flex items-center gap-2">
            <UploadCloud size={16} className="text-[#FFFFFF]" />
            <span className="text-xs font-bold tracking-wider text-[#FFFFFF] uppercase">
              DOCUMENT INGESTION // {activeSpace.name}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-[#A3A3A3] hover:text-[#FFFFFF] p-1 border border-transparent hover:border-[#262626]"
          >
            <X size={15} />
          </button>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[200px] ${
            isDragging
              ? 'border-[#FFFFFF] bg-[#171717]'
              : 'border-[#333333] hover:border-[#666666] bg-[#0E0E0E]'
          }`}
        >
          <UploadCloud size={32} className={`mb-3 ${isDragging ? 'text-[#FFFFFF]' : 'text-[#737373]'}`} />
          <p className="text-xs font-bold text-[#FFFFFF] tracking-wider mb-1 uppercase">
            {isProcessing ? 'PARSING & INGESTING FILES...' : 'DRAG & DROP FILES OR CLICK TO BROWSE'}
          </p>
          <p className="text-[11px] text-[#737373]">
            Maximum file size: 5 MB per document. Instant local RAG indexing.
          </p>

          <input 
            ref={fileInputRef}
            type="file"
            multiple
            accept=".md,.txt,.json,.csv,.py,.js,.ts,.html,.css,.yaml,.yml"
            className="hidden"
            onChange={onFileInputChange}
          />
        </div>

        {/* Status Feedback */}
        {errorMessage && (
          <div className="mt-3 p-2 bg-[#1A1A1A] border border-[#666666] text-xs text-[#FFFFFF] flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successCount !== null && (
          <div className="mt-3 p-2 bg-[#171717] border border-[#FFFFFF] text-xs text-[#FFFFFF] flex items-center gap-2">
            <FileCheck size={14} className="shrink-0" />
            <span>INGESTED {successCount} DOCUMENT(S) INTO ACTIVE SPACE</span>
          </div>
        )}

        {/* Supported Formats Strip */}
        <div className="mt-4 pt-3 border-t border-[#262626]">
          <div className="text-[10px] text-[#737373] tracking-widest uppercase mb-2">
            10 SUPPORTED EXTENSIONS (TEXT & CODE)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(FORMAT_BADGES).map(([ext, badge]) => (
              <span 
                key={ext}
                className="px-2 py-0.5 border border-[#262626] bg-[#121212] text-[10px] font-bold text-[#A3A3A3]"
              >
                .{ext.toUpperCase()} ({badge})
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#262626] hover:bg-[#171717] text-[#A3A3A3] text-xs tracking-wider"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-[#FFFFFF] text-[#000000] font-bold border border-[#FFFFFF] hover:bg-[#A3A3A3] text-xs tracking-wider"
          >
            SELECT FILES
          </button>
        </div>
      </div>
    </div>
  );
};
