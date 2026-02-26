'use client';

import React, { useState } from 'react';

interface Registry {
    id: string;
    name: string;
    url: string;
    displayUrl: string;
    status: 'shared' | 'draft';
    updatedAt: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    accentBar?: string;
}

const defaultRegistries: Registry[] = [
    {
        id: '1',
        name: 'Amazon',
        url: 'https://amazon.com/baby-reg/thompson-family',
        displayUrl: 'amazon.com/baby-reg/thompson-family',
        status: 'shared',
        updatedAt: 'Updated 2h ago',
        icon: 'shopping_cart',
        iconBg: 'bg-white',
        iconColor: 'text-black',
        accentBar: '#FF9900',
    },
    {
        id: '2',
        name: 'Target',
        url: 'https://target.com/gift-registry/gift/thompson',
        displayUrl: 'target.com/gift-registry/gift/thompson',
        status: 'shared',
        updatedAt: 'Updated 1d ago',
        icon: 'target',
        iconBg: 'bg-[#cc0000]',
        iconColor: 'text-white',
    },
    {
        id: '3',
        name: 'Babylist',
        url: 'https://babylist.com/baby-thompson-registry',
        displayUrl: 'babylist.com/baby-thompson-registry',
        status: 'draft',
        updatedAt: 'Added just now',
        icon: 'card_giftcard',
        iconBg: 'bg-[#322a44] border border-white/10',
        iconColor: 'text-purple-300',
    },
];

