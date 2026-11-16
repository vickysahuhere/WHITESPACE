import React from 'react';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { DocumentProvider } from './context/DocumentContext';
import { RAGProvider } from './context/RAGContext';
import { MainLayout } from './components/layout/MainLayout';

export default function App() {
  return (
    <WorkspaceProvider>
      <DocumentProvider>
        <RAGProvider>
          <MainLayout />
        </RAGProvider>
      </DocumentProvider>
    </WorkspaceProvider>
  );
}
