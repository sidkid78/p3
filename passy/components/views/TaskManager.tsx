'use client';

import React, { useState } from 'react';
import GlassCard from '@/components/atoms/GlassCard';

interface Task {
    id: string;
    title: string;
    dueDate: string;
    category: string;
    status: 'pending' | 'completed';
}

interface TaskManagerProps {
    initialTasks: { title: string; dueDate: string; category?: string; status?: string }[];
}

const TaskManager: React.FC<TaskManagerProps> = ({ initialTasks }) => {
    const [tasks, setTasks] = useState<Task[]>(
        initialTasks.map((t, idx) => ({
            id: String(idx + 1),
            title: t.title,
            dueDate: t.dueDate,
            category: t.category || 'General',
            status: (t.status === 'completed' ? 'completed' : 'pending') as 'pending' | 'completed'
        }))
    );

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(t =>
            t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
        ));
    };

    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    return (
        <div className="flex flex-col gap-10 transition-colors duration-300">
            <div className="flex flex-wrap justify-between items-end gap-6">
                <div className="flex flex-col gap-4">
                    <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-text-main tracking-tight">Event Checklist</h1>
                    <p className="opacity-60 text-lg sm:text-xl font-light">Stay organized and track your progress step by step.</p>
                </div>
                <button className="h-14 px-10 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10">
                    <span className="material-symbols-outlined text-xl">add_task</span>
                    <span>New Task</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-[10px] opacity-40 uppercase font-black tracking-[0.2em] ml-1">Up Next</h3>
                        <div className="flex flex-col gap-3">
                            {pendingTasks.map((task) => (
                                <GlassCard key={task.id} className="p-6 flex items-center gap-5 group hover:border-primary/30 transition-all rounded-2xl border-panel-border overflow-hidden">
                                    <div className="absolute left-0 top-0 w-1 h-full bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className="size-8 rounded-xl border-2 border-primary/20 flex items-center justify-center text-transparent hover:border-primary/50 group-hover:bg-primary/10 transition-all relative z-10"
                                    >
                                        <span className="material-symbols-outlined text-lg">check</span>
                                    </button>
                                    <div className="flex-1 flex flex-col relative z-10">
                                        <p className="font-bold text-text-main group-hover:text-primary transition-colors tracking-tight">{task.title}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] opacity-50 font-black uppercase tracking-widest">{task.category}</span>
                                            <span className="size-1 rounded-full bg-primary/20" />
                                            <span className="text-[10px] text-secondary-rose font-black uppercase tracking-widest">{task.dueDate}</span>
                                        </div>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity opacity-40 hover:opacity-100 relative z-10">
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </GlassCard>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-[10px] opacity-40 uppercase font-black tracking-[0.2em] ml-1">Completed</h3>
                        <div className="flex flex-col gap-3 opacity-60">
                            {completedTasks.map((task) => (
                                <GlassCard key={task.id} className="p-6 flex items-center gap-5 rounded-2xl border-panel-border grayscale">
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className="size-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20"
                                    >
                                        <span className="material-symbols-outlined text-lg">check</span>
                                    </button>
                                    <div className="flex-1 flex flex-col">
                                        <p className="font-bold text-text-main/50 line-through tracking-tight">{task.title}</p>
                                        <p className="text-[10px] opacity-40 font-black uppercase tracking-widest mt-1">{task.category}</p>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    <GlassCard className="p-8 flex flex-col gap-8 rounded-3xl border border-panel-border relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16" />
                        <h3 className="text-sm font-black text-text-main uppercase tracking-widest flex items-center gap-3">
                            <span className="material-symbols-outlined text-xl text-primary animate-pulse">analytics</span>
                            Insights
                        </h3>
                        <div className="flex flex-col gap-5">
                            <div className="flex justify-between items-center">
                                <p className="text-sm opacity-60 font-medium tracking-tight">Completion Rate</p>
                                <p className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">{tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%</p>
                            </div>
                            <div className="w-full h-2.5 bg-primary/5 rounded-full overflow-hidden border border-panel-border transition-all">
                                <div
                                    className="h-full bg-primary shadow-lg shadow-primary/20 transition-all duration-1000"
                                    style={{ width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="p-5 rounded-2xl bg-primary/[0.03] border border-panel-border text-center group hover:bg-primary/[0.06] transition-all">
                                <p className="text-3xl font-black text-text-main group-hover:text-primary transition-colors tracking-tighter">{pendingTasks.length}</p>
                                <p className="text-[10px] opacity-40 font-black uppercase tracking-widest mt-1">Remaining</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center group hover:bg-emerald-500/10 transition-all">
                                <p className="text-3xl font-black text-emerald-600 transition-colors tracking-tighter">{completedTasks.length}</p>
                                <p className="text-[10px] opacity-40 font-black uppercase tracking-widest mt-1">Done</p>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-8 flex flex-col gap-6 rounded-3xl border border-panel-border">
                        <h3 className="text-sm font-black text-text-main uppercase tracking-widest">Categories</h3>
                        <div className="flex flex-col gap-4">
                            {['Invites', 'Food', 'Decor', 'Logistics'].map(cat => {
                                const count = tasks.filter(t => t.category === cat).length;
                                return (
                                    <div key={cat} className="flex justify-between items-center group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <span className="size-2 rounded-full bg-primary/30 group-hover:bg-primary transition-all group-hover:scale-125" />
                                            <p className="text-sm opacity-60 group-hover:text-text-main group-hover:opacity-100 transition-all tracking-tight">{cat}</p>
                                        </div>
                                        <span className="text-[10px] font-black opacity-30 group-hover:opacity-100 transition-all">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default TaskManager;
