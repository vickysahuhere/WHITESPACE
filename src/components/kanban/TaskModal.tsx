import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskColumn } from '../../types';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useTasks } from '../../context/TaskContext';
import { X, Kanban } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  defaultColumn?: TaskColumn;
}

export const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  taskToEdit, 
  defaultColumn = 'queued' 
}) => {
  const { activeSpace, members } = useWorkspace();
  const { createTask, updateTask } = useTasks();

  const [title, setTitle] = useState('');
  const [spec, setSpec] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('P1');
  const [column, setColumn] = useState<TaskColumn>(defaultColumn);
  const [assignedTo, setAssignedTo] = useState<string>('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setSpec(taskToEdit.spec);
      setPriority(taskToEdit.priority);
      setColumn(taskToEdit.column);
      setAssignedTo(taskToEdit.assignedTo || '');
    } else {
      setTitle('');
      setSpec('');
      setPriority('P1');
      setColumn(defaultColumn);
      setAssignedTo(members[0]?.id || '');
    }
  }, [taskToEdit, defaultColumn, members, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        spec: spec.trim(),
        priority,
        column,
        assignedTo: assignedTo || undefined
      });
    } else {
      const created = createTask(
        activeSpace.id,
        title.trim(),
        spec.trim(),
        priority,
        assignedTo || undefined
      );
      if (column !== 'queued') {
        updateTask(created.id, { column });
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0B0B0E]/85 backdrop-blur-md flex items-center justify-center z-50 p-4 font-mono select-none animate-fade-in">
      <div className="w-full max-w-lg bg-[#121217] border border-[#2F2F3E] rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#242432]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1E1E28] border border-[#2F2F3E] flex items-center justify-center text-[#FFFFFF]">
              <Kanban size={15} />
            </div>
            <span className="text-xs font-bold tracking-wider text-[#FFFFFF] uppercase">
              {taskToEdit ? 'EDIT TASK SPECIFICATION' : 'NEW TASK SPECIFICATION'} // {activeSpace.name.toUpperCase()}
            </span>
          </div>
          <button onClick={onClose} className="text-[#8E8E9E] hover:text-[#FFFFFF] p-1.5 rounded-xl hover:bg-[#1E1E28] transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#A1A1B4] uppercase tracking-wider">
              TASK TITLE
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Implement WebRTC 48kHz Opus Stage..."
              className="w-full bg-[#171720] border border-[#2F2F3E] focus:border-[#FFFFFF] px-3 py-2 rounded-xl text-xs text-[#FFFFFF] outline-none transition-colors"
            />
          </div>

          {/* Priority & Column */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#A1A1B4] uppercase tracking-wider">
                PRIORITY BADGE
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-[#171720] border border-[#2F2F3E] focus:border-[#FFFFFF] px-3 py-2 rounded-xl text-xs text-[#FFFFFF] outline-none transition-colors"
              >
                <option value="P0">P0 // CRITICAL PATH</option>
                <option value="P1">P1 // HIGH VALUE</option>
                <option value="P2">P2 // STANDARD TASK</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#A1A1B4] uppercase tracking-wider">
                INITIAL COLUMN
              </label>
              <select
                value={column}
                onChange={e => setColumn(e.target.value as TaskColumn)}
                className="w-full bg-[#171720] border border-[#2F2F3E] focus:border-[#FFFFFF] px-3 py-2 rounded-xl text-xs text-[#FFFFFF] outline-none transition-colors"
              >
                <option value="queued">01 // QUEUED SPECS</option>
                <option value="active">02 // ACTIVE AGENT LOOP</option>
                <option value="shipped">03 // VERIFIED & SHIPPED</option>
              </select>
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#A1A1B4] uppercase tracking-wider">
              ASSIGNEE MEMBER
            </label>
            <select
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              className="w-full bg-[#171720] border border-[#2F2F3E] focus:border-[#FFFFFF] px-3 py-2 rounded-xl text-xs text-[#FFFFFF] outline-none transition-colors"
            >
              <option value="">-- UNASSIGNED (AVAILABLE TO DISPATCH) --</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  [{m.badge}] {m.name} // {m.role}
                </option>
              ))}
            </select>
          </div>

          {/* Spec Details (Markdown) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#A1A1B4] uppercase tracking-wider">
              TASK SPECIFICATION (INJECTED INTO DISPATCH AI)
            </label>
            <textarea
              rows={4}
              value={spec}
              onChange={e => setSpec(e.target.value)}
              placeholder="Detailed technical requirements, acceptance criteria, or code targets..."
              className="w-full bg-[#171720] border border-[#2F2F3E] focus:border-[#FFFFFF] p-3 rounded-xl text-xs text-[#FFFFFF] font-mono outline-none resize-none transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-[#242432] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#2F2F3E] rounded-xl hover:bg-[#1E1E28] text-[#8E8E9E] hover:text-[#FFFFFF] text-xs font-semibold transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#FFFFFF] text-[#000000] font-bold text-xs rounded-xl border border-[#FFFFFF] hover:bg-[#E2E2E8] transition-colors shadow-sm"
            >
              {taskToEdit ? 'SAVE CHANGES' : 'CREATE TASK'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