const GiftRegistryManager = () => {
    const [registries, setRegistries] = useState<Registry[]>(defaultRegistries);
    const [urlInput, setUrlInput] = useState('');
    const [isDetecting, setIsDetecting] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleDetect = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!urlInput.trim()) return;
        setIsDetecting(true);
        await new Promise(r => setTimeout(r, 1200));
        // Simulate adding a new registry
        const hostname = new URL(urlInput).hostname.replace('www.', '');
        const storeName = hostname.split('.')[0];
        const newReg: Registry = {
            id: String(Date.now()),
            name: storeName.charAt(0).toUpperCase() + storeName.slice(1),
            url: urlInput,
            displayUrl: hostname + new URL(urlInput).pathname,
            status: 'draft',
            updatedAt: 'Added just now',
            icon: 'redeem',
            iconBg: 'bg-primary/20',
            iconColor: 'text-primary',
        };
        setRegistries(prev => [...prev, newReg]);
        setUrlInput('');
        setIsDetecting(false);
    };

    const handleCopy = (reg: Registry) => {
        navigator.clipboard.writeText(reg.url).catch(() => { });
        setCopiedId(reg.id);
        setTimeout(() => setCopiedId(null), 2000);
    };


    return (
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-primary/60 text-xs font-bold tracking-widest uppercase">Planner</span>
                        <span className="text-white/20 text-xs">/</span>
                        <span className="text-white/90 text-xs font-bold tracking-widest uppercase">Gift Registry</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold bg-linear-to-r from-white to-primary bg-clip-text text-transparent mb-2">
                        Gift Registry Manager
                    </h1>
                    <p className="text-white/50 text-base max-w-2xl">
                        Organize all your baby registries in one place. Add links, and we&apos;ll keep track of everything for your guests.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold text-white transition-all shrink-0">
                    <span className="material-symbols-outlined text-lg">share</span>
                    Share All
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Left Panel: Add Registry Form */}
                <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-6">
                    <div className="bg-white/4 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-2xl p-6 lg:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-primary/20 text-primary border border-primary/30">
                                <span className="material-symbols-outlined">add_link</span>
                            </div>
                            <h2 className="text-xl font-bold text-white">Add New Registry</h2>
                        </div>
                        <p className="text-white/40 text-sm mb-6 leading-relaxed">
                            Paste a registry URL below. Passy AI will automatically parse the store name, fetch the logo, and sync items.
                        </p>
                        <form onSubmit={handleDetect} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Registry URL</label>
                                <div className="flex items-center bg-black/30 border border-white/10 rounded-xl px-3 py-3 gap-2 focus-within:border-primary/50 focus-within:shadow-[0_0_0_2px_rgba(165,61,245,0.1)] transition-all">
                                    <span className="material-symbols-outlined text-white/20 text-lg shrink-0">link</span>
                                    <input
                                        type="url"
                                        required
                                        value={urlInput}
                                        onChange={e => setUrlInput(e.target.value)}
                                        placeholder="https://www.amazon.com/baby-reg/..."
                                        className="bg-transparent w-full outline-none text-white placeholder:text-white/20 text-sm border-none focus:ring-0 p-0"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isDetecting}
                                className="w-full mt-1 py-3.5 rounded-xl bg-linear-to-r from-primary to-purple-600 font-bold text-white text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(165,61,245,0.4)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70"
                            >
                                <span className={`material-symbols-outlined text-lg ${isDetecting ? 'animate-spin' : ''}`}>
                                    {isDetecting ? 'sync' : 'auto_awesome'}
                                </span>
                                {isDetecting ? 'Detecting...' : 'Detect & Add Registry'}
                            </button>
                        </form>

                        {/* Store Logos */}
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <p className="text-xs text-white/20 mb-4 text-center">Automatically supports 50+ stores including</p>
                            <div className="flex justify-center gap-4 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                <div className="h-6 w-12 bg-white rounded flex items-center justify-center">
                                    <span className="text-[8px] font-bold text-black leading-none">amzn</span>
                                </div>
                                <div className="h-6 w-6 bg-red-600 rounded-full flex items-center justify-center">
                                    <div className="h-3 w-3 bg-white rounded-full" />
                                </div>
                                <div className="h-6 w-12 bg-purple-900 border border-white/20 rounded flex items-center justify-center">
                                    <span className="text-[8px] font-bold text-white leading-none">baby</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Grid: Registry Cards */}
                <div className="flex-1 w-full">
                    {/* Grid Header */}
                    <div className="flex items-center justify-between mb-6 px-1">
                        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">
                            Active Registries ({registries.length})
                        </h3>
                        <div className="flex gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-lg">grid_view</span>
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-lg">list</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {registries.map(reg => (
                            <div
                                key={reg.id}
                                className="group relative bg-white/3 backdrop-blur-md border border-white/8 rounded-2xl p-6 flex flex-col hover:bg-white/6 hover:border-primary/30 hover:shadow-[0_0_25px_rgba(165,61,245,0.15)] transition-all duration-300"
                            >
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-5 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-14 w-14 rounded-xl ${reg.iconBg} flex items-center justify-center shadow-lg relative overflow-hidden group-hover:scale-110 transition-transform duration-300`}>
                                            <span className={`material-symbols-outlined text-3xl ${reg.iconColor}`}>{reg.icon}</span>
                                            {reg.accentBar && (
                                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full registry-accent-bar" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-white leading-none mb-1">{reg.name}</h3>
                                            <p className="text-xs text-white/40">{reg.updatedAt}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {reg.status === 'shared' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wide">
                                                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                Shared
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-wide">
                                                <span className="size-1.5 rounded-full bg-yellow-400" />
                                                Draft
                                            </span>
                                        )}
                                        <button className="text-white/30 hover:text-white transition-colors p-1">
                                            <span className="material-symbols-outlined text-lg">more_horiz</span>
                                        </button>
                                    </div>
                                </div>

                                {/* URL display */}
                                <div className="relative z-10 mb-6">
                                    <div className="bg-black/30 rounded-xl p-3 flex items-center gap-2 border border-white/5 group-hover:border-white/10 transition-colors overflow-hidden">
                                        <span className="material-symbols-outlined text-white/30 text-sm shrink-0">link</span>
                                        <span className="text-xs text-white/40 truncate">{reg.displayUrl}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-auto relative z-10 grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleCopy(reg)}
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold border border-white/10 hover:border-white/20 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-base">
                                            {copiedId === reg.id ? 'check' : 'content_copy'}
                                        </span>
                                        {copiedId === reg.id ? 'Copied!' : 'Copy Link'}
                                    </button>
                                    <a
                                        href={reg.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold border border-primary/20 hover:border-primary/30 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-base">open_in_new</span>
                                        Visit Store
                                    </a>
                                </div>
                            </div>
                        ))}

                        {/* Add Manually Placeholder */}
                        <div className="rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-6 text-white/30 hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer min-h-[220px] group">
                            <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                                <span className="material-symbols-outlined text-2xl">add</span>
                            </div>
                            <span className="font-bold text-sm">Add Manually</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiftRegistryManager;
