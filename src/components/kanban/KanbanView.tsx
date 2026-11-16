import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useTasks } from '../../context/TaskContext';
import { Task, TaskColumn, TaskPriority } from '../../types';
import { TaskModal } from './TaskModal';
import { 
  Kanban, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  User
} from 'lucide-react';

interface KanbanViewProps {
  onDispatchTask?: (task: Task) => void;
}

const COLUMNS: { id: TaskColumn; title: string; subtitle: string }[] = [
  { id: 'queued', title: '01 // QUEUED SPECS', subtitle: 'Awaiting Dispatch & Planning' },
  { id: 'active', title: '02 // ACTIVE AGENT LOOP', subtitle: 'Agent Reasoning & Execution' },
  { id: 'shipped', title: '03 // VERIFIED & SHIPPED', subtitle: 'Completed & Evaluated' }
];

export const KanbanView: React.FC<KanbanViewProps> = ({ onDispatchTask }) => {
  const { activeSpace, members } = useWorkspace();
  const { getTasksForSpace, moveTask, deleteTask } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [targetColumn, setTargetColumn] = useState<TaskColumn>('queued');
  const [draggedOverCol, setDraggedOverCol] = useState<TaskColumn | null>(null);

  const spaceTasks = getTasksForSpace(activeSpace.id);

  const handleOpenCreate = (col: TaskColumn) => {
    setTaskToEdit(null);
    setTargetColumn(col);
    setModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setTaskToEdit(task);
    setModalOpen(true);
  };

  const handleDispatch = (task: Task) => {
    // 1. Move to active agent loop if not already
    if (task.column !== 'active') {
      moveTask(task.id, 'active');
    }
    // 2. Trigger dispatch callback (opens drawer)
    if (onDispatchTask) {
      onDispatchTask(task);
    }
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent, colId: TaskColumn) => {
    e.preventDefault();
    if (draggedOverCol !== colId) {
      setDraggedOverCol(colId);
    }
  };

  const handleDragLeave = () => {
    setDraggedOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, colId: TaskColumn) => {
    e.preventDefault();
    setDraggedOverCol(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTask(taskId, colId);
    }
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'P0':
        return <span className="px-1.5 py-0.2 bg-[#FFFFFF] text-[#000000] font-bold border border-[#FFFFFF] text-[10px]">P0 HIGH</span>;
      case 'P1':
        return <span className="px-1.5 py-0.2 bg-[#171717] text-[#FFFFFF] font-bold border border-[#404040] text-[10px]">P1 MED</span>;
      case 'P2':
        return <span className="px-1.5 py-0.2 bg-[#0D0D0D] text-[#737373] border border-[#262626] text-[10px]">P2 LOW</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505] text-[#FFFFFF] font-mono select-none overflow-hidden">
      {/* 1. Header Toolbar */}
      <div className="h-11 bg-[#0C0C0C] border-b border-[#262626] px-4 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Kanban size={16} className="text-[#FFFFFF]" />
          <span className="text-xs font-bold tracking-wider text-[#FFFFFF] uppercase">
            OPENCLAW MISSION CONTROL // {activeSpace.name.toUpperCase()} KANBAN
          </span>
          <span className="text-[10px] bg-[#171717] border border-[#333333] px-2 py-0.5 text-[#A3A3A3]">
            {spaceTasks.length} TASKS
          </span>
        </div>

        <button
          onClick={() => handleOpenCreate('queued')}
          className="px-3 py-1 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#CCCCCC] flex items-center gap-1.5"
        >
          <Plus size={13} />
          <span>NEW TASK</span>
        </button>
      </div>

      {/* 2. 3-Column Pipeline Grid */}
      <div className="flex-1 overflow-x-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map(col => {
          const colTasks = spaceTasks.filter(t => t.column === col.id);
          const isOver = draggedOverCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={e => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, col.id)}
              className={`flex flex-col bg-[#0A0A0A] border rounded-none transition-colors ${
                isOver ? 'border-[#FFFFFF] bg-[#121212]' : 'border-[#262626]'
              }`}
            >
              {/* Column Header */}
              <div className="p-3 bg-[#0E0E0E] border-b border-[#262626] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wide">
                      {col.title}
                    </span>
                    <span className="bg-[#171717] border border-[#333333] px-1.5 py-0.2 text-[10px] text-[#FFFFFF] font-bold">
                      {colTasks.length}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#737373] mt-0.5">
                    {col.subtitle}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenCreate(col.id)}
                  title={`Add task to ${col.title}`}
                  className="p-1 text-[#A3A3A3] hover:text-[#FFFFFF] border border-[#262626] hover:border-[#404040] bg-[#121212]"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {colTasks.length === 0 ? (
                  <div className="h-32 border border-dashed border-[#202020] flex flex-col items-center justify-center text-[10px] text-[#404040]">
                    <span>NO TASKS IN COLUMN</span>
                    <button
                      onClick={() => handleOpenCreate(col.id)}
                      className="mt-1 text-[#737373] hover:text-[#FFFFFF] underline"
                    >
                      + Create Specification
                    </button>
                  </div>
                ) : (
                  colTasks.map(task => {
                    const assignee = members.find(m => m.id === task.assignedTo);

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={e => handleDragStart(e, task.id)}
                        className="bg-[#0F0F0F] border border-[#262626] hover:border-[#555555] p-3 flex flex-col gap-2.5 transition-all cursor-grab active:cursor-grabbing group shadow-md"
                      >
                        {/* Priority & Assignee Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {getPriorityBadge(task.priority)}
                            {assignee && (
                              <span
                                title={`Assigned to ${assignee.name}`}
                                className="bg-[#171717] border border-[#333333] text-[9px] px-1.5 py-0.2 text-[#FFFFFF] font-bold"
                              >
                                {assignee.badge}
                              </span>
                            )}
                          </div>

                          {/* Quick Column Movement Arrows */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {col.id !== 'queued' && (
                              <button
                                onClick={() => moveTask(task.id, col.id === 'shipped' ? 'active' : 'queued')}
                                title="Move Left"
                                className="p-1 hover:bg-[#202020] text-[#A3A3A3] hover:text-[#FFFFFF]"
                              >
                                <ArrowLeft size={11} />
                              </button>
                            )}
                            {col.id !== 'shipped' && (
                              <button
                                onClick={() => moveTask(task.id, col.id === 'queued' ? 'active' : 'shipped')}
                                title="Move Right"
                                className="p-1 hover:bg-[#202020] text-[#A3A3A3] hover:text-[#FFFFFF]"
                              >
                                <ArrowRight size={11} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Task Title */}
                        <div className="text-xs font-bold text-[#FFFFFF] leading-snug">
                          {task.title}
                        </div>

                        {/* Task Spec Excerpt */}
                        {task.spec && (
                          <p className="text-[11px] text-[#737373] line-clamp-3 leading-relaxed">
                            {task.spec}
                          </p>
                        )}

                        {/* Footer: 1-Click DISPATCH AI & Actions */}
                        <div className="pt-2 border-t border-[#1C1C1C] flex items-center justify-between gap-2">
                          {col.id !== 'shipped' ? (
                            <button
                              onClick={() => handleDispatch(task)}
                              title="Launch autonomous agent reasoning loop in right-docked drawer"
                              className="px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#CCCCCC] text-[#000000] font-bold text-[10px] border border-[#FFFFFF] flex items-center gap-1.5 transition-all"
                            >
                              <Sparkles size={11} />
                              <span>DISPATCH AI</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 text-[10px] text-[#A3A3A3]">
                              <CheckCircle2 size={11} className="text-[#FFFFFF]" />
                              <span>SHIPPED</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(task)}
                              title="Edit Task"
                              className="p-1 hover:text-[#FFFFFF] text-[#737373]"
                            >
                              <Edit3 size={11} />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              title="Delete Task"
                              className="p-1 hover:text-[#FFFFFF] text-[#737373]"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Creation / Editing Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        taskToEdit={taskToEdit}
        defaultColumn={targetColumn}
      />
    </div>
  );
};
