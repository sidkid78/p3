'use client';

import React from 'react';
import GlassCard from '@/components/atoms/GlassCard';

interface GuestManagerProps {
    data: any[];
}

const GuestManager: React.FC<GuestManagerProps> = ({ data }) => {
    return (
        <div className="flex flex-col gap-10">
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-3">
                    <h1 className="font-serif text-5xl lg:text-6xl font-black text-white drop-shadow-sm">Guest Manager</h1>
                    <p className="text-gray-400 text-xl">Manage your invitations and RSVPs in one place.</p>
                </div>
                <button className="h-14 px-8 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined">add</span>
                    <span>Add Guest</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <GlassCard className="p-6 text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Total</p>
                    <p className="text-3xl font-bold text-white">{data.length}</p>
                </GlassCard>
                <GlassCard className="p-6 text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Confirmed</p>
                    <p className="text-3xl font-bold text-emerald-400">{data.filter(g => g.rsvp === 'confirmed').length}</p>
                </GlassCard>
                <GlassCard className="p-6 text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Pending</p>
                    <p className="text-3xl font-bold text-amber-400">{data.filter(g => g.rsvp === 'pending').length}</p>
                </GlassCard>
                <GlassCard className="p-6 text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Declined</p>
                    <p className="text-3xl font-bold text-secondary-rose">{data.filter(g => g.rsvp === 'declined').length}</p>
                </GlassCard>
            </div>

            <GlassCard className="rounded-3xl overflow-hidden border border-white/10">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="px-8 py-5 text-[10px] text-gray-500 uppercase font-bold tracking-widest">Name</th>
                            <th className="px-8 py-5 text-[10px] text-gray-500 uppercase font-bold tracking-widest">Email</th>
                            <th className="px-8 py-5 text-[10px] text-gray-500 uppercase font-bold tracking-widest">Dietary</th>
                            <th className="px-8 py-5 text-[10px] text-gray-500 uppercase font-bold tracking-widest text-center">RSVP</th>
                            <th className="px-8 py-5 text-[10px] text-gray-500 uppercase font-bold tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.map((guest) => (
                            <tr key={guest.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-8 py-5">
                                    <p className="font-bold text-white group-hover:text-primary transition-colors">{guest.name}</p>
                                </td>
                                <td className="px-8 py-5 text-sm text-gray-400">{guest.email}</td>
                                <td className="px-8 py-5">
                                    <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase">
                                        {guest.diet}
                                    </span>
                                </td>
                                <td className="px-8 py-5 flex justify-center">
                                    <span className={`material-symbols-outlined text-center ${guest.rsvp === 'confirmed' ? 'text-emerald-400' :
                                            guest.rsvp === 'pending' ? 'text-amber-400' : 'text-secondary-rose'
                                        }`}>
                                        {guest.rsvp === 'confirmed' ? 'check_circle' :
                                            guest.rsvp === 'pending' ? 'schedule' : 'cancel'}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button className="text-gray-600 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-lg">more_horiz</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
};

export default GuestManager;
