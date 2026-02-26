'use client';

import React, { useState } from 'react';

type ThemePreset = {
    id: string;
    name: string;
    active?: boolean;
    bg: string;
    gradient: string;
};

const themes: ThemePreset[] = [
    {
        id: 'floral',
        name: 'Floral Dream',
        active: true,
        bg: 'from-rose-300 via-pink-200 to-fuchsia-200',
        gradient: 'bg-linear-to-br from-rose-300 via-pink-200 to-fuchsia-200',
    },
    {
        id: 'safari',
        name: 'Safari Adventure',
        active: false,
        bg: 'from-amber-700 via-yellow-600 to-lime-700',
        gradient: 'bg-linear-to-br from-amber-700 via-yellow-600 to-lime-700',
    },
    {
        id: 'boho',
        name: 'Boho Minimalist',
        active: false,
        bg: 'from-stone-300 via-slate-200 to-zinc-300',
        gradient: 'bg-linear-to-br from-stone-300 via-slate-200 to-zinc-300',
    },
    {
        id: 'stellar',
        name: 'Stellar Night',
        active: false,
        bg: 'from-indigo-900 via-slate-800 to-blue-900',
        gradient: 'bg-linear-to-br from-indigo-900 via-slate-800 to-blue-900',
    },
];

const InvitationEditor = () => {
    const [title, setTitle] = useState('A Sweet Little Adventure');
    const [date, setDate] = useState('2024-06-15');
    const [time, setTime] = useState('14:00');
    const [location, setLocation] = useState('123 Willow Creek, San Francisco');
    const [activeTheme, setActiveTheme] = useState('floral');
    const [saved, setSaved] = useState(false);

    const formatDate = (d: string) => {
        if (!d) return '';
        const dt = new Date(d + 'T00:00:00');
        return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();
    };

    const formatTime = (t: string) => {
        if (!t) return '';
        const [h, m] = t.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hour = h % 12 || 12;
        return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const currentTheme = themes.find(t => t.id === activeTheme)!;
    const isLight = ['floral', 'safari', 'boho'].includes(activeTheme);

    return (
        <div className="flex flex-col h-full min-h-screen overflow-hidden">

            {/* 3-Panel Main Area */}
            <div className="flex flex-1 overflow-hidden">

                {/* ── Left Sidebar: Editor Controls ── */}
                <aside className="w-72 shrink-0 flex flex-col bg-black/30 backdrop-blur-2xl border-r border-white/10 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-primary/60 text-xs font-bold tracking-widest uppercase">Home</span>
                                <span className="text-white/20 text-xs">/</span>
                                <span className="text-white/60 text-xs font-bold tracking-widest uppercase">Invitation Editor</span>
                            </div>
                            <h2 className="text-white text-xl font-bold tracking-tight">Editor Controls</h2>
                            <p className="text-white/40 text-xs mt-1">Real-time customization</p>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-white/60 text-xs font-bold uppercase tracking-widest">Invitation Title</label>
                                <input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g. Baby Shower"
                                    className="w-full rounded-xl bg-white/3 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/8 transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-white/60 text-xs font-bold uppercase tracking-widest">Date</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        title="Event date"
                                        aria-label="Event date"
                                        className="w-full rounded-xl bg-white/3 border border-white/10 px-3 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-white/60 text-xs font-bold uppercase tracking-widest">Time</label>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={e => setTime(e.target.value)}
                                        title="Event time"
                                        aria-label="Event time"
                                        className="w-full rounded-xl bg-white/3 border border-white/10 px-3 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-white/60 text-xs font-bold uppercase tracking-widest">Location</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">location_on</span>
                                    <input
                                        value={location}
                                        onChange={e => setLocation(e.target.value)}
                                        title="Event location"
                                        aria-label="Event location"
                                        className="w-full rounded-xl bg-white/3 border border-white/10 pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Typography */}
                        <div className="pt-5 border-t border-white/10 space-y-2">
                            <label className="text-white/60 text-xs font-bold uppercase tracking-widest block mb-3">Typography Styles</label>
                            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all group">
                                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">text_fields</span>
                                <p className="text-white text-sm font-medium">Edit Heading Font</p>
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
                                <span className="material-symbols-outlined text-white/40">palette</span>
                                <p className="text-white/70 text-sm font-medium">Color Palette</p>
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
                                <span className="material-symbols-outlined text-white/40">auto_awesome</span>
                                <p className="text-white/70 text-sm font-medium">AI Rewrite Suggestions</p>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* ── Center: Live Invitation Preview ── */}
                <section className="flex-1 flex items-center justify-center p-8 md:p-12 overflow-auto relative">
                    {/* Preview Card */}
                    <div className={`relative rounded-2xl overflow-hidden aspect-4/5 shadow-[0_30px_80px_-12px_rgba(0,0,0,0.8)] group transition-transform duration-500 hover:scale-[1.01] w-[380px]`}>
                        {/* Theme Background */}
                        <div className={`absolute inset-0 ${currentTheme.gradient} scale-105 group-hover:scale-100 transition-transform duration-700`} />

                        {/* Decorative floral-ish overlay (subtle radial orbs) */}
                        <div className="absolute inset-0 opacity-30 pointer-events-none">
                            <div className="absolute top-6 right-8 w-28 h-28 rounded-full bg-white/30 blur-2xl" />
                            <div className="absolute bottom-10 left-6 w-24 h-24 rounded-full bg-white/20 blur-xl" />
                        </div>

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] group-hover:bg-black/15 transition-colors duration-300" />

                        {/* Content */}
                        <div className={`relative z-10 h-full flex flex-col items-center justify-center text-center px-10 py-12 space-y-5 ${isLight ? 'text-stone-800' : 'text-white'}`}>
                            <div className="space-y-1">
                                <p className="font-bold tracking-[0.3em] text-[9px] uppercase opacity-70">Join us for a</p>
                                <h2 className="text-4xl font-serif font-bold leading-tight drop-shadow-sm">Baby Shower</h2>
                            </div>

                            <div className="w-10 h-px bg-current opacity-30" />

                            <div className="space-y-3">
                                <p className="text-lg font-serif italic opacity-80">In honor of Sarah Jenkins</p>
                                <h3 className="text-xl font-serif font-bold tracking-wide">
                                    {title || 'A Sweet Little Adventure'}
                                </h3>
                            </div>

                            <div className="pt-5 space-y-1.5 opacity-90">
                                <p className="text-xs font-bold tracking-widest uppercase">
                                    {date ? formatDate(date) : 'SATURDAY, JUNE 15TH'} AT {time ? formatTime(time) : '2 PM'}
                                </p>
                                <p className="text-[10px] tracking-widest uppercase opacity-60">
                                    {location}
                                </p>
                            </div>

                            <div className="pt-4">
                                <div className="rounded-full bg-black/20 backdrop-blur-sm border border-current/20 px-6 py-2">
                                    <span className="text-[9px] font-bold tracking-widest uppercase">Registry: Amazon &amp; Target</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Right Sidebar: Theme Presets ── */}
                <aside className="w-64 shrink-0 flex flex-col bg-black/30 backdrop-blur-2xl border-l border-white/10 overflow-y-auto">
                    <div className="p-6 space-y-5">
                        <div>
                            <h3 className="text-white text-base font-bold">Theme Presets</h3>
                            <p className="text-white/40 text-xs mt-0.5">Switch visual styles instantly</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            {themes.map(theme => (
                                <div
                                    key={theme.id}
                                    className="group cursor-pointer"
                                    onClick={() => setActiveTheme(theme.id)}
                                >
                                    <div className={`relative w-full aspect-video rounded-xl overflow-hidden transition-all duration-300 ${activeTheme === theme.id
                                        ? 'border-2 border-primary shadow-[0_0_15px_rgba(165,61,245,0.3)]'
                                        : 'border border-white/10 hover:border-primary/40'
                                        }`}>
                                        {/* Theme color swatch */}
                                        <div className={`absolute inset-0 ${theme.gradient} group-hover:scale-105 transition-transform duration-500`} />
                                        {/* Decorative overlay */}
                                        <div className={`absolute inset-0 ${activeTheme === theme.id ? 'bg-black/20' : 'bg-black/35 group-hover:bg-black/20'} transition-colors duration-300`} />
                                        {activeTheme === theme.id && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg">check_circle</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className={`mt-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeTheme === theme.id
                                        ? 'text-primary'
                                        : 'text-white/50 group-hover:text-white'
                                        }`}>
                                        {theme.name}{activeTheme === theme.id ? ' (Active)' : ''}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Create Custom */}
                        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/20 hover:border-primary hover:bg-primary/10 transition-all text-white/40 hover:text-primary text-xs font-bold uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm">add</span>
                            Create Custom
                        </button>
                    </div>
                </aside>
            </div>

            {/* ── Footer Bar ── */}
            <footer className="shrink-0 bg-black/30 backdrop-blur-2xl border-t border-white/10 px-8 py-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-4 text-white/40 text-xs">
                    <span className="flex items-center gap-1.5">
                        <span className={`material-symbols-outlined text-sm ${saved ? 'text-green-400' : 'text-green-400'} drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]`}>cloud_done</span>
                        {saved ? 'Saving...' : 'Autosaved at 2:45 PM'}
                    </span>
                    <span className="w-px h-3 bg-white/10" />
                    <span>Version 2.4 (Draft)</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2 text-white/60 hover:text-white text-sm font-bold transition-colors">
                        Preview Web Page
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold transition-all"
                    >
                        Save as PDF
                    </button>
                    <button className="px-6 py-2 rounded-xl bg-linear-to-r from-primary to-purple-600 text-white text-sm font-bold shadow-[0_0_25px_rgba(165,61,245,0.5)] hover:shadow-[0_0_35px_rgba(165,61,245,0.7)] hover:brightness-110 hover:-translate-y-px active:translate-y-0 transition-all">
                        Send Invites
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default InvitationEditor;
