'use client';

import React from 'react';
import GlassCard from '@/components/atoms/GlassCard';

interface BudgetTrackerProps {
    data: any[];
    limit: number;
    spent: number;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ data, limit, spent }) => {
    const percentage = (spent / limit) * 100;

    return (
        <div className="flex flex-col gap-10 transition-colors duration-300">
            <div className="flex flex-wrap justify-between items-end gap-6">
                <div className="flex flex-col gap-4">
                    <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-text-main tracking-tight">Budget Tracker</h1>
                    <p className="opacity-60 text-lg sm:text-xl font-light">Keep your event finances on track and under control.</p>
                </div>
                <button className="h-14 px-10 rounded-2xl bg-secondary-rose text-white font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-rose-500/10">
                    <span className="material-symbols-outlined text-xl">add_circle</span>
                    <span>Add Expense</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <GlassCard className="p-8 flex flex-col gap-6 rounded-3xl border border-panel-border">
                    <div className="flex justify-between items-center relative z-10">
                        <p className="opacity-50 text-[10px] font-black uppercase tracking-[0.2em]">Total Budget</p>
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                        </div>
                    </div>
                    <p className="text-4xl lg:text-5xl font-black text-text-main tracking-tighter relative z-10">${limit.toLocaleString()}</p>
                </GlassCard>
                <GlassCard className="p-8 flex flex-col gap-6 rounded-3xl border border-panel-border">
                    <div className="flex justify-between items-center relative z-10">
                        <p className="opacity-50 text-[10px] font-black uppercase tracking-[0.2em]">Total Spent</p>
                        <div className="size-10 rounded-xl bg-secondary-rose/10 flex items-center justify-center text-secondary-rose border border-secondary-rose/10 transition-all">
                            <span className="material-symbols-outlined text-[20px]">trending_down</span>
                        </div>
                    </div>
                    <p className="text-4xl lg:text-5xl font-black text-text-main tracking-tighter relative z-10">${spent.toLocaleString()}</p>
                </GlassCard>
                <GlassCard className="p-8 flex flex-col gap-6 rounded-3xl border border-panel-border">
                    <div className="flex justify-between items-center relative z-10">
                        <p className="opacity-50 text-[10px] font-black uppercase tracking-[0.2em]">Remaining</p>
                        <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                            <span className="material-symbols-outlined text-[20px]">trending_up</span>
                        </div>
                    </div>
                    <p className="text-4xl lg:text-5xl font-black text-text-main tracking-tighter relative z-10">${(limit - spent).toLocaleString()}</p>
                </GlassCard>
            </div>

            <GlassCard className="p-8 flex flex-col gap-8 rounded-3xl border border-panel-border overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                    <h3 className="font-bold text-text-main text-lg tracking-tight">Overall Budget Utilization</h3>
                    <p className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">{Math.round(percentage)}%</p>
                </div>
                <div className="w-full bg-primary/5 rounded-full h-5 p-1 border border-panel-border relative z-10 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 shadow-xl ${percentage > 90 ? 'bg-secondary-rose shadow-rose-500/20' : percentage > 70 ? 'bg-amber-400 shadow-amber-500/20' : 'bg-primary shadow-primary/20'
                            }`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-12">
                    <GlassCard className="rounded-3xl overflow-hidden border border-panel-border">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-panel-border bg-primary/[0.03]">
                                        <th className="px-8 py-6 text-[10px] opacity-50 uppercase font-black tracking-[0.2em]">Category</th>
                                        <th className="px-8 py-6 text-[10px] opacity-50 uppercase font-black tracking-[0.2em]">Allocated</th>
                                        <th className="px-8 py-6 text-[10px] opacity-50 uppercase font-black tracking-[0.2em]">Spent</th>
                                        <th className="px-8 py-6 text-[10px] opacity-50 uppercase font-black tracking-[0.2em]">Progress</th>
                                        <th className="px-8 py-6 text-[10px] opacity-50 uppercase font-black tracking-[0.2em] text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-panel-border">
                                    {data.map((item) => {
                                        const itemPercent = (item.spent / item.amount) * 100;
                                        return (
                                            <tr key={item.id} className="hover:bg-primary/[0.02] transition-colors group">
                                                <td className="px-8 py-6">
                                                    <p className="font-bold text-text-main group-hover:text-primary transition-colors tracking-tight">{item.category}</p>
                                                </td>
                                                <td className="px-8 py-6 text-sm opacity-60 font-medium">${item.amount.toLocaleString()}</td>
                                                <td className="px-8 py-6 text-sm text-text-main font-black">${item.spent.toLocaleString()}</td>
                                                <td className="px-8 py-6 w-56">
                                                    <div className="w-full bg-primary/5 rounded-full h-1.5 mt-1 overflow-hidden">
                                                        <div className="bg-primary h-full transition-all duration-500" style={{ width: `${itemPercent}%` }} />
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border transition-all ${item.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                                        item.status === 'partial' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                                            'bg-primary/5 opacity-40 border-panel-border'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default BudgetTracker;
