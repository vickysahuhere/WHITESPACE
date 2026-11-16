import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Document, DocumentFormat } from '../types';
import { createDefaultDocumentsForSpace, parseUploadedFile } from '../services/documentParser';

const DOCS_STORAGE_KEY = 'whitespace_documents_v1';
const ACTIVE_DOC_STORAGE_KEY = 'whitespace_active_doc_id_v1';

interface DocumentContextType {
  documents: Document[];
  activeDocumentId: string | null;
  activeDocument: Document | null;
  getDocumentsForSpace: (spaceId: string) => Document[];
  createDocument: (spaceId: string, title?: string, content?: string, format?: DocumentFormat) => Document;
  updateDocument: (id: string, partial: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  setActiveDocumentId: (id: string | null) => void;
  ingestFiles: (spaceId: string, files: FileList | File[]) => Promise<Document[]>;
}

const DocumentContext = createContext<DocumentContextType | null>(null);

function getInitialDocuments(): Document[] {
  try {
    const raw = localStorage.getItem(DOCS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed reading documents from storage:', err);
  }

  // Generate initial documents for default spaces
  const coreDocs = createDefaultDocumentsForSpace('wc-core');
  const sbDocs = createDefaultDocumentsForSpace('signbridge');
  const mrDocs = createDefaultDocumentsForSpace('mai-reads');
  return [...coreDocs, ...sbDocs, ...mrDocs];
}

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>(getInitialDocuments);
  const [activeDocumentId, setActiveDocumentIdState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ACTIVE_DOC_STORAGE_KEY) || (documents[0]?.id ?? null);
    } catch {
      return null;
    }
  });

  // Save documents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(documents));
    } catch (err) {
      console.error('Failed persisting documents to storage:', err);
    }
  }, [documents]);

  // Save activeDocumentId to localStorage
  const setActiveDocumentId = (id: string | null) => {
    setActiveDocumentIdState(id);
    try {
      if (id) {
        localStorage.setItem(ACTIVE_DOC_STORAGE_KEY, id);
      } else {
        localStorage.removeItem(ACTIVE_DOC_STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  };

  const activeDocument = useMemo(() => {
    if (!activeDocumentId) return null;
    return documents.find(d => d.id === activeDocumentId) || null;
  }, [documents, activeDocumentId]);

  const getDocumentsForSpace = (spaceId: string): Document[] => {
    return documents.filter(d => d.spaceId === spaceId);
  };

  const createDocument = (
    spaceId: string, 
    title = 'UNTITLED_DOC', 
    content = '', 
    format: DocumentFormat = 'md'
  ): Document => {
    const now = new Date().toISOString();
    const newDoc: Document = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      spaceId,
      title: title.trim() || 'UNTITLED_DOC',
      content,
      format,
      createdAt: now,
      updatedAt: now
    };

    setDocuments(prev => [newDoc, ...prev]);
    setActiveDocumentId(newDoc.id);
    return newDoc;
  };

  const updateDocument = (id: string, partial: Partial<Document>) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        return {
          ...doc,
          ...partial,
          updatedAt: new Date().toISOString()
        };
      }
      return doc;
    }));
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => {
      const remaining = prev.filter(d => d.id !== id);
      if (activeDocumentId === id) {
        const nextDoc = remaining[0]?.id || null;
        setActiveDocumentId(nextDoc);
      }
      return remaining;
    });
  };

  const ingestFiles = async (spaceId: string, files: FileList | File[]): Promise<Document[]> => {
    const fileArray = Array.from(files);
    const ingested: Document[] = [];
    const now = new Date().toISOString();

    for (const file of fileArray) {
      try {
        const parsed = await parseUploadedFile(file);
        const newDoc: Document = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          spaceId,
          title: parsed.title,
          content: parsed.content,
          format: parsed.format,
          createdAt: now,
          updatedAt: now
        };
        ingested.push(newDoc);
      } catch (err) {
        console.error(`Failed parsing file ${file.name}:`, err);
      }
    }

    if (ingested.length > 0) {
      setDocuments(prev => [...ingested, ...prev]);
      setActiveDocumentId(ingested[0].id);
    }

    return ingested;
  };

  return (
    <DocumentContext.Provider value={{
      documents,
      activeDocumentId,
      activeDocument,
      getDocumentsForSpace,
      createDocument,
      updateDocument,
      deleteDocument,
      setActiveDocumentId,
      ingestFiles
    }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};
