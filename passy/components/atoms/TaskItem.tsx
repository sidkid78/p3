import React from 'react';

interface TaskItemProps {
  title: string;
  dueDate: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, dueDate }) => {
  return (
    <div className="flex items-center justify-between p-6 bg-primary/[0.02] border border-panel-border rounded-2xl group hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden hover:bg-primary/5">
      <div className="absolute left-0 top-0 w-1 h-full bg-primary/40 scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
      <div className="flex items-center gap-5 relative z-10">
        <div className="size-8 rounded-xl border-2 border-primary/20 flex items-center justify-center transition-all group-hover:border-primary/50 group-hover:bg-primary/10">
          <span className="material-symbols-outlined text-primary text-sm opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">check</span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-base font-bold text-text-main tracking-tight">{title}</p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[12px] opacity-40">calendar_today</span>
            <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">{dueDate}</p>
          </div>
        </div>
      </div>
      <span className="material-symbols-outlined opacity-30 group-hover:text-primary transition-all group-hover:translate-x-1 group-hover:opacity-100">chevron_right</span>
    </div>
  );
};

export default TaskItem;
