import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, TaskColumn, TaskPriority } from '../types';

const TASKS_STORAGE_KEY = 'whitespace_tasks_v1';

interface TaskContextType {
  tasks: Task[];
  getTasksForSpace: (spaceId: string) => Task[];
  createTask: (spaceId: string, title: string, spec: string, priority: TaskPriority, assignedTo?: string) => Task;
  updateTask: (taskId: string, partial: Partial<Task>) => void;
  moveTask: (taskId: string, targetColumn: TaskColumn) => void;
  deleteTask: (taskId: string) => void;
}

const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-wc-1',
    spaceId: 'wc-core',
    title: 'WebRTC 48kHz Stereo Opus SDP Engine',
    spec: 'Mutate WebRTC SDP to enforce maxaveragebitrate=510000;stereo=1;sprop-stereo=1;cbr=1 with hardware bypass.',
    column: 'queued',
    priority: 'P0',
    assignedTo: 'user_arnav',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task-wc-2',
    spaceId: 'wc-core',
    title: 'Vector Architecture Board Drag & Drop Connectors',
    spec: 'Interactive SVG canvas for distributed system architecture modeling with typographic component badges.',
    column: 'active',
    priority: 'P1',
    assignedTo: 'user_lakshay',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task-wc-3',
    spaceId: 'wc-core',
    title: 'Sub-millisecond Local RAG Inverted Token Index',
    spec: 'Client-side chunking and BM25 token index providing < 1ms cosine similarity search across space docs.',
    column: 'shipped',
    priority: 'P0',
    assignedTo: 'user_vicky',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task-wc-4',
    spaceId: 'wc-core',
    title: 'Electron Session WebRequest Security Stripper',
    spec: 'Strip CSP and X-Frame-Options headers in desktop wrapper to allow embedding arbitrary external websites.',
    column: 'queued',
    priority: 'P2',
    assignedTo: 'user_shiwant',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task-sb-1',
    spaceId: 'signbridge',
    title: 'Real-time Sign Language Gesture Recognition Mesh',
    spec: 'Integrate MediaPipe 21-landmark hand tracking model for live sign-to-speech translation.',
    column: 'queued',
    priority: 'P0',
    assignedTo: 'user_vicky',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task-mr-1',
    spaceId: 'mai-reads',
    title: 'Offline EPUB/PDF Document Parser & Knowledge Extractor',
    spec: 'Ingest and index multi-chapter book files directly into space knowledge base for instant conversational queries.',
    column: 'queued',
    priority: 'P0',
    assignedTo: 'user_vicky',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

function getInitialTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed reading tasks from storage:', e);
  }
  return DEFAULT_TASKS;
}

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks);

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed saving tasks to storage:', e);
    }
  }, [tasks]);

  const getTasksForSpace = useCallback((spaceId: string): Task[] => {
    return tasks.filter(t => t.spaceId === spaceId);
  }, [tasks]);

  const createTask = useCallback((
    spaceId: string,
    title: string,
    spec: string,
    priority: TaskPriority,
    assignedTo?: string
  ): Task => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      spaceId,
      title: title.trim(),
      spec: spec.trim(),
      column: 'queued',
      priority,
      assignedTo,
      createdAt: now,
      updatedAt: now
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((taskId: string, partial: Partial<Task>) => {
    const now = new Date().toISOString();
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...partial, updatedAt: now } : t));
  }, []);

  const moveTask = useCallback((taskId: string, targetColumn: TaskColumn) => {
    const now = new Date().toISOString();
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, column: targetColumn, updatedAt: now } : t));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  return (
    <TaskContext.Provider value={{
      tasks,
      getTasksForSpace,
      createTask,
      updateTask,
      moveTask,
      deleteTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
