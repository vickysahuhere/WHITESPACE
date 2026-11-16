import React from 'react';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { DocumentProvider } from './context/DocumentContext';
import { RAGProvider } from './context/RAGContext';
import { ChatProvider } from './context/ChatContext';
import { MainLayout } from './components/layout/MainLayout';

export default function App() {
  return (
    <WorkspaceProvider>
      <DocumentProvider>
        <RAGProvider>
          <ChatProvider>
            <MainLayout />
          </ChatProvider>
        </RAGProvider>
      </DocumentProvider>
    </WorkspaceProvider>
  );
}
