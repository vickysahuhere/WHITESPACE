import React from 'react';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { DocumentProvider } from './context/DocumentContext';
import { RAGProvider } from './context/RAGContext';
import { ChatProvider } from './context/ChatContext';
import { BrowserProvider } from './context/BrowserContext';
import { AudioProvider } from './context/AudioContext';
import { TaskProvider } from './context/TaskContext';
import { MainLayout } from './components/layout/MainLayout';

export default function App() {
  return (
    <WorkspaceProvider>
      <AudioProvider>
        <DocumentProvider>
          <RAGProvider>
            <ChatProvider>
              <BrowserProvider>
                <TaskProvider>
                  <MainLayout />
                </TaskProvider>
              </BrowserProvider>
            </ChatProvider>
          </RAGProvider>
        </DocumentProvider>
      </AudioProvider>
    </WorkspaceProvider>
  );
}
