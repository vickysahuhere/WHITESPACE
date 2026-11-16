import React from 'react';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { DocumentProvider } from './context/DocumentContext';
import { MainLayout } from './components/layout/MainLayout';

export default function App() {
  return (
    <WorkspaceProvider>
      <DocumentProvider>
        <MainLayout />
      </DocumentProvider>
    </WorkspaceProvider>
  );
}
