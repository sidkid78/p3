'use client';

import React, { useState } from 'react';
import GlassCard from '@/components/atoms/GlassCard';
import GuestDetailDrawer from '@/components/planning/GuestDetailDrawer';

interface Guest {
    id: string;
    name: string;
    email: string;
    rsvp: 'confirmed' | 'pending' | 'declined';
    diet: string;
    phone?: string;
    plusOne?: boolean;
    plusOneName?: string;
    notes?: string;
}

interface GuestManagerProps {
    data: Guest[];
}

const GuestManager: React.FC<GuestManagerProps> = ({ data }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all');
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const filteredGuests = data.filter(guest => {
        const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guest.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || guest.rsvp === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleGuestClick = (guest: Guest) => {
        setSelectedGuest(guest);
        setIsDrawerOpen(true);
    };

    const stats = {
        total: data.length,
        confirmed: data.filter(g => g.rsvp === 'confirmed').length,
        pending: data.filter(g => g.rsvp === 'pending').length,
        declined: data.filter(g => g.rsvp === 'declined').length
    };

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-primary/60 text-xs font-bold tracking-widest uppercase">Planner</span>
                        <span className="text-white/20 text-xs">/</span>
                        <span className="text-white/90 text-xs font-bold tracking-widest uppercase">Guest Manager</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold bg-linear-to-r from-white to-primary bg-clip-text text-transparent mb-2">
                        Guest &amp; RSVP Manager
                    </h1>
                    <p className="text-white/50 text-base max-w-xl">
                        Manage your guest list and special accommodations with ease.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 glass rounded-xl hover:bg-white/5 transition-all text-sm font-bold border border-white/10 group">
                        <span className="material-symbols-outlined text-lg">mail</span>
                        Send Blasts
                    </button>
                    <button className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add Guest
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Guests', value: stats.total, color: 'text-white' },
                    { label: 'Confirmed', value: stats.confirmed, color: 'text-emerald-400' },
                    { label: 'Awaiting', value: stats.pending, color: 'text-amber-400' },
                    { label: 'Declined', value: stats.declined, color: 'text-rose-400' }
                ].map((stat, idx) => (
                    <GlassCard key={idx} className="p-6 border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-[2] group-hover:rotate-0">
                            <span className="material-symbols-outlined text-4xl">analytics</span>
                        </div>
                        <p className="text-[10px] uppercase text-white/30 font-black tracking-widest mb-1">{stat.label}</p>
                        <p className={`text-3xl font-display font-black ${stat.color}`}>{stat.value}</p>
                    </GlassCard>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/2 p-4 rounded-3xl border border-white/5">
                <div className="relative w-full md:w-96 group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">search</span>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 scrollbar-hide">
                    {(['all', 'confirmed', 'pending', 'declined'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${filterStatus === status
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Guest List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredGuests.map((guest) => (
                    <div
                        key={guest.id}
                        onClick={() => handleGuestClick(guest)}
                        className="group relative glass p-6 rounded-3xl border border-white/5 hover:border-primary/30 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-primary/5 translate-y-0 hover:-translate-y-2"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-linear-to-br from-primary/20 to-secondary-rose/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                                    <span className="text-lg font-black text-white">{guest.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-primary transition-colors leading-tight">{guest.name}</h3>
                                    <p className="text-xs text-white/30 truncate max-w-[150px]">{guest.email}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${guest.rsvp === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                guest.rsvp === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}>
                                {guest.rsvp}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 py-4 border-t border-white/5">
                            <div className="flex-1 flex flex-col gap-1">
                                <span className="text-[10px] uppercase text-white/20 font-black tracking-widest">Dietary Preference</span>
                                <span className="text-xs font-bold text-white/70">{guest.diet}</span>
                            </div>
                            {guest.plusOne && (
                                <div className="size-8 rounded-lg glass flex items-center justify-center text-primary/60 border border-primary/20">
                                    <span className="material-symbols-outlined text-sm">group</span>
                                </div>
                            )}
                        </div>

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-white/20">chevron_right</span>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {filteredGuests.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-white/20 glass rounded-3xl border-2 border-dashed border-white/5">
                        <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
                        <p className="text-sm font-black uppercase tracking-widest">No matching guests found</p>
                    </div>
                )}
            </div>

            <GuestDetailDrawer
                guest={selectedGuest}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
};

export default GuestManager;
