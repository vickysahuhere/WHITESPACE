import React from 'react';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { DocumentProvider } from './context/DocumentContext';
import { RAGProvider } from './context/RAGContext';
import { ChatProvider } from './context/ChatContext';
import { BrowserProvider } from './context/BrowserContext';
import { AudioProvider } from './context/AudioContext';
import { MainLayout } from './components/layout/MainLayout';

export default function App() {
  return (
    <WorkspaceProvider>
      <AudioProvider>
        <DocumentProvider>
          <RAGProvider>
            <ChatProvider>
              <BrowserProvider>
                <MainLayout />
              </BrowserProvider>
            </ChatProvider>
          </RAGProvider>
        </DocumentProvider>
      </AudioProvider>
    </WorkspaceProvider>
  );
}
