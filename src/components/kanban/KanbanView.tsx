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
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

interface KanbanViewProps {
  onDispatchTask?: (task: Task) => void;
}

const COLUMNS: { id: TaskColumn; title: string }[] = [
  { id: 'queued', title: 'QUEUED' },
  { id: 'active', title: 'ACTIVE' },
  { id: 'shipped', title: 'SHIPPED' }
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
        return <span className="px-2 py-0.5 bg-[#FFFFFF] text-[#0B0B0E] font-mono font-bold rounded-md text-[10px] shadow-xs">P0 URGENT</span>;
      case 'P1':
        return <span className="px-2 py-0.5 bg-[#252534] text-emerald-400 font-mono font-bold border border-emerald-500/30 rounded-md text-[10px]">P1 HIGH</span>;
      case 'P2':
        return <span className="px-2 py-0.5 bg-[#1E1E26] text-[#8E8E9E] font-mono font-bold border border-[#2F2F3E] rounded-md text-[10px]">P2 NORMAL</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0B0E] text-[#FFFFFF] select-none overflow-hidden">
      {/* 1. Header Toolbar */}
      <div className="h-12 bg-[#121217] border-b border-[#242430] px-4 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <Kanban size={17} className="text-emerald-400" />
          <span className="text-sm font-display font-bold tracking-tight text-[#FFFFFF]">
            OpenClaw // Kanban
          </span>
          <span className="text-xs bg-[#1E1E28] border border-[#2F2F3E] px-2.5 py-0.5 rounded-full text-[#D4D4DC] font-mono font-bold">
            {spaceTasks.length} tasks
          </span>
        </div>

        <button
          onClick={() => handleOpenCreate('queued')}
          className="px-4 py-1.5 bg-[#FFFFFF] text-[#0B0B0E] font-display font-bold text-xs rounded-xl hover:bg-[#E4E4E7] flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Plus size={14} />
          <span>NEW TASK</span>
        </button>
      </div>

      {/* 2. 3-Column Pipeline Grid */}
      <div className="flex-1 overflow-x-auto p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map(col => {
          const colTasks = spaceTasks.filter(t => t.column === col.id);
          const isOver = draggedOverCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={e => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, col.id)}
              className={`flex flex-col bg-[#121217] border rounded-2xl transition-all shadow-sm overflow-hidden ${
                isOver ? 'border-emerald-500/80 bg-[#161622] ring-2 ring-emerald-500/20' : 'border-[#242430]'
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 bg-[#171722] border-b border-[#242430] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-display font-bold text-[#FFFFFF] uppercase tracking-wider">
                    {col.title}
                  </span>
                  <span className="bg-[#20202E] border border-[#333346] px-2 py-0.5 rounded-md text-xs text-[#FFFFFF] font-mono font-bold">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenCreate(col.id)}
                  title={`Add task to ${col.title}`}
                  className="p-1.5 text-[#8E8E9E] hover:text-[#FFFFFF] rounded-lg border border-[#2F2F3E] hover:border-[#454558] bg-[#1E1E28] transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar">
                {colTasks.length === 0 ? (
                  <div className="h-36 border border-dashed border-[#242430] rounded-xl flex flex-col items-center justify-center text-xs text-[#52525B]">
                    <span>NO TASKS</span>
                    <button
                      onClick={() => handleOpenCreate(col.id)}
                      className="mt-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                    >
                      + New Task
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
                        className="bg-[#1A1A24] border border-[#2F2F3E] hover:border-[#454558] rounded-2xl p-4 flex flex-col gap-3 transition-all cursor-grab active:cursor-grabbing group shadow-md hover:bg-[#20202E]"
                      >
                        {/* Priority & Assignee Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(task.priority)}
                            {assignee && (
                              <span
                                title={`Assigned to ${assignee.name}`}
                                className="bg-[#242432] border border-[#333346] text-xs px-2 py-0.5 rounded-md text-[#FFFFFF] font-mono font-bold"
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
                                className="p-1 rounded-md text-[#8E8E9E] hover:text-[#FFFFFF] hover:bg-[#2A2A3A]"
                              >
                                <ArrowLeft size={13} />
                              </button>
                            )}
                            {col.id !== 'shipped' && (
                              <button
                                onClick={() => moveTask(task.id, col.id === 'queued' ? 'active' : 'shipped')}
                                title="Move Right"
                                className="p-1 rounded-md text-[#8E8E9E] hover:text-[#FFFFFF] hover:bg-[#2A2A3A]"
                              >
                                <ArrowRight size={13} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Task Title */}
                        <div className="text-sm font-display font-bold text-[#FFFFFF] leading-snug tracking-tight">
                          {task.title}
                        </div>

                        {/* Task Spec Excerpt */}
                        {task.spec && (
                          <p className="text-xs font-sans text-[#8E8E9E] line-clamp-3 leading-relaxed">
                            {task.spec}
                          </p>
                        )}

                        {/* Footer: 1-Click DISPATCH AI & Actions */}
                        <div className="pt-2.5 border-t border-[#242430] flex items-center justify-between gap-2">
                          {col.id !== 'shipped' ? (
                            <button
                              onClick={() => handleDispatch(task)}
                              title="Launch autonomous agent reasoning loop in right-docked drawer"
                              className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#0B0B0E] font-display font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                            >
                              <Sparkles size={13} />
                              <span>DISPATCH</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-display font-bold">
                              <CheckCircle2 size={13} className="text-emerald-400" />
                              <span>SHIPPED</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(task)}
                              title="Edit Task"
                              className="p-1.5 text-[#8E8E9E] hover:text-[#FFFFFF] rounded-md hover:bg-[#2A2A3A] transition-colors"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              title="Delete Task"
                              className="p-1.5 text-[#8E8E9E] hover:text-red-400 rounded-md hover:bg-[#2A2A3A] transition-colors"
                            >
                              <Trash2 size={13} />
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
