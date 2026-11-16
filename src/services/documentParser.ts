import { Document, DocumentFormat } from '../types';

export const SUPPORTED_EXTENSIONS: Record<string, DocumentFormat> = {
  md: 'md',
  markdown: 'md',
  txt: 'txt',
  text: 'txt',
  json: 'json',
  csv: 'csv',
  py: 'py',
  python: 'py',
  js: 'js',
  javascript: 'js',
  jsx: 'js',
  ts: 'ts',
  typescript: 'ts',
  tsx: 'ts',
  html: 'html',
  htm: 'html',
  css: 'css',
  yaml: 'yaml',
  yml: 'yaml'
};

export const FORMAT_BADGES: Record<DocumentFormat, string> = {
  md: 'MD',
  txt: 'TXT',
  json: 'JSON',
  csv: 'CSV',
  py: 'PY',
  js: 'JS',
  ts: 'TS',
  html: 'HTML',
  css: 'CSS',
  yaml: 'YAML'
};

export function detectFormat(filename: string): DocumentFormat {
  const parts = filename.toLowerCase().split('.');
  if (parts.length > 1) {
    const ext = parts[parts.length - 1];
    if (ext in SUPPORTED_EXTENSIONS) {
      return SUPPORTED_EXTENSIONS[ext];
    }
  }
  return 'txt';
}

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per file

export async function parseUploadedFile(file: File): Promise<{ title: string; content: string; format: DocumentFormat }> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File "${file.name}" exceeds maximum allowed size of 5 MB.`);
  }

  const rawText = await file.text();
  const format = detectFormat(file.name);
  
  // Extract base title by stripping extension
  const dotIndex = file.name.lastIndexOf('.');
  const baseTitle = dotIndex > 0 ? file.name.substring(0, dotIndex) : file.name;
  const sanitizedTitle = baseTitle.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim() || 'Untitled Document';

  let formattedContent = rawText;
  if (format === 'json') {
    try {
      const parsed = JSON.parse(rawText);
      formattedContent = JSON.stringify(parsed, null, 2);
    } catch {
      // Leave as raw text if JSON is malformed
    }
  }

  return {
    title: sanitizedTitle,
    content: formattedContent,
    format
  };
}

export function createDefaultDocumentsForSpace(spaceId: string): Document[] {
  const now = new Date().toISOString();
  return [
    {
      id: `doc-${spaceId}-arch`,
      spaceId,
      title: 'ARCHITECTURE_SPEC',
      format: 'md',
      content: `# White Collars Architecture Spec // Autonomous Workspace OS

## System Overview
- Dual-runtime client: Web browser + Frameless Windows Electron desktop (.exe).
- Strict black-and-white monochrome design tokens: #000000, #0A0A0A, #171717, #262626, #FFFFFF.
- Zero emoji tolerance across UI, icons, placeholders, and AI responses.

## Key Subsystems
1. Multi-Space Partitioning: Independent SOUL.MD prompts, tasks, and document indices.
2. Notion 3.0 Live Editor: Fast slash-command markdown editing with interactive checklists.
3. Sub-millisecond Local RAG: Inverted token index with BM25 cosine scoring.
4. Studio WebRTC Calling: 510 kbps stereo Opus codec with Web Audio API GainNode boost.
5. OpenClaw Kanban: 3-column engineering task execution with 1-click Dispatch AI.
`,
      createdAt: now,
      updatedAt: now
    },
    {
      id: `doc-${spaceId}-guidelines`,
      spaceId,
      title: 'OPERATIONAL_GUIDELINES',
      format: 'txt',
      content: `WHITE COLLARS OPERATIONAL DIRECTIVES
====================================
1. Absolute precision in state manipulation.
2. Every button, toggle, and input must be backed by persistent storage.
3. Never block the UI thread during local vector calculations or audio streaming.
4. Keep all typography aligned to strict geometric grids.
`,
      createdAt: now,
      updatedAt: now
    },
    {
      id: `doc-${spaceId}-config`,
      spaceId,
      title: 'RUNTIME_CONFIG',
      format: 'json',
      content: JSON.stringify({
        version: "1.0.0",
        audioPipeline: {
          sampleRate: 48000,
          channelCount: 2,
          opusBitrate: 510000,
          hardwareBypass: true
        },
        ragEngine: {
          maxTokensPerChunk: 300,
          overlapTokens: 50,
          scoring: "BM25_COSINE",
          cacheStrategy: "IN_MEMORY_L1"
        },
        telemetry: false
      }, null, 2),
      createdAt: now,
      updatedAt: now
    }
  ];
}
