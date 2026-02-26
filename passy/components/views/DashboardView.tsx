'use client';

import React from 'react';
import StatCard from "@/components/atoms/StatCard"
import GlassCard from "@/components/atoms/GlassCard"
import TaskItem from "@/components/atoms/TaskItem"
import type { DashboardData, Task } from "@/types/dashboard"

interface DashboardViewProps {
    data: DashboardData;
}

const DashboardView: React.FC<DashboardViewProps> = ({ data }) => {
    const { event, tasks } = data;

    const stats = [
        { label: "Guest Count", value: String(event.guestCount), subValue: `/ ${event.guestLimit}`, icon: "groups", trend: { label: "+2 today", icon: "trending_up", type: "success" as const } },
        { label: "Budget Spent", value: `$${event.budgetSpent.toLocaleString()}`, subValue: `/ ${event.budgetLimit.toLocaleString()}`, icon: "payments", trend: { label: "-5% budget alert", icon: "warning", type: "warning" as const } },
        { label: "Days to Event", value: String(event.daysToGo), icon: "calendar_today", subValue: event.date },
    ];

    return (
        <div className="flex flex-col gap-12 transition-colors duration-300">
            <div className="flex flex-wrap justify-between items-end gap-8">
                <div className="flex flex-col gap-4">
                    <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-text-main tracking-tight">Welcome back, {data.user.name}!</h1>
                    <p className="opacity-60 text-lg sm:text-xl font-light">You're {event.progress}% ready for your big day. <span className="text-primary font-bold">{event.daysToGo} days to go.</span></p>
                </div>
                <button className="flex items-center justify-center gap-3 rounded-2xl h-14 px-8 glass-button text-text-main text-sm font-bold shadow-lg shadow-primary/5">
                    <span className="material-symbols-outlined text-primary scale-110">auto_awesome</span>
                    <span>Ask AI for Help</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 flex flex-col gap-10">
                    <GlassCard className="rounded-3xl p-8 lg:p-10">
                        <h2 className="font-display text-2xl font-bold text-text-main mb-10 flex items-center gap-3">
                            <span className="size-2 rounded-full bg-primary shadow-[0_0_10px_rgba(165,61,245,0.6)]"></span>
                            Planning Progress
                        </h2>
                        <div className="flex flex-col gap-6">
                            <div className="w-full bg-primary/5 rounded-full h-5 p-1 border border-panel-border overflow-hidden">
                                <div className="bg-linear-to-r from-primary via-secondary-rose to-purple-500 h-full rounded-full shadow-[0_0_15px_rgba(165,61,245,0.3)] shadow-inner" style={{ width: `${event.progress}%` }}></div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-2">
                                <div className="bg-primary/[0.03] p-4 rounded-xl border border-panel-border text-center">
                                    <p className="text-[10px] opacity-50 uppercase font-black tracking-widest mb-1">Venue</p>
                                    <p className="font-bold text-emerald-500">{event.status.venue}</p>
                                </div>
                                <div className="bg-primary/[0.03] p-4 rounded-xl border border-panel-border text-center">
                                    <p className="text-[10px] opacity-50 uppercase font-black tracking-widest mb-1">Catering</p>
                                    <p className="font-bold text-amber-500">{event.status.catering}</p>
                                </div>
                                <div className="bg-primary/[0.03] p-4 rounded-xl border border-panel-border text-center">
                                    <p className="text-[10px] opacity-50 uppercase font-black tracking-widest mb-1">Guests</p>
                                    <p className="font-bold text-emerald-500">{event.status.guests}</p>
                                </div>
                                <div className="bg-primary/[0.03] p-4 rounded-xl border border-panel-border text-center">
                                    <p className="text-[10px] opacity-50 uppercase font-black tracking-widest mb-1">Theme</p>
                                    <p className="font-bold text-primary">{event.status.theme}</p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="rounded-3xl p-8 lg:p-10">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="font-display text-2xl font-bold text-text-main tracking-tight">Upcoming Tasks</h2>
                            <button className="text-primary text-sm font-bold hover:opacity-80 transition-all tracking-widest uppercase">View All</button>
                        </div>
                        <div className="flex flex-col gap-4">
                            {tasks.map((task: Task, idx: number) => (
                                <TaskItem key={idx} {...task} />
                            ))}
                        </div>
                    </GlassCard>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-10">
                    <GlassCard className="rounded-3xl p-8 lg:p-10 h-full">
                        <div className="flex items-center gap-3 mb-10">
                            <span className="material-symbols-outlined text-primary scale-110">auto_awesome</span>
                            <h2 className="font-display text-2xl font-bold text-text-main tracking-tight">AI Ideas</h2>
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="group cursor-pointer">
                                <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden mb-4 border border-panel-border">
                                    <img alt="Floral arrangement" className="object-cover size-full group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhaXMft4siuYvGTp315UF6_4V0vGf7szNh6ACDH27Ra8Vges7XHKkgEZryt_fjYFFxtHKTsQXp06zZ6gu7ZBKu_TAMMnrM6hZqlu0YwoDQcR2KECkSRR-ba4zAN0c0d3EJ0EKOamFfl3pdkFItx6Dq8zz1P4VEu4_wue5d_3loP4CayHy9dkjQdAPmFHy5eLIGuf_FdxEASVx-4xV_LX1eRZRbshmRCYgi8OnAyUdv6BjErAHZwHtHwrH7ug26Nw0X5pfaGRzt8HU" />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                                        <span className="text-white text-[10px] font-black bg-primary px-3 py-1.5 rounded-full uppercase tracking-widest">Theme Inspiration</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors tracking-tight">Floral Dreams Palette</h3>
                                <p className="text-sm opacity-60 mt-2 leading-relaxed font-light">Soft lavender and cream accents with watercolor textures for the stationery.</p>
                            </div>
                            <div className="group cursor-pointer border-2 border-dashed border-primary/20 rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-primary/5 hover:border-primary/40 transition-all">
                                <span className="material-symbols-outlined text-primary text-4xl mb-3 animate-bounce">add_circle</span>
                                <p className="text-sm font-bold text-text-main uppercase tracking-widest">Generate More</p>
                                <p className="text-xs opacity-50 mt-2 text-center font-light">Let AI create a custom moodboard for you.</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
