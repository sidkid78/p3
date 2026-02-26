'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/atoms/GlassCard';
import { analyzeBudget } from '@/app/actions/ai/analyze-budget';

import { BudgetItem } from '@/types/dashboard';

interface BudgetIntel {
    title: string;
    message: string;
    type: 'tip' | 'warning';
}

interface BudgetViewProps {
    data: BudgetItem[];
    limit: number;
    spent: number;
}

const BudgetView: React.FC<BudgetViewProps> = ({ data, limit, spent }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [intel, setIntel] = useState<BudgetIntel[]>([]);
    const [isLoadingIntel, setIsLoadingIntel] = useState(false);

    const percentage = Math.min((spent / limit) * 100, 100);
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const handleRefreshInsights = React.useCallback(async () => {
        setIsLoadingIntel(true);
        try {
            const insights = await analyzeBudget(data);
            setIntel(insights);
        } catch (error) {
            console.error("Failed to fetch insights:", error);
        } finally {
            setIsLoadingIntel(false);
        }
    }, [data]);

    useEffect(() => {
        handleRefreshInsights();
    }, [handleRefreshInsights]);

    const filteredData = data.filter(item =>
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="flex flex-col gap-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-primary/60 text-xs font-bold tracking-widest uppercase">Planner</span>
                        <span className="text-white/20 text-xs">/</span>
                        <span className="text-white/90 text-xs font-bold tracking-widest uppercase">Budget Tracker</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold bg-linear-to-r from-white to-primary bg-clip-text text-transparent mb-2">
                        Budget Tracker
                    </h1>
                    <p className="text-white/50 text-base max-w-xl">
                        Curating your dream baby shower with intelligent expense management and premium insights.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-primary/10 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all text-white/80">
                        <span className="material-symbols-outlined text-lg focus:outline-none">download</span> Export PDF
                    </button>
                    <button className="bg-linear-to-r from-primary to-rose-400 text-[#120c1c] font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-[0_0_20px_rgba(208,184,227,0.3)]">
                        Add Expense
                    </button>
                </div>
            </div>

            {/* Stats and AI Intel Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Financial Health Section */}
                <GlassCard className="lg:col-span-2 p-8 flex flex-col md:flex-row items-center gap-10">
                    <div className="relative size-56 shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle className="text-white/5" cx="50" cy="50" fill="transparent" r={radius} stroke="currentColor" strokeWidth="8"></circle>
                            <motion.circle
                                className="text-primary"
                                cx="50" cy="50" fill="transparent" r={radius}
                                stroke="currentColor"
                                strokeWidth="8"
                                strokeLinecap="round"
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                style={{ strokeDasharray: circumference }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-white">{Math.round(percentage)}%</span>
                            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary/60">Spent</span>
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <h3 className="text-xl font-display font-bold mb-6 text-white">Financial Health</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-2">Allocated Budget</p>
                                <p className="text-3xl font-bold text-white">{formatCurrency(limit)}</p>
                            </div>
                            <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-2">Current Spending</p>
                                <p className="text-3xl font-bold text-white">{formatCurrency(spent)}</p>
                            </div>
                            <div className="p-5 rounded-xl bg-primary/10 border border-primary/20 relative overflow-hidden group">
                                <p className="text-[10px] text-primary uppercase font-bold tracking-wider mb-2">Available Balance</p>
                                <p className="text-3xl font-bold text-primary">{formatCurrency(limit - spent)}</p>
                                <span className="absolute top-2 right-2 material-symbols-outlined text-primary/30 text-sm">account_balance_wallet</span>
                            </div>
                            <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-2">Transaction Count</p>
                                <p className="text-3xl font-bold text-white">{data.length} <span className="text-sm font-normal text-white/40">Items</span></p>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* AI Intel Panel */}
                <GlassCard className="p-8 flex flex-col border-primary/30">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-primary/20 text-primary">
                            <span className="material-symbols-outlined text-xl">auto_awesome</span>
                        </div>
                        <h3 className="text-xl font-display font-bold text-white">AI Intel</h3>
                    </div>

                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {isLoadingIntel ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="animate-pulse bg-white/5 rounded-xl p-4 h-24" />
                                ))
                            ) : (
                                intel.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-primary/5 backdrop-blur-md border border-primary/10 rounded-xl p-4 hover:bg-primary/10 transition-all group"
                                    >
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5 flex justify-between">
                                            {item.title}
                                            {item.type === 'warning' && <span className="text-rose-400">●</span>}
                                        </p>
                                        <p className="text-sm text-white/70 leading-relaxed">
                                            {item.message}
                                        </p>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={handleRefreshInsights}
                        disabled={isLoadingIntel}
                        className="mt-6 w-full py-3 text-xs font-bold text-primary uppercase tracking-widest border border-primary/20 rounded-xl hover:bg-primary/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <span className={`material-symbols-outlined text-sm ${isLoadingIntel ? 'animate-spin' : ''}`}>refresh</span>
                        Refresh Insights
                    </button>
                </GlassCard>
            </div>

            {/* Expense Breakdown Table */}
            <GlassCard className="overflow-hidden border-white/5">
                <div className="p-8 border-b border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h3 className="text-xl font-display font-bold text-white mb-1">Expense Breakdown</h3>
                        <p className="text-sm text-white/40">Detailed log of all planned and actual expenditures.</p>
                    </div>
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 lg:flex-none">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg">search</span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search line items..."
                                className="w-full lg:w-72 pl-12 pr-4 py-3 rounded-xl border-none bg-white/5 text-sm text-white placeholder-white/30 focus:ring-1 focus:ring-primary/40 transition-all"
                            />
                        </div>
                        <button className="p-3 bg-white/5 border border-white/5 rounded-xl text-white/50 hover:text-primary transition-all">
                            <span className="material-symbols-outlined">filter_list</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/2 border-b border-white/5">
                                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Expense Category</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Estimate</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Actual</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Variance</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] text-center">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] text-right">Options</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredData.map((item, idx) => {
                                const variance = item.spent - item.amount;
                                const isOver = variance > 0;
                                const isUnder = variance < 0;

                                return (
                                    <tr key={idx} className="hover:bg-primary/3 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                                                    <span className="material-symbols-outlined text-primary text-xl">
                                                        {item.category.toLowerCase().includes('catering') ? 'restaurant' :
                                                            item.category.toLowerCase().includes('venue') ? 'home_work' :
                                                                item.category.toLowerCase().includes('decor') ? 'palette' : 'mail'}
                                                    </span>
                                                </div>
                                                <span className="font-bold text-sm text-white/90">{item.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-white/70">{formatCurrency(item.amount)}</td>
                                        <td className="px-8 py-5 text-sm text-white/90 font-bold">{formatCurrency(item.spent)}</td>
                                        <td className={`px-8 py-5 text-sm font-bold ${isOver ? 'text-rose-400' : isUnder ? 'text-emerald-400' : 'text-white/30'}`}>
                                            {variance === 0 ? '$0.00' : `${isOver ? '+' : '-'} ${formatCurrency(Math.abs(variance))}`}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${item.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    item.status === 'partial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        'bg-white/5 text-white/40 border-white/10'
                                                }`}>
                                                {item.status || 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="text-white/20 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="bg-primary/5 font-bold border-t border-primary/10">
                                <td className="px-8 py-6 text-[11px] uppercase tracking-widest text-primary">Total Summary</td>
                                <td className="px-8 py-6 text-base text-white/70">{formatCurrency(limit)}</td>
                                <td className="px-8 py-6 text-lg text-white" colSpan={4}>
                                    <span className="text-primary shadow-[0_0_15px_rgba(208,184,227,0.3)]">{formatCurrency(spent)}</span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};

export default BudgetView;
