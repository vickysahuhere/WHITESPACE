// White Collars (WHITESPACE) // Core Domain Types

export type WorkspaceView = 'editor' | 'kanban' | 'browser' | 'stage' | 'copilot';

export type DocumentFormat = 'md' | 'txt' | 'json' | 'csv' | 'py' | 'js' | 'ts' | 'html' | 'css' | 'yaml';

export interface Space {
  id: string;
  name: string;
  slug: string;
  description: string;
  badge: string; // e.g. 'WC', 'SB', 'MR'
  soulMd: string; // Persistent system prompt for the space
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  name: string;
  badge: string; // e.g. 'VS', 'AS', 'LA', 'SG'
  role: string;
  hardware: string;
  instructions: string;
  isCustom?: boolean;
}

export interface Document {
  id: string;
  spaceId: string;
  title: string;
  content: string;
  format: DocumentFormat;
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = 'P0' | 'P1' | 'P2';
export type TaskColumn = 'queued' | 'active' | 'shipped';

export interface Task {
  id: string;
  spaceId: string;
  title: string;
  spec: string;
  column: TaskColumn;
  priority: TaskPriority;
  assignedTo?: string; // member id
  createdAt: string;
  updatedAt: string;
}

export type BrowserTabType = 'web' | 'github' | 'sandbox' | 'vector' | 'rest';

export interface BrowserTab {
  id: string;
  userId: string;
  spaceId: string;
  title: string;
  url: string;
  type: BrowserTabType;
  isShared: boolean; // PRIVATE (ONLY ME) vs TAB: SHARED WITH TEAM
  data?: any; // tool-specific persistent payload
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  spaceId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  ragSources?: {
    title: string;
    score: number;
    chunk: string;
  }[];
}

export interface AudioState {
  micActive: boolean;
  muted: boolean;
  stageActive: boolean;
  volumeBoost: number; // 0 - 200 (%)
  isMonitoring: boolean;
  currentDevice: string;
}
